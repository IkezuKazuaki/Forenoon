# sleep_master/models.py

from django.db import models
from django.contrib.auth import get_user_model
from PIL import Image

User = get_user_model()

class SleepSchedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sleep_schedules')
    wake_up_time = models.TimeField()
    sleep_time = models.TimeField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Sleep Schedule on {self.date}"


class Character(models.Model):
    name = models.CharField(max_length=100, unique=True)  # キャラクター名
    description = models.TextField(blank=True)  # 説明
    prompt = models.TextField(blank=True)  # ⭐️ プロンプト（AIへの指示や性格、セリフ）
    icon = models.ImageField(upload_to='character_icons/', blank=True, null=True)  # アイコン画像

    def save(self, *args, **kwargs):
        # 画像を保存
        super().save(*args, **kwargs)

        if self.icon:  # iconフィールドに画像がある場合
            img_path = self.icon.path  # ファイルパスを取得
            with Image.open(img_path) as img:
                # 画像を正方形に切り抜く
                width, height = img.size
                min_dim = min(width, height)
                left = (width - min_dim) // 2
                top = (height - min_dim) // 2
                right = left + min_dim
                bottom = top + min_dim
                img = img.crop((left, top, right, bottom))

                # 画像を200x200にリサイズ
                img = img.resize((200, 200), Image.LANCZOS)

                # 上書き保存
                img.save(img_path)

    def __str__(self):
        return self.name
