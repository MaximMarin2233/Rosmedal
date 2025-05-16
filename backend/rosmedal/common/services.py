from django.core.mail import send_mail
from django.conf import settings
from django.template import Template, Context
from django.utils.html import strip_tags

from .models import (
    EmailTemplate,
    Review
)

from billing.models import (
    Transaction, 
)


def get_email_template(name):
    try:
        return EmailTemplate.objects.get(name=name)
    except EmailTemplate.DoesNotExist:
        return None
    

def send_custom_email(template_name, recipient_list, context):
    template = get_email_template(template_name)
    if not template:
        raise ValueError(f"Шаблон письма с названием '{template_name}' не найден.")

    subject = template.subject
    email_template = Template(template.body)
    context = Context(context)
    html_message = email_template.render(context)
    plain_message = strip_tags(html_message)
    from_email = settings.DEFAULT_FROM_EMAIL
    
    print("до отправки письма")
    send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)
    print("после отправки письма")


def confirm_review(review: Review):
    if not review.is_confirmed:
        Transaction.objects.create(
            user=review.user,
            status=Transaction.StatusChoices.SUCCESS,
            amount=140,
            reason=Transaction.ReasonChoices.REPLENISHMENT,
            balance=Transaction.BalanceChoices.BONUS
        )
        review.is_confirmed = True
        review.save()