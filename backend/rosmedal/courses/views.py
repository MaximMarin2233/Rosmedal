from django.db.models import F, ExpressionWrapper, DecimalField

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import (
    Course,
    CourseCollectiveApplication,

    CourseVariation
)

from .serializers import (
    CourseVariationSerializer,

    CourseListSerializer,
    CourseDetailSerializer,

    CourseCollectiveApplicationSerializer
)


class CourseVariationListView(generics.ListAPIView):
    queryset = CourseVariation.objects.all().order_by('pk')
    serializer_class = CourseVariationSerializer


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all().select_related('variation')
    serializer_class = CourseListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        title = self.request.query_params.get('title')
        variation = self.request.query_params.getlist('variation')
        subjects = self.request.query_params.getlist('subject')
        price_lte = self.request.query_params.get('price_lte')
        price_gte = self.request.query_params.get('price_gte')
        education_degree = self.request.query_params.getlist('education_degree')
        ordering = self.request.query_params.getlist('ordering')
        number_of_hours = [int(i) for i in self.request.query_params.getlist('number_of_hours')]
        if title:
            queryset = queryset.filter(title__icontains=title)
        if subjects:
            queryset = queryset.filter(subjects__code__in=subjects)
        if variation:
            queryset = queryset.filter(variation__id__in=variation)
        if price_lte or price_gte:
            queryset = queryset.annotate(
                discount_price=ExpressionWrapper(
                    F('variation__base_price')*(1-F('variation__discount_percentage')/100),
                    DecimalField(max_digits=11, decimal_places=2)
                ),
            )
            if price_lte:
                queryset = queryset.filter(discount_price__lte=int(price_lte))
            if price_gte:
                queryset = queryset.filter(discount_price__gte=int(price_gte))
        if education_degree:
            queryset = queryset.filter(education_degree__code__in=education_degree)
        if number_of_hours:
            queryset = queryset.filter(variation__hour_coefficients__number_of_hours__in=number_of_hours)
        if ordering:
            queryset = queryset.order_by(*ordering)
        
        return queryset


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all().select_related('variation')
    serializer_class = CourseDetailSerializer


class CourseCollectiveApplicationCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CourseCollectiveApplicationSerializer
    queryset = CourseCollectiveApplication.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context