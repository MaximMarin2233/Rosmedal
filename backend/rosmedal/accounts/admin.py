from django.contrib import admin
from django.db.models import Value as V
from django.db.models.functions import Concat
from django.contrib.auth.models import Group

from .models import (
    RegistrationToken,

    User
)

from django_rest_passwordreset.models import ResetPasswordToken


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    exclude = ['password', 'is_staff', 
               'is_active', 'is_superuser', 
               'user_permissions', 'groups',]
    search_fields = ['email', 'last_name', 'first_name']

    def get_search_results(self, request, queryset, search_term):
        """
        Override the get_search_results method to add full_name search functionality.
        """
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        # Annotate full_name
        queryset = queryset.annotate(
            full_name=Concat('last_name', V(' '), 'first_name', V(' '), 'patronymic')
        )
        if search_term:
            queryset = queryset.filter(full_name__icontains=search_term)
        return queryset, use_distinct

admin.site.unregister(ResetPasswordToken)
admin.site.unregister(Group)
