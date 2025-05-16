from django.db import models

from contests.models import ContestLevelChoices

# Благодарственное письмо
# Творческий конкурс
# Олимпиада
# Публикация


class DocumentChoices(models.TextChoices):
    THANK_YOU_LETTER = 'thank_you_letter', 'Благодарственное письмо'
    CREATIVE_CONTEST = 'creative_contest', 'Творческий конкурс'
    OLYMPIAD = 'olympiad', 'Участие в олимпиаде'
    PUBLICATION = 'publication', 'Публикация'


class AchievementTypeChoices(models.IntegerChoices):
    PARTICIPATION_INTERNET_OLYMPIADS = 1, 'за активное участие в интернет-олимпиадах на портале “Росмедаль” и достижения в профессиональном мастерстве'
    HIGH_LEVEL_PREPARATION = 2, 'за высокий уровень подготовки участников Международного творческого конкурса, проводимого на портале “Росмедаль”'
    ACTIVE_PUBLICATION = 3, 'за активную публикацию статей и методических материалов на портале “Росмедаль”'
    HELP_WITH_PORTAL = 4, 'за активную помощь в наполнении Международного образовательного портала “Росмедаль”'
    PARTICIPATION_CREATIVE_CONTESTS = 5, 'за активное участие в творческих конкурсах, конкурсах профессионального мастерства и подготовку участников-лауреатов олимпиад на портале “Росмедаль”'
    FRUITFUL_COOPERATION = 6, 'за плодотворное сотрудничество и подготовку участников олимпиад и конференций на портале “Росмедаль”'
    SPECIAL_ACHIEVEMENTS = 7, 'за особые достижения в профессиональной деятельности'
    TECHNOLOGY_IMPLEMENTATION = 8, 'за успешное внедрение современных технологий'
    PERSONAL_CONTRIBUTION = 9, 'за личный вклад во внедрение новых методик обучения'
    PROFESSIONAL_COMPETENCE = 10, 'за постоянное повышение профессиональной компетентности и ответственности с пожеланием успехов в ответственной работе, новых творческих идей и замыслов, осуществления запланированных дел'
    OUTSTANDING_QUALITIES = 11, 'за выдающиеся профессиональные качества'
    PROFESSIONALISM_AND_HARD_WORK = 12, 'за высокий профессионализм, творческий поиск и упорный труд'
    PARTICIPATION_AND_PREPARATION = 13, 'за активное участие и подготовку участников-лауреатов олимпиад на портале “Росмедаль”'


class DocumentVariationTemplate(models.Model):
    """Модель шаблона отдельного типа документа"""
    variation = models.ForeignKey("docs.DocumentVariation", on_delete=models.CASCADE,
                                  related_name="templates")
    preview = models.FileField(verbose_name="Превью", upload_to="documents/templates/previews",
                               null=True, blank=True)
    additional_preview = models.FileField(verbose_name="Доп. превью", upload_to="documents/templates/previews",
                                          null=True, blank=True)
    

    def __str__(self):
        return f"Шаблон [{self.id}]"

    class Meta:
        verbose_name_plural = "шаблоны документов"
        verbose_name = "шаблон документа"


class DocumentVariation(models.Model):
    """Модель типа документа"""
    title = models.CharField(verbose_name="Название", max_length=255)
    price = models.DecimalField(verbose_name="Цена",
                                max_digits=11, decimal_places=2,
                                null=True, blank=True)
    tag = models.CharField(verbose_name="Тэг", max_length=4)
    
    def __str__(self):
        return f'{self.title}'

    class Meta:
        verbose_name = 'тип документа'
        verbose_name_plural = 'типы документов'


class Document(models.Model):
    """Модель документа"""
    user = models.ForeignKey(verbose_name="Пользователь", to='accounts.User',
                             on_delete=models.CASCADE)
    template = models.ForeignKey(verbose_name="Шаблон", to='docs.DocumentVariationTemplate',
                                 on_delete=models.SET_NULL, null=True)
    full_name = models.CharField(verbose_name="ФИО участника", max_length=255)
    institution_name = models.CharField(verbose_name="Название учреждения", max_length=255)
    locality = models.CharField(verbose_name="Населённый пункт", max_length=255)
    variation = models.ForeignKey(verbose_name="Тип документа", to="docs.DocumentVariation",
                                  on_delete=models.CASCADE, related_name='documents')
    is_paid = models.BooleanField(verbose_name="Оплачен", choices=[(True, 'Да'), (False, 'Нет')],
                                  default=False)
    leader = models.CharField(verbose_name="Руководитель", max_length=255,
                              null=True, blank=True)
    participation_date = models.DateField(verbose_name="Дата участия",
                                          null=True, blank=True)
    for_whom = models.CharField(verbose_name="Для кого", max_length=11,
                                choices=[('PARTICIPANT', 'Участник'), ('LEADER', 'Руководитель')],
                                null=True, blank=True)
    nomination = models.CharField(verbose_name="Номинация", max_length=255,
                                  null=True, blank=True)
    
    place = models.PositiveSmallIntegerField(verbose_name="Место", 
                                             choices=[
                                                 (1, "1 место"), 
                                                 (2, "2 место"), 
                                                 (3, "3 место"),
                                                 (4, "Участник")],
                                             null=True, blank=True)
    level = models.CharField(verbose_name="Тип конкурса", choices=ContestLevelChoices.choices,
                             max_length=6, null=True, blank=True) 
    project_name = models.CharField(verbose_name="Название работы", max_length=255,
                                    null=True, blank=True)
    
    # Max
    published_by = models.TextField(verbose_name="Кто опубликовал",
                                    null=True, blank=True)


    additional_nomination = models.IntegerField(verbose_name="Номинация в благодарственном письме",
                                                choices=AchievementTypeChoices.choices,
                                                null=True, blank=True)

    user_course = models.OneToOneField(verbose_name="Курс", to="courses.UserCourse",
                                       on_delete=models.CASCADE, related_name="document",
                                       null=True, blank=True)
    
    def __str__(self):
        return f"Документ: {self.variation.title} [{self.id}]"

    class Meta:
        verbose_name = "документ"
        verbose_name_plural = "документы"
