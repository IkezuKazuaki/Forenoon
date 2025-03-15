from django import forms
from .models import Diary, Task, DiaryTask

class DiaryForm(forms.ModelForm):
    tasks = forms.ModelMultipleChoiceField(
        queryset=Task.objects.all(), 
        widget=forms.CheckboxSelectMultiple,  # チェックボックスを使って表示
        required=False
    )

    class Meta:
        model = Diary
        fields = ['date', 'content', 'tasks']

    def save(self, commit=True):
        diary = super().save(commit=False)
        if commit:
            diary.save()
        # チェックされたタスクの保存
        tasks = self.cleaned_data['tasks']
        for task in tasks:
            DiaryTask.objects.create(diary=diary, task=task, is_completed=True)
        return diary
