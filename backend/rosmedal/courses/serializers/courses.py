from rest_framework import serializers

from courses.models import (
    CourseVariation,
    CourseVariationHourCoefficientPrice,

    Course,
    CourseSyllabus,
    CourseSyllabusModule,

    UserCourse,
    UserCourseAddition,

    EducationDegree
)

from olympiads.serializers import SubjectSerializer


class EducationDegreeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = EducationDegree
        fields = ['id', 'name']


class UserCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCourse
        fields = '__all__'


class CourseSyllabusModuleSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseSyllabusModule
        fields = '__all__'


class CourseSyllabusSerializer(serializers.ModelSerializer):
    modules = CourseSyllabusModuleSerializer(many=True)
    class Meta:
        model = CourseSyllabus
        fields = '__all__'


class CourseVariationHourPriceCoefficientSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseVariationHourCoefficientPrice
        fields = '__all__'


class CourseVariationSerializer(serializers.ModelSerializer):
    hour_coefficients = CourseVariationHourPriceCoefficientSerializer(many=True)
    class Meta:
        model = CourseVariation
        fields = '__all__'


class CourseDetailSerializer(serializers.ModelSerializer):
    syllabuses = CourseSyllabusSerializer(many=True)
    subjects = SubjectSerializer(many=True)
    education_degree = EducationDegreeSerializer(many=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'title',
            'short_description',
            'id',
            'variation',
            'image',
        ]