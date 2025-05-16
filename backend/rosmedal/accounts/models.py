from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.db import models
from django.db.models import Sum
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

from courses.models.choices import EducationDegreeChoices, CitizenshipChoices
from billing.models import Transaction
from subscriptions.models import UserSubscription

from .utils import generate_registration_token
from .validators import (
    phone_number_validator,
    snils_validator
)


username_validator = UnicodeUsernameValidator()


class User(AbstractUser):
    password = models.CharField(_("password"), max_length=128, null=True)
    email = models.EmailField(_("email address"), blank=True, unique=True)
    username = models.CharField(
        _("username"),
        max_length=150,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )

    balance = models.DecimalField(verbose_name="Баланс", default=0,
                                  max_digits=11, decimal_places=2)
    bonus_balance = models.DecimalField(verbose_name="Бонусный баланс", default=0,
                                        max_digits=11, decimal_places=2)


    last_name = models.CharField(verbose_name="Фамилия", max_length=255,
                                 null=True, blank=True)
    first_name = models.CharField(verbose_name="Имя", max_length=255,
                                  null=True, blank=True)
    patronymic = models.CharField(verbose_name="Отчество", max_length=255,
                                  null=True, blank=True)
    phone_number = models.CharField(
        max_length=16, 
        validators=[phone_number_validator], 
        help_text="Введите номер телефона в формате +7-xxx-xxx-xx-xx",
        null=True, blank=True
    )
    city = models.CharField(verbose_name="Город проживания", max_length=255,
                            null=True, blank=True)
    date_of_birth = models.DateField(verbose_name="Дата рождения",
                                     null=True, blank=True)
    gender = models.CharField(verbose_name="Пол", max_length=5,
                              choices=[('MAN', 'Мужчина'), ('WOMAN', 'Женщина')],
                              null=True, blank=True)
    citizenship = models.CharField(verbose_name="Гражданство", max_length=255,
                                   choices=CitizenshipChoices.choices,
                                   null=True, blank=True)
    job = models.CharField(verbose_name="Место работы", max_length=255,
                           null=True, blank=True)
    position = models.CharField(verbose_name="Должность", max_length=255,
                                null=True, blank=True)
    snils = models.CharField(verbose_name="СНИЛС", max_length=255,
                             validators=[snils_validator],
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
    delivery_country = models.CharField(verbose_name="Страна доставки", max_length=255,
                               null=True, blank=True)
    delivery_region = models.CharField(verbose_name="Регион доставки", max_length=255,
                               null=True, blank=True)
    delivery_city = models.CharField(verbose_name="Город доставки", max_length=255,
                                     null=True, blank=True)
    delivery_house = models.CharField(verbose_name="Дом доставки", max_length=255,
                                     null=True, blank=True)
    delivery_street = models.CharField(verbose_name="Улица доставки", max_length=255,
                                       null=True, blank=True)
    delivery_flat = models.CharField(verbose_name="Квартира доставки", max_length=255,
                                     null=True, blank=True)
    post_index = models.CharField(verbose_name="Почтовый индекс", max_length=255,
                                 null=True, blank=True)
    
    number_of_coupons = models.IntegerField(verbose_name="Количество бонусных купонов", default=0)
    
    avatar = models.FileField(verbose_name="Аватар", upload_to='user/avatars',
                              null=True, blank=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def get_active_subscription(self):
        try:
            active_subscription = self.subscriptions.get(end_date__gte=timezone.now())
            return active_subscription
        except UserSubscription.DoesNotExist:
            return None

    def get_balance(self):
        """Высчитывает баланс"""
        balance = self.transactions.filter(
            status=Transaction.StatusChoices.SUCCESS,
            balance=Transaction.BalanceChoices.MAIN
        ).aggregate(result=Sum('amount'))['result']
        return balance if balance else 0

    def set_balance(self):
        """Высчитывает и сохраняет баланс"""
        self.balance = self.get_balance()
        self.save()

    def get_bonus_balance(self):
        """Высчитывает бонусный баланс"""
        balance = self.transactions.filter(
            status=Transaction.StatusChoices.SUCCESS,
            balance=Transaction.BalanceChoices.BONUS
        ).aggregate(result=Sum('amount'))['result']
        return balance if balance else 0

    def set_bonus_balance(self):
        """Высчитывает и сохраняет бонусный баланс"""
        self.bonus_balance = self.get_bonus_balance()
        self.save()

    def get_full_name(self):
        return f"{self.last_name} {self.first_name} {self.patronymic}"

    def __str__(self):
        return self.email
    


class RegistrationToken(models.Model):
    """Модель токена для регистрации"""
    email = models.EmailField()
    token = models.CharField(max_length=64, unique=True, default=generate_registration_token)
    created_at = models.DateTimeField(auto_now_add=True)
