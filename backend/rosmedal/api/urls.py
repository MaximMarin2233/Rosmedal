from django.urls import path, include

from rest_framework import permissions

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Your API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('auth/', include('accounts.urls')),
    path('olympiads/', include('olympiads.urls')),
    path('courses/', include('courses.urls')),
    path('faq/', include('faq.urls')),
    path('news/', include('news.urls')),
    path('contest_works/', include('contests.urls')),
    path('publications/', include('publications.urls')),
    path('docs/', include('docs.urls')),
    path('billing/', include('billing.urls')),

    path('cab/', include('cab.urls')),

    path('subscriptions/', include('subscriptions.urls')),

    path('common/', include('common.urls')),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]