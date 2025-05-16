from django.db import models


class Referral(models.Model):
    """Модель реферала"""
    referrer = models.ForeignKey(verbose_name="пригласивший", to='accounts.User',
                                on_delete=models.CASCADE, related_name='referrals')
    referral = models.OneToOneField(verbose_name="пользователь", to='accounts.User',
                                    on_delete=models.CASCADE, related_name='referral')
    
    class Meta:
        verbose_name = 'Реферал'
        verbose_name_plural = 'Рефералы'