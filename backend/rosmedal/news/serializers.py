from rest_framework import serializers

from .models import News


class NewsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = [
            'id',
            'title', 'date_created',
            'reading_time', 'image',
            'text',
        ]


class NewsDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = '__all__'