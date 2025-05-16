from django.conf import settings
from django.core.mail import send_mail

from rest_framework import serializers

from .models import FormRequest, HomeReview, MailRecipient


class FormRequestSerializer(serializers.ModelSerializer):
    """Сериализатор для формы сотрудничества"""
    
    def create(self, validated_data):
        subject = "Новое обращение"
        recipient_list = MailRecipient.objects.filter(is_active=True)
        form_request = FormRequest.objects.create(**validated_data)
        message = form_request.formatted_message

        send_mail(
            subject=subject,
            message=message,
            recipient_list=recipient_list,
            from_email=settings.DEFAULT_FROM_EMAIL
        )
        return form_request

    class Meta:
        model = FormRequest
        fields = "__all__"


class HomeReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = HomeReview
        fields = "__all__"