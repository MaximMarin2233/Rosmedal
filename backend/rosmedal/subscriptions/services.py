from typing import Tuple, Optional
import json

from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

from yookassa import Payment

from accounts.models import User
from billing.models import Transaction
from orders.models import Order, Purchase
from accounts.models import User

from .models import UserSubscription, Subscription


class SubscriptionPurchaseService:

    def __init__(self, user: User, subscription: Subscription) -> None:
        self.user = user
        self.subscription = subscription

    def confirm_purchase(self):
        user = self.user
        subscription = self.subscription
        
        # Создать purchase, Создать order, Создать UserSubscription, создать транзакцию оплаты
        order = Order.objects.create(
            user=user,
            price=subscription.price
        )
        purchase = Purchase.objects.create(
            order=order,
            content_type=ContentType.objects.get(model='subscription'),
            object_id=subscription.id
        )

        # Продлеваем или создаём новую подписку
        active_subscription = user.get_active_subscription()
        if active_subscription:
            active_subscription.renew(subscription.duration*30)
        else:
            active_subscription = UserSubscription.objects.create(
                user=user,
                end_date=timezone.now() + timezone.timedelta(days=subscription.duration*30),
                subscription=subscription
            )
        self.active_subscription = active_subscription

        # Начисляем купоны
        user.number_of_coupons += subscription.duration

        # Начисляем бонусные рубли
        Transaction.objects.create(
            user=user,
            amount=subscription.duration*100,
            status=Transaction.StatusChoices.SUCCESS,
            reason=Transaction.ReasonChoices.REPLENISHMENT,
            balance=Transaction.BalanceChoices.BONUS,
            order=order
        )

        return order

    def purchase_subscription_through_balance(self):
        """Оформляет или продлевает подписку пользователя"""
        user = self.user
        subscription = self.subscription

        user_balance = self.user.get_balance()

        if subscription.price > user_balance:
            return None, 'insufficient funds'
        
        order = self.confirm_purchase()

        Transaction.objects.create(
            user=user,
            amount=-(subscription.price),
            status=Transaction.StatusChoices.SUCCESS,
            reason=Transaction.ReasonChoices.PURCHASE,
            balance=Transaction.BalanceChoices.MAIN,
            order=order
        )

        return self.active_subscription, None
    
    def purchase_subcription_through_yookassa(self):
        """Производит создание запроса на оплату подписки через юкассу"""
        subscription = self.subscription

        payment_response = Payment.create({
            "amount": {
                "value": subscription.price,
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": settings.YOOKASSA_RETURN_URL
            },
            "capture": True,
            "description": f"Запрос на оплату подписки, ID пользователя: {self.user.id}",
            "metadata": {
                'subscription': str(subscription.id),
                'user': str(self.user.id),
            }
        }) 
        return payment_response, None


def purchase_subscription(user: User, subscription: Subscription) -> Tuple[Optional[UserSubscription], Optional[str]]:
    """Оформляет или продлевает подписку пользователя"""
    user_balance = user.get_balance()

    if subscription.price > user_balance:
        return None, 'insufficient funds'
    
    # Создать purchase, Создать order, Создать UserSubscription, создать транзакцию оплаты
    order = Order.objects.create(
        user=user,
        price=subscription.price
    )
    purchase = Purchase.objects.create(
        order=order,
        content_type=ContentType.objects.get(model='subscription'),
        object_id=subscription.id
    )
    Transaction.objects.create(
        user=user,
        amount=-(subscription.price),
        status=Transaction.StatusChoices.SUCCESS,
        reason=Transaction.ReasonChoices.PURCHASE,
        balance=Transaction.BalanceChoices.MAIN,
        order=order
    )

    # Продлеваем или создаём новую подписку
    active_subscription = user.get_active_subscription()
    if active_subscription:
        active_subscription.renew(subscription.duration*30)
    else:
        active_subscription = UserSubscription.objects.create(
            user=user,
            end_date=timezone.now() + timezone.timedelta(days=subscription.duration*30),
            subscription=subscription
        )

    # Начисляем купоны
    user.number_of_coupons += subscription.duration

    # Начисляем бонусные рубли
    Transaction.objects.create(
        user=user,
        amount=subscription.duration*100,
        status=Transaction.StatusChoices.SUCCESS,
        reason=Transaction.ReasonChoices.REPLENISHMENT,
        balance=Transaction.BalanceChoices.BONUS,
        order=order
    )

    return active_subscription, None
