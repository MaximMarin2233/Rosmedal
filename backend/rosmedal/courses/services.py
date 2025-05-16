import json
from typing import Optional, List, Tuple, Dict
from decimal import Decimal

from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from django.contrib.contenttypes.models import ContentType

from yookassa import Payment


from common.models import MailRecipient
from orders.models import PromotionalCode, Order, Purchase
from billing.models import Transaction
from docs.models import Document, DocumentVariation

from .models import UserCourse, Course


class CoursePurchaseService:

    def __init__(
        self,
        user_course: UserCourse, 
        additions=None,
        promotional_code: str = None,
    ) -> None:
        self.user_course = user_course
        self.additions = additions
        self.promotional_code = promotional_code

    def _calculate_user_course_price(self):
        """Считает стоимость заказа курса
    
        1. Цена курса со скидкой
        2. Дополнения
        3. Промокод
        4. Купон
        """
        user_course = self.user_course
        additions = self.additions
        promotional_code = self.promotional_code

        user = user_course.user
        course = user_course.course
        total_price = 0

        course_price = user_course.get_total_price()
        total_price += course_price
        if additions:
            addition_price = sum(addition.price for addition in additions)
            total_price += addition_price
        if promotional_code:
            total_price = total_price*(1-(promotional_code.discount_percentage/100))
        if user.number_of_coupons:
            total_price -= course.variation.coupon_discount

        return total_price

    def confirm_purchase(self):
        user_course = self.user_course
        additions = self.additions
        promotional_code = self.promotional_code

        user = user_course.user

        # Создаем заказ 
        order = Order.objects.create(
            user=user,
            price=self._calculate_user_course_price(),
            promotional_code=promotional_code
        )
        # Создаем покупки
        if additions:
            for addition in additions:
                Purchase.objects.create(
                    order=order,
                    content_type=ContentType.objects.get(model="usercourseaddition"),
                    object_id=addition.pk
                )
        Purchase.objects.create(
            order=order,
            content_type=ContentType.objects.get(model="usercourse"),
            object_id=user_course.pk
        )
        # Логика
        if user.number_of_coupons:
            user.number_of_coupons -= 1
            user.save()
        user_course.is_paid = True 
        if additions:
            user_course.additions.set(additions)
        user_course.save()

        self.user_course = user_course

    def purchase_course_through_balance(self):
        user_course = self.user_course

        user = user_course.user
        user_balance = user.get_balance()
        order_price = self._calculate_user_course_price()
        
        if order_price > user_balance:
            return None, {'error': 'insufficient funds',
                        'amount': order_price - user_balance}

        order = self.confirm_purchase()

        # Создаем транзакцию
        Transaction.objects.create(
            user=user,
            amount=-(order_price),
            status=Transaction.StatusChoices.SUCCESS,
            reason=Transaction.ReasonChoices.PURCHASE,
            balance=Transaction.BalanceChoices.MAIN,
            order=order
        )

        return user_course, None

    def purchase_course_through_yookassa(self):
        """Производит создание запроса на оплату курса через юкассу"""
        amount = self._calculate_user_course_price()
        user = self.user_course.user
        promotional_code = self.promotional_code
        addition_id_list = [addition.id for addition in self.additions] if self.additions else None

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
            "description": f"Запрос на оплату курса, ID пользователя: {user.id}",
            "metadata": {
                "user_course": str(self.user_course.id),
                "promotional_code": str(promotional_code.id) if promotional_code else None,
                "additions": json.dumps(addition_id_list)
            }
        }) 
        return payment_response, None


def send_collective_application_mail(application):

    subject = "Новая заявка на коллективное обучение"
    recipient_list = MailRecipient.objects.filter(is_active=True)
    message = str(application.formatted_data_as_string)
    print(message)

    send_mail(
        subject=subject,
        message=message,
        recipient_list=recipient_list,
        from_email=settings.DEFAULT_FROM_EMAIL
    )

    
def get_course_document_variation(course: Course):
    if course.variation.code_name == 'KPK':
        return DocumentVariation.objects.get(tag='КПК')
    if course.variation.code_name == 'KPP':
        return DocumentVariation.objects.get(tag='КПП')
    if course.variation.code_name == 'КОТ':
        return DocumentVariation.objects.get(tag='КОТ')

@transaction.atomic
def user_course_test_pass_confirm(
    user_course: UserCourse
) -> Tuple[Optional[UserCourse], Optional[Dict]]:
    """Переводит курс в статус оплаченный, создает документ о прохождении курса"""
    document_variation = get_course_document_variation(user_course.course)
    document_template = document_variation.templates.first()
    Document.objects.create(
        user=user_course.user,
        user_course=user_course,
        variation=document_variation,
        template=document_template,
        is_paid=True
    )
    user_course.test_passed = True
    user_course.save()

    return user_course, None
