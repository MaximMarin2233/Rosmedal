from django.urls import path

from .views import PageFAQQuestionListView


urlpatterns = [
    path('', PageFAQQuestionListView.as_view())
]