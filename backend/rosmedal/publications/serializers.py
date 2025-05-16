from django.conf import settings

from rest_framework import serializers

from common.services import send_custom_email

from .models import Publication


class PublicationSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        publication = Publication.objects.create(**validated_data)
        email_context = {'publication': publication,
                         'settings': settings}
        send_custom_email(
            'create_publication',
            [publication.author_email],
            email_context
        )
        return publication

    class Meta:
        model = Publication
        fields = "__all__"