from django.db import models


class Transaction(models.Model):
    """Модель транзакции"""

    class StatusChoices(models.TextChoices):
        ACCEPTED = 'ACCEPTED', 'В обработке'
        SUCCESS = 'SUCCESS', 'Успешно'
        ERROR = 'ERROR', 'Ошибка'

    class BalanceChoices(models.TextChoices):
        MAIN = 'MAIN', 'Основной'
        BONUS = 'BONUS', 'Бонусный'


    class ReasonChoices(models.TextChoices):
        REPLENISHMENT = 'REPLENISHMENT', 'Пополнение'
        PURCHASE = 'PAYMENT', 'Покупка'

    user = models.ForeignKey('accounts.User', verbose_name="Пользователь", on_delete=models.SET_NULL,
                             null=True, related_name='transactions')
    amount = models.DecimalField(verbose_name="Сумма",
                                 max_digits=11, decimal_places=2)
    status = models.CharField(verbose_name="Статус", max_length=8,
                              choices=StatusChoices.choices,
                              default=StatusChoices.ACCEPTED)
    reason = models.CharField(verbose_name="Причина", max_length=15,
                              choices=ReasonChoices.choices)
    balance = models.CharField(verbose_name="Баланс", max_length=5,
                               choices=BalanceChoices.choices)
    order = models.ForeignKey(
        'orders.Order', verbose_name='Заказ',
        on_delete=models.SET_NULL, related_name='transaction',
        null=True, blank=True)
    created_at = models.DateTimeField(verbose_name="Дата создания", auto_now_add=True)

    def __str__(self):
        return f"Транзакция [{self.id}]"

    class Meta:
        verbose_name = "транзакция"
        verbose_name_plural = "транзакции"

    