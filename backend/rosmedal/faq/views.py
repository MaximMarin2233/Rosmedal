from rest_framework import generics

from .models import PageFAQQuestion
from .serializers import PageFAQQuestionListSerializer

class PageFAQQuestionListView(generics.ListAPIView):
    serializer_class = PageFAQQuestionListSerializer
    queryset = PageFAQQuestion.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category')
        
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset


