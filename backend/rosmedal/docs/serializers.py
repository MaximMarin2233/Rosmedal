from rest_framework import serializers

from .models import Document, DocumentVariation, DocumentVariationTemplate


class DocumentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Document
        exclude = ['user']


class DocumentVariationTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DocumentVariationTemplate
        fields = '__all__'


class DocumentVariationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DocumentVariation
        fields = '__all__'


class DocumentVariationListSerializer(serializers.ModelSerializer):
    templates = DocumentVariationTemplateSerializer(many=True)
    
    class Meta:
        model = DocumentVariation
        fields = '__all__'