from django.urls import path

from .views import (
    UserUpdateview,
    UserRetrieveView,

    UserDocumentListView,
    UserDocumentCreateView,
    UserDocumentPurchaseView,
    UserDocumentDeleteView,
    UserDocumentDetailView,

    UserCoursePurchaseView,
    UserCourseCreateView,
    UserCourseDeleteView,
    UserCourseListView,
    UserCourseDetailView,
    UserCourseTestPassView,
    UserCourseUpdateView,
    UserCourseAdditionListView,

    ReferralCreateView,
    ReferralInviteView,

    UserReviewCreateView,
    BalanceReplenishmentView,
    SubscriptionPurchaseView,

    PromotionalCodeDetailView
)


urlpatterns = [
    path('user/update', UserUpdateview.as_view()),
    path('user', UserRetrieveView.as_view()),

    path('reviews/create', UserReviewCreateView.as_view()),
    path('balance/replenish', BalanceReplenishmentView.as_view()),
    path('subscriptions/purchase', SubscriptionPurchaseView.as_view()),

    path('courses', UserCourseListView.as_view()),
    path('courses/<int:pk>', UserCourseDetailView.as_view()),
    path('courses/update/<int:pk>', UserCourseUpdateView.as_view()),
    path('courses/create', UserCourseCreateView.as_view()),
    path('courses/delete/<int:pk>', UserCourseDeleteView.as_view()),
    path('courses/purchase', UserCoursePurchaseView.as_view()),
    path('courses/pass_test', UserCourseTestPassView.as_view()),
    path('courses/additions', UserCourseAdditionListView.as_view()),

    path('documents/', UserDocumentListView.as_view()),
    path('documents/<int:pk>', UserDocumentDetailView.as_view()),
    path('documents/create', UserDocumentCreateView.as_view()),
    path('documents/purchase', UserDocumentPurchaseView.as_view()),
    path('documents/delete/<int:pk>', UserDocumentDeleteView.as_view()),

    path('referral/create', ReferralCreateView.as_view()),
    path('referral/invite', ReferralInviteView.as_view()),

    path('promotional_codes/<str:code>', PromotionalCodeDetailView.as_view()),
]