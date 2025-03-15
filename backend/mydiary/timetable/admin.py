from django.contrib import admin
from .models import ClassEntry

@admin.register(ClassEntry)
class ClassEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'day', 'period', 'subject_name', 'room', 'teacher')
    list_filter = ('day', 'period', 'user')
    search_fields = ('subject_name', 'room', 'teacher', 'note')
