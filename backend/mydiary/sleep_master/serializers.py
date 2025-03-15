# sleep_master/serializers.py

from rest_framework import serializers
from .models import SleepSchedule, Character

class SleepScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepSchedule
        fields = ['id', 'wake_up_time', 'sleep_time', 'date']

class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ['id', 'name', 'description', 'icon']

class GeminiMessageSerializer(serializers.Serializer):
    character = serializers.CharField(required=True)  # キャラクターID
    content = serializers.CharField(required=True)  # ユーザーのメッセージ
    current_time = serializers.CharField(required=False)  # 現在時刻（オプション）
    wake_up_time = serializers.CharField(required=False)  # 目標起床時刻（オプション）
    sleep_time = serializers.CharField(required=False)  # 目標就寝時刻（オプション）
    icon = serializers.URLField(required=False)  # キャラクターアイコンURL（オプション）