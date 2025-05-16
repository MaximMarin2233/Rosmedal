import decimal
import json

from typing import List, Tuple, Optional, Dict

from django.db import transaction
from django.db.models import QuerySet
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

from yookassa import Payment

from accounts.models import User
from orders.models import PromotionalCode, Order, Purchase
from billing.models import Transaction
from referral.models import Referral

from .models import Document


class DocumentPurchaseService:

    def __init__(
        self, documents: List[Document], user: User, promotional_code: PromotionalCode,
        use_bonus: bool=True
    ):
        self.documents = documents
        self.user = user
        self.promotional_code = promotional_code
        self.use_bonus = use_bonus

        self._count_of_bonus_documents = self._get_count_of_bonus_documents()


    def _count_non_promotional_documents(self) -> int:
        """Считает кол-во документов, не участвующих в акции 3=2"""
        documents = self.documents
        count = 0
        for i in range(0, len(documents)):
            if (i + 1) % 3:
                count += 1
        return count

    def _get_count_of_bonus_documents(self):
        """Максимальное кол-во документов, оплачиваемых бонусов"""
        user = self.user
        count_of_documents = len(self.documents)

        bonus_balance = user.get_bonus_balance()

        max_count_of_free_documents = int(bonus_balance // 100)

        if max_count_of_free_documents >= count_of_documents:
            return count_of_documents
        else:
            return max_count_of_free_documents


    def _calculate_bonus_part(self) -> decimal.Decimal:
        """Считает сумму, которая выделена на бонусы"""
        use_bonus = self.use_bonus

        if use_bonus:
            return self._count_of_bonus_documents*200
            
        return 0


    def _calculate_documents_price(self) -> decimal.Decimal:
        """Считает цену заказа документов
        
        1. Считает цену документов, учитывая акция 2=3
        2. Если есть промокод, применяет скидку
        3. Списывает бонусы, если есть такая возможность
        """
        documents = self.documents
        promotional_code = self.promotional_code
        price = 0
        # здесь нужно проходиться по документам, которые оплачиваются не бонусами
        count_of_documents = len(documents)
        if self.use_bonus:
            count_of_documents -= self._count_of_bonus_documents
        for i in range(count_of_documents):
            document = documents[i]
            if (i+1)%3:
                price += document.variation.price
        if promotional_code:
            price = price*(1-(promotional_code.discount_percentage/100))
        return price

    def confirm_purchase(self):
        user = self.user
        total_price = self._calculate_documents_price()
        promotional_code = self.promotional_code
        documents = self.documents
        use_bonus = self.use_bonus
        # создание заказа
        order = Order.objects.create(
            user=user,
            price=total_price,
            promotional_code=promotional_code
        )
        for doc in documents:
            Purchase.objects.create(
                order=order,
                content_type=ContentType.objects.get(model='document'),
                object_id=doc.id
            )
        # Начисление бонусов рефералам
        count_of_non_promotional_documents = self._count_non_promotional_documents()
        try:
            user_referral_instance = Referral.objects.get(referral=user)
        except Referral.DoesNotExist:
            user_referral_instance = None
        if user_referral_instance:
            Transaction.objects.create(
                user=user.referral.referrer,
                amount=count_of_non_promotional_documents*20,
                status=Transaction.StatusChoices.SUCCESS,
                reason=Transaction.ReasonChoices.REPLENISHMENT,
                balance=Transaction.BalanceChoices.BONUS,
                order=order
            )
        for doc in documents:
            doc.is_paid = True
        Document.objects.bulk_update(documents, ['is_paid'])
        if use_bonus:
            # Списание бонусов с бонусного счета
            Transaction.objects.create(
                user=user,
                amount=-(self._count_of_bonus_documents)*100 ,
                status=Transaction.StatusChoices.SUCCESS,
                reason=Transaction.ReasonChoices.PURCHASE,
                balance=Transaction.BalanceChoices.BONUS,
                order=order
            )
        return order

    def purchase_documents_through_balance(self) -> Tuple[Optional[QuerySet[Document]], Optional[Dict]]:
        """Производит оплату документов через баланс
        
        1. Считает цену заказа
        2. Создает объекты покупок и заказов
        3. Создает транзакции снятия со счетов
        4. Обновляет документы
        """
        user = self.user
        documents = self.documents
        user_balance = user.get_balance()
        total_price = self._calculate_documents_price()

        if total_price > user_balance:
            return None, {'error': 'insufficient funds',
                        'amount': total_price - user_balance}
        
        order = self.confirm_purchase()
        
        # Оплата с основного счета
        Transaction.objects.create(
            user=user,
            amount=-(total_price),
            status=Transaction.StatusChoices.SUCCESS,
            reason=Transaction.ReasonChoices.PURCHASE,
            balance=Transaction.BalanceChoices.MAIN,
            order=order
        )

        return documents, None
    
    def purchase_documents_through_yookassa(self):
        """Производит создание запроса на оплату документов через юкассу"""
        amount = self._calculate_documents_price()
        document_id_list = [doc.id for doc in self.documents]

        if amount <= 0:
            return None, "cost is zero"

        payment_response = Payment.create({
            "amount": {
                "value": amount,
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": settings.YOOKASSA_RETURN_URL
            },
            "capture": True,
            "description": f"Запрос на оплату документов, ID пользователя: {self.user.id}",
            "metadata": {
                'documents': json.dumps(document_id_list),
                'user': str(self.user.id),
                "promotional_code": str(self.promotional_code.id) if self.promotional_code else None,
                "use_bonus": self.use_bonus
            }
        }) 
        return payment_response, None

    
    