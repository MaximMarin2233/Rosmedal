from rest_framework import serializers

from courses.models import (
    CourseCollectiveApplication,
    CourseCollectiveApplicationStudent,
    CourseCollectiveApplicationCoordinator
)

from courses.services import send_collective_application_mail


class CourseCollectiveApplicationCoordinatorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CourseCollectiveApplicationCoordinator
        exclude = ['application']


class CourseCollectiveApplicationStudentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CourseCollectiveApplicationStudent
        exclude = ['application']


class CourseCollectiveApplicationSerializer(serializers.ModelSerializer):
    coordinator = CourseCollectiveApplicationCoordinatorSerializer()
    students = CourseCollectiveApplicationStudentSerializer(many=True)

    def create(self, validated_data):
        request = self.context.get('request')
        coordinator_data = validated_data.pop('coordinator')
        students_data = validated_data.pop('students')

        application = CourseCollectiveApplication.objects.create(user=request.user, **validated_data)
        CourseCollectiveApplicationCoordinator.objects.create(application=application, **coordinator_data)
        for student_data in students_data:
            CourseCollectiveApplicationStudent.objects.create(application=application, **student_data)
        send_collective_application_mail(application)
        return application

    class Meta:
        model = CourseCollectiveApplication
        exclude = ['user']