from django.db import models


class PageChoices(models.TextChoices):
    OLYMPIADS = 'OLYMPIADS', 'Олимпиады'
    COURSES = 'COURSES', 'Курсы'
    PUBLICATIONS = 'PUBLICATIONS', 'Публикации'
    ARTICLES_PUBLICATION = 'ARTICLES_PUBLICATION', 'Публикация статей'
    OLYMPIADS_AND_COMPETITIONS = 'FAQ_OLYMPIADS_AND_COMPETITIONS', 'Олимпиады и конкурсы (FAQ)'
    FAQ_COURSES = 'FAQ_COURSES', 'Курсы (FAQ)'
    PAYMENT_AND_DELIVERY = 'PAYMENT_AND_DELIVERY', 'Оплата и доставка'
    CREATIVE_COMPETITION = 'CREATIVE_COMPETITION', 'Творческий конкурс'
    INTERNATIONAL_COMPETITION_REGULATIONS = 'INTERNATIONAL_COMPETITION_REGULATIONS', 'Положение о Международном конкурсе'


class PageFAQQuestion(models.Model):
    """Модель вопроса из FAQ на отдельной странице сайта"""
    category = models.CharField(verbose_name="Страница", max_length=255,
                            choices=PageChoices.choices)
    question = models.CharField(verbose_name="Вопрос", max_length=255)
    answer = models.TextField(verbose_name="Ответ")
    image = models.FileField(verbose_name="Изображение", upload_to="faq_images",
                             blank=True, null=True)

    def __str__(self):
        return f"Вопрос[{self.id}]"

    class Meta:
        verbose_name = "вопрос"
        verbose_name_plural = "вопросы"

