from django.conf import settings
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse


from django_rest_passwordreset.signals import reset_password_token_created

from common.services import send_custom_email


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    context = {
        'current_user': reset_password_token.user,
        'email': reset_password_token.user.email,
        'token': reset_password_token.key,
        'PROTOCOL': settings.PROTOCOL,
        'DOMAIN': settings.DOMAIN,

    }

    send_custom_email(
        'reset_password',
        [reset_password_token.user.email],
        context
    )

    