from django.contrib import admin

from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'date_created']
    search_fields = ['title', 'date_created']
