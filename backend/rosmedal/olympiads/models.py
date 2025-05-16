from django.db import models
from django.db.models import UniqueConstraint
from django.contrib import messages
from django.core.exceptions import ValidationError


class ForWhomChoices(models.TextChoices):
    PRESCHOOLERS = 'PRESCHOOLERS', 'Дошкольники'
    PUPILS = 'PUPILS', 'Школьники'
    TEACHERS = 'TEACHERS', 'Учителя'
    KINDERGARTENER = 'KINDERGARTENER', 'Воспитатели'
    STUDENTS = 'STUDENTS', 'Студенты'


class GradeChoices(models.IntegerChoices):
    FIRST = 1, '1 класс'
    SECOND = 2, '2 класс'
    THIRD = 3, '3 класс'
    FOURTH = 4, '4 класс'
    FIFTH = 5, '5 класс'
    SIXTH = 6, '6 класс'
    SEVENTH = 7, '7 класс'
    EIGHTH = 8, '8 класс'
    NINTH = 9, '9 класс'
    TENTH = 10, '10 класс'
    ELEVENTH = 11, '11 класс'
    UNIVERSITY = 12, 'Вузовские олимпиады'


class SubjectChoices(models.TextChoices):
    ENGLISH_LANGUAGE = 'ENGLISH_LANGUAGE', 'Английский язык'
    LIBRARY = 'LIBRARY', 'Библиотечное дело'
    BIOLOGY = 'BIOLOGY', 'Биология'
    EDUCATIONAL_WORK = 'EDUCATIONAL_WORK', 'Воспитательная работа'
    GEOGRAPHY = 'GEOGRAPHY', 'География'
    ADDITIONAL_EDUCATION = 'ADDITIONAL_EDUCATION', 'Доп. образование'
    PRESCHOOL_EDUCATION = 'PRESCHOOL_EDUCATION', 'Дошкольное образование'
    ART = 'ART', 'ИЗО'
    FOREIGN_LANGUAGES = 'FOREIGN_LANGUAGES', 'Иностранные языки'
    COMPUTER_SCIENCE = 'COMPUTER_SCIENCE', 'Информатика'
    HISTORY = 'HISTORY', 'История'
    CLASS_MANAGEMENT = 'CLASS_MANAGEMENT', 'Классное руководство'
    MATHS = 'MATHS', 'Математика'
    MUSIC = 'MUSIC', 'Музыка'
    PRIMARY_CLASSES = 'PRIMARY_CLASSES', 'Начальные классы'
    LIFE_SAFETY = 'LIFE_SAFETY', 'ОБЖ'
    SPECIAL_EDUCATION = 'SPECIAL_EDUCATION', 'Обучение детей с ОВЗ'
    SOCIAL_SCIENCE = 'SOCIAL_SCIENCE', 'Обществознание'
    ENVIRONMENTAL_STUDIES = 'ENVIRONMENTAL_STUDIES', 'Окружающий мир'
    RELIGIOUS_CULTURES = 'RELIGIOUS_CULTURES', 'Основы религиозных культур'
    LABOR_SAFETY = 'LABOR_SAFETY', 'Охрана труда'
    LAW = 'LAW', 'Право'
    RUSSIAN_LITERATURE = 'RUSSIAN_LITERATURE', 'Русская литература'
    RUSSIAN_LANGUAGE = 'RUSSIAN_LANGUAGE', 'Русский язык'
    SOCIAL_PEDAGOGY = 'SOCIAL_PEDAGOGY', 'Социальному педагогу'
    TECHNOLOGY = 'TECHNOLOGY', 'Технология'
    PHYSICS = 'PHYSICS', 'Физика'
    PHYSICAL_CULTURE = 'PHYSICAL_CULTURE', 'Физкультура'
    CHEMISTRY = 'CHEMISTRY', 'Химия'
    SCHOOL_PSYCHOLOGIST = 'SCHOOL_PSYCHOLOGIST', 'Школьному психологу'
    ECONOMICS = 'ECONOMICS', 'Экономика'


class Subject(models.Model):
    """Модель предмета"""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'
    

class ForWhom(models.Model):
    """Модель, описывающая для кого предназначается олимпиада"""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Для кого'
        verbose_name_plural = 'Для кого'


class Olympiad(models.Model):
    """Модель олимпиады"""
    title = models.TextField(verbose_name="Название")
    description = models.TextField(verbose_name="Описание",
                                   null=True, blank=True)
    for_whom = models.ManyToManyField(verbose_name="Для кого", to="olympiads.ForWhom")
    subjects = models.ManyToManyField(verbose_name="Предметы", to="olympiads.Subject")
    grade = models.PositiveSmallIntegerField(verbose_name="Класс", choices=GradeChoices.choices,
                                             null=True, blank=True)
    is_show = models.BooleanField(verbose_name="Показывается",
                                  choices=[(True, "Да"), (False, "Нет")],
                                  default=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'olympiad'
        verbose_name = 'олимпиада'
        verbose_name_plural = 'олимпиады'


class OlympiadQuestion(models.Model):
    """Модель вопроса в олимпиаде"""
    question = models.TextField(verbose_name="Вопрос")
    olympiad = models.ForeignKey(verbose_name="Олимпиада", to='olympiads.Olympiad', on_delete=models.CASCADE, related_name="questions")

    def __str__(self):
        return self.question

    class Meta:
        db_table = 'olympiad_questions'
        verbose_name = 'вопрос'
        verbose_name_plural = 'вопросы'


# нужно уникальное ограничение чтобы только один вопрос мог быть верным
class OlympiadAnswerOption(models.Model):
    """Модель варианта ответа в олимпиаде"""
    title = models.TextField(verbose_name="Название")
    is_correct = models.BooleanField(verbose_name="Правильный", choices=[(True, 'Правильный'), (False, 'Неправильный')])
    question = models.ForeignKey(verbose_name="Вопрос", to='olympiads.OlympiadQuestion', on_delete=models.CASCADE, related_name="answers")

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'olympiad_answer_options'
        verbose_name = 'вариант ответа'
        verbose_name_plural = 'варианты ответа'
