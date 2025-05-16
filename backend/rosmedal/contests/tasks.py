import random

from django.conf import settings
from django.template.loader import render_to_string

from core.celery import app
from common.services import send_custom_email


@app.task
def send_contest_work_mail(email, place):
    """Отправляет письмо о конкурсной работе"""

    context = {
        "place": place,
        "settings": settings
    }

    send_custom_email(
        'contest_victory',
        [email],
        context
    )