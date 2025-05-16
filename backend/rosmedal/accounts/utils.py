from django.utils.crypto import get_random_string


def generate_registration_token():
    return get_random_string(64)
