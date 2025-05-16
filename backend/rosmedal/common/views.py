from django.middleware.csrf import get_token

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics

from .serializers import FormRequestSerializer, HomeReviewSerializer
from .models import FormRequest, HomeReview


@api_view(["GET"])
def get_csrf(request):
    csrf_token = get_token(request)

    response_data = {
        "csrf_token": csrf_token
    }

    return Response(
        data=response_data,
        status=200
    )


class FeedbackFormView(generics.CreateAPIView):
    model = FormRequest.objects.all()
    serializer_class = FormRequestSerializer


class HomeReviewListView(generics.ListAPIView):
    pagination_class = None
    queryset = HomeReview.objects.all()
    serializer_class = HomeReviewSerializer