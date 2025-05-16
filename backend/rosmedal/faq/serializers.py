from rest_framework import serializers

from .models import PageFAQQuestion


class PageFAQQuestionListSerializer(serializers.ModelSerializer):

    class Meta:
        model = PageFAQQuestion
        fields = "__all__"