from rest_framework import generics

from .models import News

from .serializers import (
    NewsListSerializer,
    NewsDetailSerializer
)


class NewsListView(generics.ListAPIView):
    serializer_class = NewsListSerializer
    queryset = News.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()

        title = self.request.query_params.get('title')

        if title:
            queryset = queryset.filter(title__contains=title)

        return queryset


class NewsDetailView(generics.RetrieveAPIView):
    serializer_class = NewsDetailSerializer
    queryset = News.objects.all()
    