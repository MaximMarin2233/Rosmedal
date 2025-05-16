from django.conf import settings
from django.db import transaction

from yookassa import Configuration, Payment

from .models import Transaction


Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_API_KEY


@transaction.atomic()
def user_balance_replenish(user, amount):

    transaction = Transaction.objects.create(user=user, amount=amount,
                                             reason=Transaction.ReasonChoices.REPLENISHMENT,
                                             balance=Transaction.BalanceChoices.MAIN)
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
        "description": f"Пополнение баланса. ID транзакции: {transaction.id}",
        "metadata": {
            'transaction_id': transaction.id 
        }
    }) 
    return payment_response

