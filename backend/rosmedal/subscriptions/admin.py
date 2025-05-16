from django.contrib import admin
from django.http import HttpRequest

from .models import Subscription, UserSubscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration']

    def has_delete_permission(self, request: HttpRequest, obj= ...) -> bool:
        return False


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'subscription', 'start_date']
    search_fields = ['user__email', 'start_date']
