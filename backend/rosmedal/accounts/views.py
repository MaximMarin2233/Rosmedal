from django.contrib.auth import get_user_model
from django.utils import timezone

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.generics import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # Эндпоинт для получения пары токенов (access и refresh)
    TokenRefreshView,     # Эндпоинт для обновления access токена по refresh токену
)

from .models import RegistrationToken
from .serializers import (
    EmailRegistrationSerializer,
    CustomTokenObtainPairSerializer
)
from .services import send_registration_token_mail

User = get_user_model()


class RegistrationView(views.APIView):
    """Представление для регистрации"""
    
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address')
            },
            required=['email'],
        ),
        responses=[]

    )
    def post(self, request, *args, **kwargs):
        serializer = EmailRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            if User.objects.filter(email=email).exists():
                return Response(
                    status=400,
                    data={'message': 'user with this email already exists'}
                )
            token = RegistrationToken.objects.create(email=email)
            send_registration_token_mail(email=email, token=token.token)
            return Response(
                status=HTTP_200_OK,
                data={'message': 'token created'}
            )
        else:
            return Response(
                status=HTTP_400_BAD_REQUEST,
                data={'message': 'invalid data'}
            )  


class ConfirmRegistrationView(views.APIView):
    """Представление для подтверждения регистрации"""

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, description='Registration token')
            },
            required=['token'],
        ),
            responses=[]

    )
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        
        # проверка на наличие токена в параметрах запроса
        if not token:
            return Response(
                status=HTTP_400_BAD_REQUEST,
                data={'message': 'token required'}
            )

        # проверка на наличие токена в базе данных
        try:
            registration_token = RegistrationToken.objects.get(token=token)
        except RegistrationToken.DoesNotExist:
            return Response(
                status=HTTP_400_BAD_REQUEST,
                data={'message': "invalid token"}
            )
        
        # проверка срока истечения действия токена
        hour_ago = timezone.now() - timezone.timedelta(hours=1)
        if registration_token.created_at < hour_ago:
            return Response(
                status= HTTP_400_BAD_REQUEST,
                data={'message': 'token has expired'}
            )

        try:
            default_password = 'password'
            new_user = User(
                email=registration_token.email,
            )
            new_user.set_password(default_password)
            new_user.save()

            return Response(
                status= HTTP_200_OK,
                data={'message': 'user is registered', 'email': registration_token.email}
            )
        except Exception as exc:
            print(exc)
            return Response(
                status= HTTP_400_BAD_REQUEST,
                data={'message': 'error of user creating'}
            )
        

class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        new_password = request.data.get('new_password')
        repeat_password = request.data.get('repeat_password')

        if new_password != repeat_password:
            return Response(
                status=HTTP_400_BAD_REQUEST,
                data={
                    'message': 'password mismatch'
                }
            )

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            status=200
        )



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
