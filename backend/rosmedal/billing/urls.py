from django.urls import path

from .views import payment_alerts


urlpatterns = [
    path('payment/alerts', payment_alerts)
]