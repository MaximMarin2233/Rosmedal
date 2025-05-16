from decimal import Decimal

from django.db import models
from django.utils import timezone

from .choices import NumberOfHoursChoices


class CourseCollectiveApplication(models.Model):
    """Модель коллективной заявки на обучение"""
    user = models.ForeignKey('accounts.User', verbose_name="Пользователь",
                             on_delete=models.CASCADE,
                             related_name='applications')
    created_at = models.DateTimeField(verbose_name="Дата создания", default=timezone.now)
    
    @property
    def total_price(self):
        total_price = 0
        # Скидка по кол-ву человек
        discount_map = {}
        for i in range(5, 31):
            if i < 26:
                discount_map.update({i: i+5})
            else:
                discount_map.update({i: 30})
        
        students = self.students.all().select_related('course')
        for student in students:
            course = student.course
            number_of_hours = student.number_of_hours
            course_variation = course.variation
            discount = course.variation.discount_percentage
            price_without_discount = course_variation.base_price * course_variation.hour_coefficients.get(number_of_hours=number_of_hours).price_coefficient
            price = price_without_discount - price_without_discount*(discount//100)
            total_price += price
        collective_discount = discount_map.get(students.count(), 0)
        total_price = total_price * Decimal((1 - collective_discount/100))
        return total_price

    @property
    def formatted_data_as_string(self):
        data = self.formatted_data
        coordinator_str = '\n'.join([f"{key}: {value}" for key, value in data["Данные координатора"].items()])
        students_str = '\n\n'.join([
            '\n'.join([f"{key}: {value}" for key, value in student.items()]) 
            for student in data["Данные студентов"]
        ])
        
        return f"Данные координатора:\n\n{coordinator_str}\n\n\nДанные студентов:\n\n{students_str}"

    @property
    def formatted_data(self):
        coordinator_data = self.coordinator.formatted_data if self.coordinator else {}
        students_data = [student.formatted_data for student in self.students.all()]
        
        return {
            "Данные координатора": coordinator_data,
            "Данные студентов": students_data,
        }
    
    def __str__(self):
        return f'Заявка на коллективное обучение [{self.id}]'

    class Meta:
        verbose_name = "заявка на коллективное обучение"
        verbose_name_plural = "заявки на коллективное обучение"

    
class CourseCollectiveApplicationCoordinator(models.Model):
    """Модель координатор коллективной заявки на обучение"""
    application = models.OneToOneField(verbose_name="Заявка", to='CourseCollectiveApplication',
                                       on_delete=models.CASCADE, related_name='coordinator')
    full_name = models.CharField(verbose_name="ФИО", max_length=255)
    phone_number = models.CharField(verbose_name="Номер телефона", max_length=255)
    email = models.EmailField(verbose_name="E-mail")
    delivery_address = models.TextField(verbose_name="Адрес доставки документов")

    @property
    def formatted_data(self):
        return {
            self._meta.get_field('full_name').verbose_name: self.full_name,
            self._meta.get_field('phone_number').verbose_name: self.phone_number,
            self._meta.get_field('email').verbose_name: self.email,
            self._meta.get_field('delivery_address').verbose_name: self.delivery_address,
        }

    def __str__(self):
        return f'Координатор на коллективное обучение'

    class Meta:
        verbose_name = "координатор заявки коллективное обучение"
        verbose_name_plural = "координаторы заявки коллективное обучение"


class CourseCollectiveApplicationStudent(models.Model):
    """Модель обучающегося коллективной заявки на обучение"""
    application = models.ForeignKey(verbose_name="Заявка", to='CourseCollectiveApplication',
                                    on_delete=models.CASCADE, related_name='students')
    full_name = models.CharField(verbose_name="ФИО", max_length=255)
    course = models.ForeignKey(verbose_name="Курс", to='courses.Course',
                               on_delete=models.CASCADE, related_name="application_students")
    number_of_hours = models.IntegerField(verbose_name="Количество часов", choices=NumberOfHoursChoices.choices)

    @property
    def formatted_data(self):
        return {
            self._meta.get_field('full_name').verbose_name: self.full_name,
            self._meta.get_field('course').verbose_name: self.course.title,
            self._meta.get_field('number_of_hours').verbose_name: self.number_of_hours
        }

    def __str__(self):
        return f'Студент заявки на коллективное обучение'

    class Meta:
        verbose_name = "студент заявки коллективное обучение"
        verbose_name_plural = "студенты заявки коллективное обучение"


class CourseApplication(models.Model):
    """Модель заявки на обучение"""
    user = models.ForeignKey(verbose_name="Пользователь", to='accounts.User',
                             on_delete=models.CASCADE, related_name="course_applications")
    course = models.ForeignKey(verbose_name="Курс", to='courses.Course',
                               on_delete=models.CASCADE, related_name="applications")
    number_of_hours = models.IntegerField(verbose_name="Количество часов", choices=NumberOfHoursChoices.choices)

    

    def __str__(self):
        return f"Заявка[{self.id}]"

    class Meta:
        verbose_name = "заявка на обучение"
        verbose_name_plural = "заявки на обучение"