from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # Эндпоинт для получения пары токенов (access и refresh)
    TokenRefreshView,     # Эндпоинт для обновления access токена по refresh токену
)

from .views import (
    RegistrationView,
    ConfirmRegistrationView,
    CustomTokenObtainPairView,
    ChangePasswordView
)


urlpatterns = [
    path('register', RegistrationView.as_view()),
    path('confirm_registration', ConfirmRegistrationView.as_view()),
    path('password_change', ChangePasswordView.as_view()),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]