from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.db import transaction

from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from docs.models import Document
from docs.serializers import DocumentSerializer
from docs.services import DocumentPurchaseService

from cab.serializers import (
    DocumentPurchaseSerializer,
)


class UserDocumentCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({'error': 'Invalid data format. Expected a list of documents.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        for data in serializer.validated_data:
            data['user'] = self.request.user
        serializer.save()


class UserDocumentListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def get_queryset(self):

        queryset = super().get_queryset().filter(user=self.request.user)

        is_paid = self.request.query_params.get('is_paid')

        if is_paid:
            queryset = queryset.filter(is_paid=is_paid)

        return queryset


class UserDocumentDetailView(generics.RetrieveAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    # def get_queryset(self):
    #     queryset = super().get_queryset().filter(user=self.request.user)
    #     return queryset


class UserDocumentPurchaseView(views.APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentPurchaseSerializer
    
    @swagger_auto_schema(
        request_body=DocumentPurchaseSerializer,
        responses={
            200: openapi.Response('Documents', DocumentSerializer(many=True)),
            400: 'Bad Request'
        }
    )
    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        serializer = DocumentPurchaseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=serializer.errors
            )
        validated_data = serializer.validated_data
        
        documents = Document.objects.filter(
            pk__in=validated_data.pop('documents'),
            is_paid=False
        ).select_related('variation')
        use_bonus = validated_data.get("use_bonus")
        user = request.user
        from_balance = validated_data.get("from_balance")
        promotional_code = validated_data.get("promotional_code")
        
        purchase_service = DocumentPurchaseService(
            documents,
            user,
            promotional_code,
            use_bonus
        )

        if from_balance:
            documents, error = purchase_service.purchase_documents_through_balance()
        else:
            payment_response, error = purchase_service.purchase_documents_through_yookassa()

        if error:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'message': error}
            )
        
        if from_balance:
            return Response(
                status=status.HTTP_200_OK,
                data={'documents': DocumentSerializer(documents, many=True).data}
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=payment_response
            )


class UserDocumentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        # Возвращаем только документы авторизованного пользователя
        return super().get_queryset().filter(user=self.request.user)