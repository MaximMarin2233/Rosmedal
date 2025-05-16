from django.conf import settings
from django.template.loader import render_to_string

from common.services import send_custom_email


def send_registration_token_mail(email: str, token: str):
    """Реализует отправку ссылки с токеном для регистрации"""
    context = {
        "token": token,
        "DOMAIN": settings.DOMAIN,
        "PROTOCOL": settings.PROTOCOL
    }

    send_custom_email(
        'confirm_registration',
        [email],
        context
    )