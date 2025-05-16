from django.urls import path

from .views import (
    CourseVariationListView,

    CourseListView,
    CourseDetailView,

    CourseCollectiveApplicationCreateView
)


urlpatterns = [
    path('', CourseListView.as_view()),
    path('<int:pk>', CourseDetailView.as_view()),
    path('variations', CourseVariationListView.as_view()),
    path('applications/collective/create', CourseCollectiveApplicationCreateView.as_view())
]