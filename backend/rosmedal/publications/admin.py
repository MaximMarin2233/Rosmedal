from django.contrib import admin
from django.conf import settings
from django.utils.html import format_html

from .models import Publication


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ['topic', 'author_full_name',
                    'author_email', 'created_at']
    readonly_fields = ['display_publication_detail']
    

    def display_publication_detail(self, obj):
        course_detail_url = f'<a href="{settings.FRONTEND_BASE_URL}/publication-details/{obj.id}">Ссылка</a>'
        return format_html(course_detail_url)
    display_publication_detail.short_description = "Ссылка на публикацию"