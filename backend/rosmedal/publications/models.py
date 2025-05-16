from django.db import models


class Publication(models.Model):
    """Модель публикации"""
    author_email = models.EmailField(verbose_name="E-mail автора")
    author_full_name = models.CharField(verbose_name="ФИО автора", max_length=255)
    topic = models.TextField(verbose_name="Название статьи")
    short_description = models.TextField(verbose_name="Краткое описание")
    text = models.TextField(verbose_name="Текст статьи")
    created_at = models.DateTimeField(verbose_name="Дата публикации", auto_now_add=True)

    @property
    def formatted_data(self):
        data = {
            self._meta.get_field('author_email').verbose_name: self.author_email,
            self._meta.get_field('author_full_name').verbose_name: self.author_full_name,
            self._meta.get_field('topic').verbose_name: self.topic,
            self._meta.get_field('short_description').verbose_name: self.short_description,
        }
        data_as_string = '\n'.join([f'{k}: {v}' for k, v in data.items()])
        formatted_data = f"Данные:\n\n{data_as_string}"
        return formatted_data
    
    def __str__(self):
        return "Публикация"

    class Meta:
        verbose_name = 'публикация'
        verbose_name_plural = 'публикации'
        ordering = ['-created_at']