from django.contrib import admin
from django.http import HttpRequest
from django.utils.html import format_html
from django.urls import reverse

from courses.models import Course
from docs.models import Document

from .models import (Order, Purchase, PromotionalCode)


class PurchaseInline(admin.StackedInline):
    model = Purchase
    extra = 0
    exclude = ['content_type', 'object_id']
    readonly_fields = ('get_product',)

    def get_product(self, obj):
        content_type = obj.content_type
        model_class = content_type.model_class()
        if model_class:
            try:
                product_object = model_class.objects.get(pk=obj.object_id)
                url = reverse(f'admin:{content_type.app_label}_{content_type.model}_change', args=[obj.object_id])
                return format_html('<a href="{}">{}</a>', url, product_object)
            except model_class.DoesNotExist:
                return 'Не найдено'
        return 'Неизвестный тип'
    get_product.short_description = 'Продукт'

    def has_add_permission(self, request: HttpRequest, obj) -> bool:
        return False


@admin.register(Order)
class Order(admin.ModelAdmin):
    inlines = [PurchaseInline]
    list_display = ['__str__', 'user_email', 'created_at']
    search_fields = ['user__email', 'created_at']

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email пользователя'
    user_email.admin_order_field = 'user__email'


@admin.register(PromotionalCode)
class PromotionalCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage']