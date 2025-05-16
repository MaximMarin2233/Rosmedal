from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.db import transaction

from rest_framework import views
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from subscriptions.models import Subscription, UserSubscription
from subscriptions.serializers import UserSubscriptionSerializer, SubscriptionPurchaseSerializer
from subscriptions.services import SubscriptionPurchaseService


class SubscriptionPurchaseView(views.APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Purchase a subscription",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'subscription': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the subscription to purchase')
            },
            required=['subscription']
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Subscription purchased successfully",
                schema=UserSubscriptionSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error occurred",
                examples={
                    'application/json': {
                        'message': 'subscription does not exist'
                    }
                }
            )
        }
    )
    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        serializer = SubscriptionPurchaseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=serializer.errors
            )
        validated_data = serializer.validated_data

        user = request.user
        subscription = validated_data.get("subscription")
        from_balance = validated_data.get("from_balance")

        purchase_service = SubscriptionPurchaseService(user, subscription)

        if from_balance:
            user_subscription, error = purchase_service.purchase_subscription_through_balance()
        else:
            payment_response, error = purchase_service.purchase_subcription_through_yookassa()

        if error:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'message': error}
            )
        
        if from_balance:
            return Response(
                status=status.HTTP_200_OK,
                data=UserSubscriptionSerializer(user_subscription).data
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=payment_response
            )




