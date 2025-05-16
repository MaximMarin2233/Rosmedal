from django.urls import path

from .views import (
    FeedbackFormView,
    HomeReviewListView,
    get_csrf,
)


urlpatterns = [
    path('feedback_form', FeedbackFormView.as_view()),
    path('home_reviews', HomeReviewListView.as_view()),

    path('csrf', get_csrf)
]