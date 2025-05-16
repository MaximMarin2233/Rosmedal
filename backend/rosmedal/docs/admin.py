from typing import Any
from django.contrib import admin
from django.db.models.fields.related import ForeignKey
from django.forms.models import ModelChoiceField
from django.http import HttpRequest

from .models import Document, DocumentVariation, DocumentVariationTemplate


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'variation']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "template":
            obj_id = request.resolver_match.kwargs["object_id"]
            obj = Document.objects.get(id=obj_id)
            kwargs["queryset"] = DocumentVariationTemplate.objects.filter(variation=obj.variation)

        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    def has_add_permission(self, request: HttpRequest) -> bool:
        return False


@admin.register(DocumentVariation)
class DocumentVariationAdmin(admin.ModelAdmin):
    readonly_fields = ['title', 'tag', 'price']

    def has_delete_permission(self, request: HttpRequest, obj= ...) -> bool:
        return False
    
    def has_add_permission(self, request: HttpRequest) -> bool:
        return False
    

admin.site.register(DocumentVariationTemplate)