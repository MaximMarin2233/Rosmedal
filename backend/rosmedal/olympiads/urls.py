from django.urls import path

from .views import (
    OlympiadDetailView,
    OlympiadListView
)


urlpatterns = [
    path('', OlympiadListView.as_view()),
    path('<int:pk>', OlympiadDetailView.as_view())
]