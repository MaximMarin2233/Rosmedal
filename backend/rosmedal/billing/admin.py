from django.contrib import admin
from django.http import HttpRequest

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    list_display = ['__str__', 'reason', 'balance', 'amount', 'user']

    def has_delete_permission(self, request: HttpRequest, obj = ...) -> bool:
        return False
    
    def has_change_permission(self, request: HttpRequest, obj = ...) -> bool:
        return False