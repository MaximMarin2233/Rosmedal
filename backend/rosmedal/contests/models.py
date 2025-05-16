from django.db import models
from django.utils import timezone


class ContestLevelChoices(models.TextChoices):
    INTERNATIONAL = 'INTNAT', 'Международный'
    ALL_RUSSIAN = 'ALRUSS', 'Всероссийский'
    INTERREGIONAL = 'INTREG', 'Межрегиональный'


class ContestWork(models.Model):
    """Модель конкурсной работы"""
    title = models.CharField(verbose_name="Название", max_length=255)
    nomination = models.CharField(verbose_name="Номинация", max_length=255)
    author_full_name = models.TextField(verbose_name="ФИО автора")
    author_email = models.EmailField(verbose_name="E-mail автора")

    place = models.IntegerField(verbose_name="Занятое место")

    level = models.CharField(verbose_name="Уровень конкурса", max_length=255,
                             choices=ContestLevelChoices.choices)
    
    created_at = models.DateTimeField(verbose_name="Дата создания", default=timezone.now)

    def __str__(self):
        return f'{self.title}[{self.id}]'

    class Meta:
        verbose_name = 'конкурсная работа'
        verbose_name_plural = 'конкурсные работы'


class ContestWorkPlace(models.Model):
    """Модель выпадающего места в конкурсной работе"""
    place = models.PositiveIntegerField(verbose_name="Место")

    def __str__(self):
        return f'{self.place}'

    class Meta:
        verbose_name = "выпадающее место"
        verbose_name_plural = "выпадающие места"