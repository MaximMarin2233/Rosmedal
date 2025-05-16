from django.db import models

from olympiads.models import SubjectChoices


class CourseVariationChoices(models.TextChoices):
    KPK = 'KPK', 'Повышение квалификации'
    KPP = 'KPP', 'Профессиональная переподготовка'
    KOT = 'KOT', 'Курсы по охране труда'


class NumberOfHoursChoices(models.IntegerChoices):
    TWO = 2, '2 часа'
    THREE = 3, '3 часа'
    FOUR = 4, '4 часа'
    FIVE = 5, '5 часов'
    SIX = 6, '6 часов'
    SEVEN = 7, '7 часов'
    EIGHT = 8, '8 часов'
    TEN = 10, '10 часов'
    FOURTEEN = 16, '16 часов'
    THIRTY_SIX = 36, '36 часов'
    SEVENTY_TWO = 72, '72 часа'
    ONE_HUNDRED_EIGHT = 108, '108 часов'
    ONE_HUNDRED_FORTY_FOUR = 144, '144 часа'
    ONE_HUNDRED_EIGHTY = 180, '180 часов'
    TWO_HUNDRED_SIXTEEN = 216, '216 часов'
    TWO_HUNDRED_FOURTY_EIGHT = 248, '248 часов'
    THREE_HUNDRED = 300, '300 часов'
    FIVE_HUNDRED = 500, '500 часов'
    SIX_HUNDRED = 600, '600 часов'
    NINE_HUNDRED = 900, '900 часов'
    ONE_THOUSAND = 1000, '1000 часов'
    ONE_THOUSAND_TWO_HUNDRED = 1200, '1200 часов'
    ONE_THOUSAND_FIVE_HUNDRED = 1500, '1500 часов'
    TWO_THOUSAND = 2000, '2000 часов'


class EducationDegreeChoices(models.TextChoices):
    HIGHER = 'HIGHER', 'Высшее'
    SECONDARY = 'SECONDARY', 'Среднее профессиональное' 


class CitizenshipChoices(models.TextChoices):
    RUSSIA = 'RU', 'Российская Федерация'
    AZERBAIJAN = 'AZ', 'Азербайджан'
    ARMENIA = 'AM', 'Армения'
    BELARUS = 'BY', 'Республика Беларусь'
    GEORGIA = 'GE', 'Грузия'
    KYRGYZSTAN = 'KG', 'Киргизия'
    MOLDOVA = 'MD', 'Молдавия'
    KAZAKHSTAN = 'KZ', 'Казахстан'
    TAJIKISTAN = 'TJ', 'Таджикистан'
    UZBEKISTAN = 'UZ', 'Узбекистан'
    UKRAINE = 'UA', 'Украина'