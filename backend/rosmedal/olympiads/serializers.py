from rest_framework import serializers

from .models import (
    Olympiad,
    OlympiadQuestion,
    OlympiadAnswerOption,

    Subject,
    ForWhom
)


class SubjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subject
        fields = ['id', 'name']


class ForWhomSerializer(serializers.ModelSerializer):

    class Meta:
        model = ForWhom
        fields = ['id', 'name']


class OlympiadAnswerOptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = OlympiadAnswerOption
        fields = '__all__'


class OlympiadQuestionSerializer(serializers.ModelSerializer):
    answers = OlympiadAnswerOptionSerializer(many=True)

    class Meta:
        model = OlympiadQuestion
        fields = '__all__'


class OlympiadDetailSerializer(serializers.ModelSerializer):
    questions = OlympiadQuestionSerializer(many=True)

    class Meta:
        model = Olympiad
        fields = '__all__'


class OlympiadListSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Olympiad
        fields = '__all__'