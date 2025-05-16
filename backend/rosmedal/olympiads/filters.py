# courses/filters.py
from django.contrib.admin import SimpleListFilter
from .models import Subject

class SubjectListFilter(SimpleListFilter):
    title = 'Предметы'
    parameter_name = 'subjects'

    def lookups(self, request, model_admin):
        return [(subject.id, subject.name) for subject in Subject.objects.all()]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(subjects__id__exact=self.value())
        return queryset
    
