from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class ClassEntry(models.Model):
    """
    時間割の授業エントリーを表すモデル
    月曜日から金曜日までの1限～6限の授業を登録する
    """
    DAY_CHOICES = [
        ('MON', '月曜日'),
        ('TUE', '火曜日'),
        ('WED', '水曜日'),
        ('THU', '木曜日'),
        ('FRI', '金曜日'),
    ]
    
    PERIOD_CHOICES = [
        (1, '1限'),
        (2, '2限'),
        (3, '3限'),
        (4, '4限'),
        (5, '5限'),
        (6, '6限'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='class_entries')
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    period = models.IntegerField(choices=PERIOD_CHOICES)
    subject_name = models.CharField(max_length=100)
    room = models.CharField(max_length=50, blank=True, null=True)
    teacher = models.CharField(max_length=100, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    
    class Meta:
        # 同じユーザーの同じ曜日・時限の組み合わせは一意であるべき
        unique_together = ('user', 'day', 'period')
        ordering = ['day', 'period']
    
    def __str__(self):
        return f"{self.get_day_display()} {self.get_period_display()} - {self.subject_name}"
