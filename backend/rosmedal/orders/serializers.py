from django.contrib.contenttypes.models import ContentType

from rest_framework import serializers

from courses.models import Course
from docs.models import Document
from subscriptions.models import Subscription

from .models import Order, Purchase, PromotionalCode


class PromotionalCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = PromotionalCode
        fields = ['code', 'discount_percentage']


class PurchaseSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        slug_field='model',
        queryset=ContentType.objects.filter(model__in=['document', 'course', 'subscription'])
    )

    def validate(self, data):
        content_type = data['content_type']
        object_id = data['object_id']

        # Определяем модель по content_type
        if content_type.model == 'document':
            model = Document
        elif content_type.model == 'course':
            model = Course
        elif content_type.model == 'subscription':
            model = Subscription

        # Проверяем, существует ли объект с таким object_id
        if not model.objects.filter(pk=object_id).exists():
            raise serializers.ValidationError(f'{content_type.model} with id {object_id} does not exist')

        return data

    class Meta:
        model = Purchase
        fields = ['content_type', 'object_id']


class OrderSerializer(serializers.ModelSerializer):
    purchases = PurchaseSerializer(many=True)
    use_bonuses = serializers.BooleanField(required=False)

    class Meta:
        model = Order
        fields = ['user', 'promotional_code', 'purchases', 'use_bonuses']