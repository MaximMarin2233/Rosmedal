import re
from django.core.exceptions import ValidationError


def phone_number_validator(value):
    phone_regex = re.compile(r'^\+7-\d{3}-\d{3}-\d{2}-\d{2}$')
    if not phone_regex.match(value):
        raise ValidationError(
            'Номер телефона должен быть в формате +7-xxx-xxx-xx-xx.'
        )
    

def snils_validator(value):
    snils_regex = re.compile(r'^\d{3}-\d{3}-\d{3}-\d{2}$')
    if not snils_regex.match(value):
        raise ValidationError(
            'СНИЛС должен быть в формате xxx-xxx-xxx-xx.'
        )