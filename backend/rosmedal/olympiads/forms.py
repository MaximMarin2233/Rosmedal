from django import forms
from django.core.exceptions import ValidationError

from .models import Olympiad


class OlympiadForm(forms.ModelForm):
    class Meta:
        model = Olympiad
        fields = '__all__'
        widgets = {
            'subjects': forms.CheckboxSelectMultiple,
            'for_whom': forms.CheckboxSelectMultiple
        }