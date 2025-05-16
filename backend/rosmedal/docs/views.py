from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from .models import Document, DocumentVariation
from .serializers import DocumentSerializer, DocumentVariationListSerializer


class DocumentVariationListView(generics.ListAPIView):
    serializer_class = DocumentVariationListSerializer
    queryset = DocumentVariation.objects.all()


class DocumentCheckView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Document.objects.filter(is_paid=True)
    serializer_class = DocumentSerializer

    def get(self, request, *args, **kwargs):
        pk = self.request.query_params.get('pk')
        full_name = self.request.query_params.get('full_name')
        
        if not(pk or full_name):
            return Response(status=HTTP_400_BAD_REQUEST,
                            data={'message': 'missing id or full_name'})

        return super().get(request, *args, **kwargs)

    def get_queryset(self):

        queryset = super().get_queryset()

        pk = self.request.query_params.get('pk')
        full_name = self.request.query_params.get('full_name')

        if pk:
            queryset = queryset.filter(pk=pk)
        if full_name:
            queryset = queryset.filter(full_name=full_name)

        return queryset
