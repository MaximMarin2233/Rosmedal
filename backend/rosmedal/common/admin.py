from django.http import HttpRequest
from django.contrib import admin

from .models import (
    FormRequest,
    EmailTemplate,
    MailRecipient,

    Review,
    HomeReview
)
from .services import confirm_review


admin.site.register(HomeReview)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    model = Review
    list_display = ['__str__', 'user', 'is_confirmed']
    readonly_fields = ['is_confirmed']
    search_fields = ['user__email']
    change_form_template = 'common/review_change_form.html'

    def response_change(self, request, obj):
        if '_confirm' in request.POST:
            review = obj
            confirm_review(review)
            self.message_user(request, 'Отзыв подтвержден. Бонусный баланс пользователя пополнен.')
        return super().response_change(request, obj)


@admin.register(FormRequest)
class FormRequestModelAdmin(admin.ModelAdmin):
    model = FormRequest
    list_display = ['client_name', 'client_email', 'created_at']
    search_fields = ['client_email', 'created_at']


@admin.register(EmailTemplate)
class EmailTemplate(admin.ModelAdmin):
    model = EmailTemplate
    list_display = ['name', 'subject']
    # readonly_fields = ['name']

    def has_delete_permission(self, request: HttpRequest, obj=...) -> bool:
        return False

admin.site.register(MailRecipient)