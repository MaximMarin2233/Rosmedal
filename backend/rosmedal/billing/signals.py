from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User

from .models import Transaction


@receiver(post_save, sender=Transaction)
def set_user_balance(sender, instance: Transaction, **kwargs):
    transaction_user = instance.user
    if instance.balance == Transaction.BalanceChoices.MAIN:
        transaction_user.set_balance()
    elif instance.balance == Transaction.BalanceChoices.BONUS:
        transaction_user.set_bonus_balance()