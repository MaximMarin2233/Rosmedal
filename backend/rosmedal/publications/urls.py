from django.urls import path

from .views import (
    PublicationCreateView,
    PublicationListView,
    PublicationDetailView
)


urlpatterns = [
    path('create', PublicationCreateView.as_view()),
    path('', PublicationListView.as_view()),
    path('<int:pk>', PublicationDetailView.as_view()),
]