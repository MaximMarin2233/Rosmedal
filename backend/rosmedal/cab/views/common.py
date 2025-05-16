from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.db import transaction

from rest_framework import views, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from billing.services import user_balance_replenish
from common.models import Review

from cab.serializers import BalanceReplenishSerializer, ReviewSerializer


class BalanceReplenishmentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BalanceReplenishSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            amount = serializer.validated_data.get('amount')
            payment_response = user_balance_replenish(
                user=user,
                amount=amount
            )
            return Response(status=status.HTTP_200_OK,
                            data=payment_response)
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=serializer.errors
            )
        

class UserReviewCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def perform_create(self, serializer):
        data = serializer.validated_data
        data['user'] = self.request.user
        serializer.save()