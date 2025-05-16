from django.db import models
from django.utils import timezone


class FormRequest(models.Model):
    """Модель обращения через форму обратной связи"""
    client_name = models.CharField(verbose_name="Имя", max_length=255)
    client_email = models.EmailField(verbose_name="Почта")
    text = models.TextField(verbose_name="Текст")
    
    created_at = models.DateTimeField(verbose_name="Дата обращения", default=timezone.now)

    @property
    def formatted_message(self):
        """Возвращает отформатированное сообщение для отправки на почту"""
        return (
            f"Имя клиента: {self.client_name}\n"
            f"Почта клиента: {self.client_email}\n"
            f"Дата обращения: {self.created_at.strftime('%d.%m.%Y %H:%M')}\n\n"
            f"Текст обращения:\n{self.text}\n"
        )

    def __str__(self):
        return f"Обращение [{self.id}]"

    class Meta:
        db_table = "form_requests"
        verbose_name = "обращение"
        verbose_name_plural = "обращения"


class EmailTemplate(models.Model):
    """Модель шаблона письма"""
    name = models.CharField(max_length=255, unique=True, verbose_name="Название шаблона")
    subject = models.CharField(max_length=255, verbose_name="Тема письма")
    body = models.TextField(verbose_name="Содержимое письма (HTML)")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Шаблон письма"
        verbose_name_plural = "Шаблоны писем"

    
class MailRecipient(models.Model):
    """Модель получателя почты (менеджера)"""
    email = models.EmailField(verbose_name="E-mail")
    is_active = models.BooleanField(verbose_name="Действующий", choices=[(True, 'Да'), (False, 'Нет')])

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "получатель почты"
        verbose_name_plural = "получатели почты (коллективные заявки, обращения)"


class Review(models.Model):
    """Модель отзыва на стороннем ресурсе"""
    user = models.ForeignKey(verbose_name="Пользователь", to='accounts.User',
                             on_delete=models.CASCADE, related_name='reviews')
    link = models.URLField(verbose_name="Ссылка")
    image = models.FileField(verbose_name="Скриншот отзыва", upload_to='reviews')
    is_confirmed = models.BooleanField(verbose_name="Подтвержден", 
                                       choices=[(True, "Да"), (False, "Нет")],
                                       default=False)

    def __str__(self):
        return f'Отзыв [{self.id}]'

    class Meta:
        verbose_name = "отзыв"
        verbose_name_plural = "отзывы"


class HomeReview(models.Model):
    """Модель отзыва на главной странице"""
    image = models.FileField(verbose_name="Изображение", upload_to="home_reviews")
    
    def __str__(self):
        return f"Отзыв [{self.id}]"

    class Meta:
        verbose_name = "отзыв на главной"
        verbose_name_plural  = "отзывы на главной"
