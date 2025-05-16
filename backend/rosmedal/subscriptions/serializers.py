from rest_framework import serializers

from .models import UserSubscription, Subscription


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = "__all__"


class UserSubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserSubscription
        fields = "__all__"


class SubscriptionPurchaseSerializer(serializers.Serializer):
    from_balance = serializers.BooleanField()
    subscription = serializers.CharField()

    def validate_subscription(self, value):
        subscription_id = value
        try: 
            subscription = Subscription.objects.get(id=subscription_id)
        except Subscription.DoesNotExist:
            raise serializers.ValidationError("Подписки не существует")
        return subscription

        