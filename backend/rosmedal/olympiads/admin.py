from django.contrib import admin
from django.contrib import messages

import nested_admin

from .models import (
    Olympiad,
    OlympiadQuestion,
    OlympiadAnswerOption,
)

from .filters import SubjectListFilter
from .forms import OlympiadForm


class OlympiadAnswerOptionInline(nested_admin.NestedTabularInline):
    model = OlympiadAnswerOption
    extra = 1

class OlympiadQuestionInline(nested_admin.NestedTabularInline):
    model = OlympiadQuestion
    extra = 1
    inlines = [OlympiadAnswerOptionInline]


@admin.register(Olympiad)
class OlympiadModelAdmin(nested_admin.NestedModelAdmin):
    model = Olympiad
    form = OlympiadForm
    search_fields = ['title']
    list_display = ['title', 'is_show']
    list_filter = ['for_whom', 'grade', 'is_show', SubjectListFilter]
    inlines = [OlympiadQuestionInline]


