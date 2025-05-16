from django.urls import path

from .views import DocumentCheckView, DocumentVariationListView


urlpatterns = [
    path('check', DocumentCheckView.as_view()),
    path('variations', DocumentVariationListView.as_view())
]