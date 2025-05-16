from typing import Any
from django.contrib import admin
from django.utils.html import format_html
from django.http import HttpRequest
from django.conf import settings

from adminsortable2.admin import SortableTabularInline, SortableAdminBase

from olympiads.filters import SubjectListFilter

from .models.courses import (
    Course,
    CourseSyllabus,
    CourseSyllabusModule,

    CourseVariationHourCoefficientPrice,
    CourseVariation,

    UserCourse,
    UserCourseAddition,
)

from .models.applications import (
    CourseCollectiveApplication,
    CourseCollectiveApplicationCoordinator,
    CourseCollectiveApplicationStudent
)

from .forms import CourseForm


@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ['course', 'user', 'number_of_hours', 'is_paid']
    readonly_fields = ['test_passed']


@admin.register(UserCourseAddition)
class UserCourseAdditionAdmin(admin.ModelAdmin):
    list_display = ['title', 'price']


    def has_delete_permission(self, request: HttpRequest, obj= ...) -> bool:
        return False
    
    def has_add_permission(self, request: HttpRequest) -> bool:
        return False


class CourseVariationHourCoefficientPriceInline(admin.TabularInline):
    model = CourseVariationHourCoefficientPrice
    fields = ['price_coefficient']
    readonly_fields = ['number_of_hours']

    def has_delete_permission(self, request: HttpRequest, obj = ...) -> bool:
        return False
    
    def has_add_permission(self, request: HttpRequest, obj=None) -> bool:
        return False



@admin.register(CourseVariation)
class CourseVariationAdmin(admin.ModelAdmin):

    readonly_fields = ['display_total_price']

    inlines = [
        CourseVariationHourCoefficientPriceInline
    ]

    def has_delete_permission(self, request: HttpRequest, obj=...) -> bool:
        return False
    
    def has_add_permission(self, request: HttpRequest) -> bool:
        return False
    
    def display_total_price(self, obj):
        return obj.total_price
    display_total_price.short_description = "Цена со скидкой (без купона)"


class CourseSyllabusModuleInline(SortableTabularInline):
    model = CourseSyllabusModule
    extra = 1


@admin.register(CourseSyllabus)
class CourseSyllabusAdmin(SortableAdminBase, admin.ModelAdmin):
    model = CourseSyllabus
    list_filter = ['course__title']
    inlines = [
        CourseSyllabusModuleInline
    ]

    def save_formset(self, request: Any, form: Any, formset: Any, change: Any) -> None:
        super().save_formset(request, form, formset, change)
        obj = form.instance
        course = obj.course
        course_variation = course.variation
        modules = obj.modules.all()

        # Создаем модуль "Итоговое тестирование"
        CourseSyllabusModule.objects.create(
            syllabus=obj,
            title="Итоговое тестирование",
            number_of_hours=2,
            number_of_lectures=0,
            number_of_independent_works=0,
            number_of_control_hours=2,
            module_order=modules.count() + 1
        )

        if not change:
            for hour_coefficient in course_variation.hour_coefficients.all():
                total_hours = hour_coefficient.number_of_hours
                base_course_hours = obj.course_hours - 2  # Учитываем исключенные контрольные часы
                target_course_hours = total_hours - 2

                print(f"Total hours: {total_hours}, Base course hours: {base_course_hours}, Target course hours: {target_course_hours}")

                if base_course_hours != target_course_hours:
                    ratio = target_course_hours / base_course_hours
                    integer_ratio = int(ratio)
                    remaining_hours = target_course_hours % base_course_hours

                    print(f"Ratio: {ratio}, Integer ratio: {integer_ratio}, Remaining hours: {remaining_hours}")

                    # Создаем новый план курса
                    syllabus = CourseSyllabus.objects.create(
                        course=course,
                        course_hours=total_hours
                    )

                    new_modules = self.create_modules(syllabus, modules, ratio, integer_ratio, remaining_hours)

                    # Обновляем все модули с учетом оставшихся часов
                    if remaining_hours > 0:
                        print(f"Распределение оставшихся часов: {remaining_hours}")
                        self.distribute_remaining_hours(new_modules, remaining_hours)
                    print('\n')

    def create_modules(self, syllabus, modules, ratio, integer_ratio, remaining_hours):
        new_modules = []
        for module in modules:
            if module.title == "Итоговое тестирование":
                new_module = CourseSyllabusModule.objects.create(
                    syllabus=syllabus,
                    title=module.title,
                    number_of_hours=module.number_of_hours,
                    number_of_lectures=module.number_of_lectures,
                    number_of_independent_works=module.number_of_independent_works,
                    number_of_control_hours=2,
                    module_order=module.module_order
                )
            else:
                new_module = CourseSyllabusModule.objects.create(
                    syllabus=syllabus,
                    title=module.title,
                    number_of_hours=module.number_of_hours * integer_ratio,
                    number_of_lectures=module.number_of_lectures * integer_ratio + (2*integer_ratio-2),
                    number_of_independent_works=module.number_of_independent_works * integer_ratio,
                    number_of_control_hours=2,
                    module_order=module.module_order
                )
            new_modules.append(new_module)
        return new_modules

    def distribute_remaining_hours(self, new_modules, remaining_hours):
        while remaining_hours > 0:
            for new_module in new_modules:
                if remaining_hours > 0 and new_module.title != 'Итоговое тестирование':
                    print(f"Добавляем 1 час к модулю: {new_module.title}")
                    new_module.number_of_hours += 1
                    new_module.number_of_lectures += 1  # При необходимости
                    new_module.save()

                    remaining_hours -= 1

                if remaining_hours == 0:
                    break
        CourseSyllabusModule.objects.bulk_update(new_modules, ['number_of_hours', 'number_of_lectures'])
        
                    

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course
    list_filter = ['variation', 'education_degree', SubjectListFilter]
    autocomplete_fields = ['test']
    readonly_fields = ['display_course_detail']
    form = CourseForm

    def display_course_detail(self, obj):
        course_detail_url = f'<a href="{settings.FRONTEND_BASE_URL}/course-details/{obj.id}">Ссылка</a>'
        return format_html(course_detail_url)
    display_course_detail.short_description = "Ссылка на курс"


###
    

class CourseCollectiveApplicationCoordinatorInline(admin.TabularInline):
    model = CourseCollectiveApplicationCoordinator
    extra = 1


class CourseCollectiveApplicationStudentInline(admin.TabularInline):
    model = CourseCollectiveApplicationStudent
    extra = 1

@admin.register(CourseCollectiveApplication)
class CourseCollectiveApplicationAdmin(admin.ModelAdmin):
    model = CourseCollectiveApplication
    readonly_fields = ['display_total_price',]
    list_display = ['__str__', 'user_email', 'created_at']
    search_fields = ['user__email', 'created_at']
    inlines = [
        CourseCollectiveApplicationCoordinatorInline,
        CourseCollectiveApplicationStudentInline,
    ]

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email пользователя'
    user_email.admin_order_field = 'user__email'

    def display_total_price(self, obj):
        return obj.total_price 
    display_total_price.short_description = 'Итоговая стоимость'


        

