from rest_framework import generics

from .serializers import ContestWorkSerializer
from .models import ContestWork


class ContestWorkCreateView(generics.CreateAPIView):
    queryset = ContestWork.objects.all()
    serializer_class = ContestWorkSerializer
