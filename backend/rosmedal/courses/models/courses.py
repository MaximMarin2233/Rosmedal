from django.db import models
from django.utils import timezone

from .choices import (
    EducationDegreeChoices,
    SubjectChoices,
    NumberOfHoursChoices,
    CitizenshipChoices
)

from accounts.validators import snils_validator


class EducationDegree(models.Model):
    """Модель образования"""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Образование'
        verbose_name_plural = 'Образование'


class CourseVariation(models.Model):
    """Модель типа курса"""
    display_name = models.CharField(verbose_name="Название", max_length=255)
    code_name = models.CharField(verbose_name="Кодовое название", max_length=3)
    base_price = models.DecimalField(verbose_name="Базовая цена курса", 
                                     max_digits=11, decimal_places=2)
    discount_percentage = models.DecimalField(verbose_name="Процент скидки",
                                              max_digits=5, decimal_places=2)
    coupon_discount = models.DecimalField(verbose_name="Скидка по купону",
                                            max_digits=5, decimal_places=2)
    
    @property
    def total_price(self):
        """Конечная цена без купона"""
        if self.base_price is not None and self.discount_percentage is not None:
            discounted_price = self.base_price * (1 - self.discount_percentage / 100)
            return discounted_price
        return None
    
    def __str__(self):
        return self.display_name

    class Meta:
        verbose_name = "тип курсов"
        verbose_name_plural = "типы курсов"


class CourseVariationHourCoefficientPrice(models.Model):
    """Модель коэффициента цены курса по типу в зависимости от кол-ва часов"""
    variation = models.ForeignKey(verbose_name='Тип курса', to='courses.CourseVariation',
                                  on_delete=models.CASCADE, related_name='hour_coefficients')
    number_of_hours = models.IntegerField(verbose_name="Кол-во часов", choices=NumberOfHoursChoices.choices)
    price_coefficient = models.DecimalField(verbose_name="Коэффициент стоимости",
                                            max_digits=4, decimal_places=2)
    discount_percentage = models.DecimalField(verbose_name="Процент скидки", default=40,
                                              max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f'{self.variation.display_name} [{self.number_of_hours} ч.]'
    
    class Meta:
        verbose_name = "коэффициент стоимости курса"
        verbose_name_plural = "коэффициенты стоимости курсов"

    
class Course(models.Model):
    """Модель курса"""
    title = models.TextField(verbose_name="Название")
    short_description = models.TextField(verbose_name="Краткое описание",
                                         null=True, blank=True)

    description = models.TextField(verbose_name="О программе",
                                   null=True, blank=True)
    goal = models.TextField(verbose_name="Цель",
                            null=True, blank=True)
    content = models.TextField(verbose_name="Курс содержит",
                               null=True, blank=True)
    categories_of_listeners = models.TextField(verbose_name="Категории слушателей",
                                               null=True, blank=True)
    traineeship = models.TextField(verbose_name="Стажировка",
                                   null=True, blank=True)
    final_examination = models.TextField(verbose_name="Итоговая аттестация",
                                         null=True, blank=True)
    issued_document = models.TextField(verbose_name="Выдаваемый документ",
                                       null=True, blank=True)
    
    variation = models.ForeignKey(verbose_name='Тип курса', to='courses.CourseVariation',
                                  on_delete=models.CASCADE, related_name='courses')
    education_degree = models.ManyToManyField(verbose_name="Образование", to="courses.EducationDegree")
    subjects = models.ManyToManyField(verbose_name="Предметы", to="olympiads.Subject")
    
    image = models.FileField(verbose_name="Изображение", upload_to='courses',
                             null=True, blank=True)
    
    test = models.ForeignKey(verbose_name="Итоговое тестирование", to="olympiads.Olympiad",
                             on_delete=models.SET_NULL, related_name="courses",
                             null=True, blank=True)
    
    teaching_materials = models.FileField(verbose_name="Методические материалы", upload_to="courses/materials",
                                          null=True, blank=True)

    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "курс"
        verbose_name_plural = "курсы"
        ordering = ['title']


class UserCourseAddition(models.Model):
    """Модель дополнительной услуги к курсу"""
    title = models.CharField(verbose_name="Название", max_length=255)
    price = models.DecimalField(verbose_name="Цена",
                                max_digits=11, decimal_places=2)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "дополнительная услуга курса"
        verbose_name_plural = "дополнительные услуги курсов"


class UserCourse(models.Model):
    """Модель курса пользователя"""
    user = models.ForeignKey(verbose_name="Пользователь", to="accounts.User",
                             on_delete=models.CASCADE, related_name="courses")
    course = models.ForeignKey(verbose_name="Курс", to="courses.Course",
                               on_delete=models.CASCADE, related_name="user_courses")
    number_of_hours = models.IntegerField(verbose_name="Кол-во часов", choices=NumberOfHoursChoices.choices)
    last_name = models.CharField(verbose_name="Фамилия", max_length=255,
                                 null=True, blank=True)
    first_name = models.CharField(verbose_name="Имя", max_length=255,
                                  null=True, blank=True)
    patronymic = models.CharField(verbose_name="Отчество", max_length=255,
                                  null=True, blank=True)
    date_of_birth = models.DateField(verbose_name="Дата рождения",
                                     null=True, blank=True)
    gender = models.CharField(verbose_name="Пол", max_length=5,
                              choices=[('MAN', 'Мужчина'), ('WOMAN', 'Женщина')],
                              null=True, blank=True)
    citizenship = models.CharField(verbose_name="Гражданство", max_length=255,
                                   choices=CitizenshipChoices.choices,
                                   null=True, blank=True)
    education_degree = models.CharField(verbose_name="Образование", max_length=255,
                                        choices=EducationDegreeChoices.choices,
                                        null=True, blank=True)
    diploma_series = models.CharField(verbose_name="Серия диплома", max_length=255,
                                      null=True, blank=True)
    diploma_number = models.CharField(verbose_name="Номер диплома", max_length=255,
                                      null=True, blank=True)
    graduation_date = models.CharField(verbose_name="Год получения диплома", max_length=4,
                                       null=True, blank=True)
    qualification = models.CharField(verbose_name="Квалификация в соответствии с документом об образовании", max_length=255,
                                     null=True, blank=True)
    position = models.CharField(verbose_name="Должность", max_length=255,
                                null=True, blank=True)
    snils = models.CharField(verbose_name="СНИЛС", max_length=255,
                             validators=[snils_validator],
                             null=True, blank=True)
    delivery_address = models.TextField(verbose_name="Адрес и индекс для доставки удостоверения почтой России",
                                        null=True, blank=True)
    track_number = models.CharField(verbose_name="Трек-номер", max_length=255,
                                    null=True, blank=True)
    diploma_scan = models.FileField(verbose_name="Скан диплома", upload_to="user_courses",
                                    null=True, blank=True)
    is_paid = models.BooleanField(verbose_name="Оплачен", choices=[(True, 'Да'), (False, 'Нет')],
                                  default=False)
    additions = models.ManyToManyField(verbose_name="Дополнения", to="courses.UserCourseAddition",
                                       related_name="courses", blank=True)
    test_passed = models.BooleanField(verbose_name="Итоговое тестирование пройдено",
                                      choices=[(True, "Да"), (False, "Нет")],
                                      default=False)
    created_at = models.DateTimeField(verbose_name="Добавлен", default=timezone.now)

    def get_total_price(self):
        discount_percentage = self.course.variation.discount_percentage
        base_price = self.course.variation.base_price
        hour_coefficient = self.course.variation.hour_coefficients.get(number_of_hours=self.number_of_hours).price_coefficient
        total_price = base_price*hour_coefficient*(1-(discount_percentage/100))
        return total_price
    
    def is_data_filled(self):
        required_fields = [
            self.last_name,
            self.first_name,
            self.patronymic,
            self.date_of_birth,
            self.gender,
            self.citizenship,
            self.education_degree,
            self.diploma_series,
            self.diploma_number,
            self.graduation_date,
            self.qualification,
            self.position,
            self.snils,
            self.delivery_address,
            self.diploma_scan,
        ]

        return all(field is not None and field != '' for field in required_fields)

    def __str__(self):
        return f"Курс пользователя [{self.id}]"

    class Meta:
        verbose_name = "курс пользователя"
        verbose_name_plural = "курсы пользователей"


class CourseSyllabus(models.Model):
    """Модель учебного плана"""
    course = models.ForeignKey(verbose_name="Курс", to="courses.Course", on_delete=models.CASCADE, related_name="syllabuses")
    course_hours = models.IntegerField(verbose_name="Количество часов курса", choices=NumberOfHoursChoices.choices)

    def __str__(self):
        return f'{self.course.title} [{self.course_hours} ч.]'

    class Meta:
        verbose_name = "учебный план"
        verbose_name_plural = "учебные планы"


class CourseSyllabusModule(models.Model):
    """Модель модуля учебного плана курса"""
    syllabus = models.ForeignKey(verbose_name="Учебный план", to="courses.CourseSyllabus",
                                 on_delete=models.CASCADE, related_name="modules")

    title = models.CharField(verbose_name="Название", max_length=255)
    number_of_hours = models.IntegerField(verbose_name="Кол-во часов")
    number_of_lectures = models.IntegerField(verbose_name="Кол-во лекций")
    number_of_independent_works = models.IntegerField(verbose_name="Кол-во самостоятельных работ")
    number_of_control_hours = models.IntegerField(verbose_name="Кол-во часов контроля", default=2)

    module_order = models.PositiveSmallIntegerField(default=0, db_index=True)

    def __str__(self):
        return f'Модуль {self.module_order}'
    
    class Meta:
        verbose_name = "модуль учебного плана"
        verbose_name_plural = "модули учебных планов"
        ordering = ["module_order"]