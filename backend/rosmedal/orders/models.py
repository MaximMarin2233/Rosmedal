from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class PromotionalCode(models.Model):
    """Модель промокода"""
    code = models.CharField(verbose_name="Промокод", max_length=255, unique=True)
    discount_percentage = models.DecimalField(verbose_name="Процент скидки",
                                              max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"Промокод {self.id}"
    
    class Meta:
        verbose_name = "промокод"
        verbose_name_plural = "промокоды"


class Order(models.Model):
    """Модель заказа"""
    user = models.ForeignKey('accounts.User',  
                             on_delete=models.SET_NULL, verbose_name='Пользователь',
                             related_name='orders', null=True)
    promotional_code = models.ForeignKey('orders.PromotionalCode', 
                                         on_delete=models.SET_NULL, verbose_name='Промокод',
                                         null=True, related_name='orders')
    price = models.DecimalField(verbose_name="Стоимость",
                                max_digits=11, decimal_places=2)
    created_at = models.DateTimeField(verbose_name="Дата создания", default=timezone.now)
    
    def __str__(self):
        return f'Заказ [{self.id}]'

    class Meta:
        verbose_name = 'заказ'
        verbose_name_plural = 'заказы'


class Purchase(models.Model):
    """Модель покупки"""
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE,
                              related_name='purchases')
    
    content_type = models.ForeignKey(ContentType, on_delete=models.RESTRICT,
                                     verbose_name="Тип покупки")
    object_id = models.CharField(max_length=128, verbose_name="ID")
    product = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.product._meta.verbose_name

    class Meta:
        verbose_name = 'покупка'
        verbose_name_plural = 'покупки'
