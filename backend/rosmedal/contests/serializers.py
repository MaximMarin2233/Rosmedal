from rest_framework import serializers

from .models import ContestWork
from .services import (
    send_contest_work_mail_randomly,
    get_contest_place
)


class ContestWorkSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        email = validated_data['author_email']
        contest_place = get_contest_place()
        send_contest_work_mail_randomly(email, contest_place)
        validated_data['place'] = contest_place
        return super().create(validated_data)

    class Meta:
        model = ContestWork
        exclude = ['place']