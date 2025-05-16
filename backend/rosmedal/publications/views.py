from rest_framework import generics

from .models import Publication
from .serializers import PublicationSerializer


class PublicationCreateView(generics.CreateAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer


class PublicationListView(generics.ListAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer


class PublicationDetailView(generics.RetrieveAPIView):
    queryset = Publication.objects.all()
    serializer_class = PublicationSerializer
