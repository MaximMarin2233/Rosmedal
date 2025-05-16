from django.utils.translation import gettext_lazy as _

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from referral.serializers import ReferralSerializer
from subscriptions.serializers import SubscriptionSerializer, UserSubscriptionSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    referrals = ReferralSerializer(many=True, read_only=True)
    active_subscription = serializers.SerializerMethodField()

    def get_active_subscription(self, obj):
        # Получаем активную подписку
        active_subscription = obj.get_active_subscription()
        # Если активная подписка существует, сериализуем её
        if active_subscription:
            return UserSubscriptionSerializer(active_subscription).data
        # Если нет активной подписки, возвращаем None
        return None

    class Meta:
        model = User
        exclude = [
            'username',
            'password',
            'is_active',
            'is_staff',
            'is_superuser',
            'groups',
            'user_permissions',
            'last_login',
            'date_joined'
        ]

class EmailRegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.CharField(
        label=_("Email"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=False,
    )






