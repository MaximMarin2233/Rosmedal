import random

from django.utils import timezone
from django.conf import settings

from .tasks import send_contest_work_mail
from .models import ContestWorkPlace


def get_contest_place():
    place_list = [i.place for i in ContestWorkPlace.objects.all()]
    if place_list:
        return random.choice(place_list)
    else: 
        return 1
    

def send_contest_work_mail_randomly(email: str, place: int):
    """Отправляет письмо о конкурсной работе через случайно время в течение 3 дней"""
    delay_in_minutes = 0 if settings.DEBUG else random.randint(1, 3)
    eta = timezone.now() + timezone.timedelta(minutes=delay_in_minutes)
    send_contest_work_mail.apply_async((email, place), eta=eta)
