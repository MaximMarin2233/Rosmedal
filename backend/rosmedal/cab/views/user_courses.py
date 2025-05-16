from rest_framework import generics, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db import transaction

from courses.models import UserCourse, UserCourseAddition
from courses.services import (
    CoursePurchaseService,
    user_course_test_pass_confirm
)
from courses.serializers import UserCourseSerializer

from cab.serializers import (
    UserCoursePurchaseSerializer,
    UserCourseCreateSerializer,
    UserCourseDetailSerializer,
    UserCourseListSerializer,
    UserCourseUpdateSerializer,
    UserCoursePassTestSerializer,
    UserCourseAdditionSerializer
)


class UserCourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseListSerializer
    queryset = UserCourse.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)


class UserCourseUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseUpdateSerializer
    queryset = UserCourse.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

class UserCourseDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseDetailSerializer
    queryset = UserCourse.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)


class UserCourseCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseCreateSerializer
    queryset = UserCourse.objects.all()

    def perform_create(self, serializer):
        data = serializer.validated_data
        data['user'] = self.request.user
        serializer.save()


class UserCourseDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseCreateSerializer
    queryset = UserCourse.objects.all()

    def get_queryset(self):
        # Возвращаем только неоплаченные курсы авторизованного пользователя
        return super().get_queryset().filter(user=self.request.user, is_paid=False)


class UserCoursePurchaseView(views.APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = UserCoursePurchaseSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=serializer.errors
            )
        validated_data = serializer.validated_data
        from_balance = validated_data.get("from_balance")
        user_course = validated_data.get("user_course")
        additions = validated_data.get("additions")
        promotional_code = validated_data.get("promotional_code")

        purchase_service = CoursePurchaseService(
            user_course=user_course,
            additions=additions,
            promotional_code=promotional_code,
        )
        
        if from_balance:
            user_course, error = purchase_service.purchase_course_through_balance()
        else:
            payment_response, error = purchase_service.purchase_course_through_yookassa()

        if error:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=error
            )
        
        if from_balance:
            return Response(
                status=status.HTTP_200_OK,
                data=UserCourseSerializer(user_course).data
            )
        else:
            return Response(
                status=status.HTTP_200_OK,
                data=payment_response
            )
    

class UserCourseTestPassView(views.APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = UserCoursePassTestSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=serializer.errors
            )
        validated_data = serializer.validated_data
        user_course, error = user_course_test_pass_confirm(**validated_data)

        if error:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data=error
            )
        
        return Response(
            status=status.HTTP_200_OK,
            data=UserCourseSerializer(user_course).data
        )
    

class UserCourseAdditionListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserCourseAdditionSerializer
    queryset = UserCourseAddition.objects.all()


