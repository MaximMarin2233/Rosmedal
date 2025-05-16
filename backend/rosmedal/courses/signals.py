from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import CourseCollectiveApplicationStudent
from .services import get_student_education_price


@receiver(pre_save, sender=CourseCollectiveApplicationStudent)
def course_collective_application_pre_save_handler(sender, instance, **kwargs):
    """Сигнал для обработки данных перед сохранением коллективной заявки на курс"""
    instance.total_price = get_student_education_price(
        base_price=instance.course.base_price,
        number_of_hours=instance.number_of_hours
    )