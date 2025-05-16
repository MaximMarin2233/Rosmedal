from django.urls import path

from .views import ContestWorkCreateView


urlpatterns = [
    path('create', ContestWorkCreateView.as_view())
]