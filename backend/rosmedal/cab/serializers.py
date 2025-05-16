from rest_framework import serializers

from common.models import Review
from courses.models import (
    Course,
    UserCourse,
    UserCourseAddition
)
from docs.models import Document

from orders.models import PromotionalCode


class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        exclude = ['is_confirmed']


class BalanceReplenishSerializer(serializers.Serializer):
    amount = serializers.IntegerField()


class SubscriptionPurchaseSerializer(serializers.Serializer):
    DURATION_CHOICES = [
        (1, '1 Month'),
        (3, '3 Months'),
        (6, '6 Months'),
    ]

    duration = serializers.ChoiceField(choices=DURATION_CHOICES)
    

class DocumentPurchaseSerializer(serializers.Serializer):
    from_balance = serializers.BooleanField()
    promotional_code = serializers.CharField(required=False)
    documents = serializers.ListField(min_length=1)
    use_bonus = serializers.BooleanField()

    def validate(self, attrs):
        documents = attrs.get('documents')
        promotional_code = attrs.get("promotional_code")
        if not Document.objects.filter(pk__in=documents, is_paid=False).count() == len(documents):
            raise serializers.ValidationError('One or more documents do not exist')
        if promotional_code:
            try:
                promotional_code_obj = PromotionalCode.objects.get(code=promotional_code)
                attrs["promotional_code"] = promotional_code_obj
            except PromotionalCode.DoesNotExist:
                raise serializers.ValidationError("Promotional code doesn't exist")
        else:
            attrs["promotional_code"] = None
        return attrs
    

class UserCourseDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserCourse
        exclude = ['user']
    

class UserCourseAdditionSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserCourseAddition
        fields = "__all__"

    
class UserCourseListSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()
    course_variation = serializers.SerializerMethodField()

    class Meta:
        model = UserCourse
        fields = ['id', 'course_title', 'number_of_hours', 'course_variation', 'is_paid']

    def get_course_title(self, obj):
        return obj.course.title

    def get_course_variation(self, obj):
        return obj.course.variation.pk


class UserCourseCreateSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        # проверить, если часовая вариация такого типа курса и есть ли учебный план с таким кол-вом часов
        course = attrs['course']
        number_of_hours = attrs['number_of_hours']

        if not course.variation.hour_coefficients.filter(number_of_hours=number_of_hours).exists():
            raise serializers.ValidationError('Тип курса не предусматривает такое кол-во часов')
        
        if not course.syllabuses.filter(course_hours=number_of_hours).exists():
            raise serializers.ValidationError('Курс не имеет учебного плана на такое кол-во часов')
        
        return attrs

    class Meta:
        model = UserCourse
        fields = ['id', 'course', 'number_of_hours']


class UserCoursePurchaseSerializer(serializers.Serializer):
    additions = serializers.ListField(required=False)
    promotional_code = serializers.CharField(required=False)
    from_balance = serializers.BooleanField()
    user_course = serializers.PrimaryKeyRelatedField(
        queryset=UserCourse.objects.all().select_related('user', 'course', 'course__variation'),
    )

    def validate_promotional_code(self, value):
        promotional_code = value
        try:
            obj = PromotionalCode.objects.get(code=promotional_code)
        except PromotionalCode.DoesNotExist:
            raise serializers.ValidationError("Промокода не существует")
        return obj
    
    def validate_additions(self, value):
        additions = value
        addition_objects = UserCourseAddition.objects.filter(pk__in=additions)
        if not addition_objects.count() == len(additions):
            raise serializers.ValidationError("Одно или более дополнений не найдены")
        return addition_objects
    
    def validate_user_course(self, value):
        request = self.context['request']
        user_course = value
        user = request.user
        if not user_course.user == user:
            raise serializers.ValidationError("Курс не принадлежит пользователю")
        if user_course.is_paid:
            raise serializers.ValidationError("Курс уже оплачен")
        if not user_course.is_data_filled():
            raise serializers.ValidationError("Данные обучающегося не заполнены")
        return user_course
    

class UserCoursePassTestSerializer(serializers.Serializer):
    user_course = serializers.PrimaryKeyRelatedField(
        queryset=UserCourse.objects.all().select_related('user', 'course', 'course__variation'),
    )

    def validate_user_course(self, value):
        request = self.context['request']
        user_course = value
        user = request.user
        if not user_course.user == user:
            raise serializers.ValidationError("Курс не принадлежит пользователю")
        if not user_course.is_paid:
            raise serializers.ValidationError("Курс не оплачен")
        if user_course.test_passed:
            raise serializers.ValidationError("Итоговая аттестация уже пройдена")
        return user_course
    

class UserCourseUpdateSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        if self.instance.test_passed:
            raise serializers.ValidationError("Курс уже пройден.")
        return super().validate(attrs)

    class Meta:
        model = UserCourse
        fields = [
            "first_name", "last_name",
            "patronymic", "date_of_birth",
            "gender", "citizenship",
            "education_degree", "diploma_series",
            "diploma_number", "graduation_date",
            "qualification", "position",
            "snils", "delivery_address",
            "diploma_scan"
        ]
