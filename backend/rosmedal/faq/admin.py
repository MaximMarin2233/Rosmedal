from django.contrib import admin

from .models import PageFAQQuestion


@admin.register(PageFAQQuestion)
class PageFAQQuestionAdmin(admin.ModelAdmin):
    model = PageFAQQuestion
    list_display = ['question', 'category']
    list_filter = ['category']

