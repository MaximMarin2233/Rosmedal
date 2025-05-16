from django.contrib import admin

from .models import ContestWork, ContestWorkPlace


@admin.register(ContestWork)
class ContestWorkAdmin(admin.ModelAdmin):
    list_filter = ['level']
    list_display = ['title', 'level', 'author_email', 'created_at']
    search_fields = ['author_email', 'created_at']

admin.site.register(ContestWorkPlace)
