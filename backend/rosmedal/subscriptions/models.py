from django.db import models
from django.utils import timezone


class Subscription(models.Model):
    """Модель подписки"""
    title = models.CharField(verbose_name="Название", max_length=255)
    price = models.DecimalField(verbose_name="Стоимость", 
                                max_digits=11, decimal_places=2)
    duration = models.IntegerField(verbose_name="Длительность (в мес.)")

    def __str__(self):
        return f"{self.title}"

    class Meta:
        verbose_name = "подписка"
        verbose_name_plural = "подписки"


class UserSubscription(models.Model):
    """Модель подписки пользователя"""
    user = models.ForeignKey(verbose_name="Пользователь", to="accounts.User",
                             on_delete=models.CASCADE, related_name='subscriptions')
    subscription = models.ForeignKey(verbose_name="Подписка", to='subscriptions.Subscription',
                                     on_delete=models.CASCADE, related_name="user_subscriptions") 
    start_date = models.DateTimeField(verbose_name="Дата оформления", auto_now_add=True)
    end_date = models.DateTimeField(verbose_name="Дата окончания")

    def renew(self, duration_in_days: int):
        self.end_date += timezone.timedelta(days=duration_in_days)
        self.save()

    def __str__(self):
        return f"Подписка пользователя"

    class Meta:
        verbose_name = 'подписка пользователя'
        verbose_name_plural = 'подписки пользователей'
