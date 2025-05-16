from django.db import connection

from rest_framework import generics
from rest_framework.pagination import PageNumberPagination


from .serializers import (
    OlympiadDetailSerializer,
    OlympiadListSerializer
)
from .models import Olympiad


class OlympiadDetailView(generics.RetrieveAPIView):
    serializer_class = OlympiadDetailSerializer
    queryset = Olympiad.objects.filter(is_show=True).prefetch_related('questions')


class OlympiadListView(generics.ListAPIView):
    serializer_class = OlympiadListSerializer
    queryset = Olympiad.objects.filter(is_show=True)

    def get_queryset(self):
        queryset = super().get_queryset()

        title = self.request.query_params.get('title')
        for_whom = self.request.query_params.getlist('for_whom')
        subjects = self.request.query_params.getlist('subject')
        grade = self.request.query_params.getlist('grade')
        ordering = self.request.query_params.getlist('ordering')

        if title:
            queryset = queryset.filter(title__icontains=title)
        if for_whom:
            queryset = queryset.filter(for_whom__code__in=for_whom)
        if subjects:
            queryset = queryset.filter(subjects__code__in=subjects)
        if grade:
            queryset = queryset.filter(grade__in=grade)
        if ordering:
            queryset = queryset.order_by(*ordering)
        
        return queryset