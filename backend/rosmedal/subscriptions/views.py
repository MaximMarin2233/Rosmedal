from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import render

from .models import Subscription
from .serializers import SubscriptionSerializer

class SubscriptionListView(generics.ListAPIView):
    queryset = Subscription.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
