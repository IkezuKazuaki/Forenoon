from rest_framework import serializers
from .models import ClassEntry

class ClassEntrySerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    
    class Meta:
        model = ClassEntry
        fields = [
            'id', 'day', 'day_display', 'period', 'period_display', 
            'subject_name', 'room', 'teacher', 'note'
        ]
