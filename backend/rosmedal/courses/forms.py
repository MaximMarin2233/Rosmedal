from django import forms

from .models import Course


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = '__all__'
        widgets = {
            'subjects': forms.CheckboxSelectMultiple,
            'education_degree': forms.CheckboxSelectMultiple
        }