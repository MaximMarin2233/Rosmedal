from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.conf import settings

from rest_framework import views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_400_BAD_REQUEST, 
    HTTP_401_UNAUTHORIZED,

    HTTP_200_OK
)

from common.services import (
    send_custom_email
)

from referral.serializers import (
    ReferralCreateSerializer,
    ReferralInviteSerializer
)




class ReferralInviteView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ReferralInviteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                data=serializer.errors,
                status=HTTP_400_BAD_REQUEST
            )
        invited_email = serializer.validated_data.get('email')
        context = {
            "referrer_id": request.user.id,
            "DOMAIN": settings.DOMAIN,
            "PROTOCOL": settings.PROTOCOL
        }

        send_custom_email(
            "invite_referral",
            [invited_email],
            context
        )

        return Response(
            status=HTTP_200_OK
            )



class ReferralCreateView(views.APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=ReferralCreateSerializer,
        responses={
            HTTP_200_OK: openapi.Response(
                description="Referral created successfully"
            ),
            HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            HTTP_401_UNAUTHORIZED: openapi.Response(
                description="Unauthorized: The authenticated user must be the referrer"
            ),
        },
        operation_description="Create a referral. The authenticated user must be the referrer."
    )
    def post(self, request, *args, **kwargs):
        serializer = ReferralCreateSerializer(data=request.data)
        if serializer.is_valid():
            referral = serializer.validated_data.get('referral')
            if not request.user == referral:
                return Response(
                    data={'message': 'Авторизованный пользователь должен быть рефералом'},
                    status=HTTP_401_UNAUTHORIZED
                )
            serializer.save()
            return Response(
                status=HTTP_200_OK
            )
        else:
            return Response(
                data=serializer.errors,
                status=HTTP_400_BAD_REQUEST
            )