from rest_framework import serializers

from accounts.models import User

from .models import Referral



class ReferralSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

    def get_email(self, obj):
        return obj.referral.email

    class Meta:
        model = Referral
        fields = ['email']


class ReferralInviteSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = value
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Пользователь с таким e-mail уже существует")
        return email
            

class ReferralCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Referral
        fields = ['referrer', 'referral']