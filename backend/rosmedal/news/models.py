from django.db import models
from django.utils import timezone


class News(models.Model):
    """Модель новости"""
    title = models.CharField(verbose_name="Название", max_length=255)
    text = models.TextField(verbose_name="Текст")
    image = models.FileField(verbose_name="Изображение", upload_to='news',
                             null=True, blank=True)
    date_created = models.DateTimeField(verbose_name="Дата публикации", default=timezone.now)
    reading_time = models.IntegerField(verbose_name="Время чтения в минутах",)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "новость"
        verbose_name_plural = "новости"
        ordering = ['-date_created']
