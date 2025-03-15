# serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from PIL import Image
import io
from django.core.files.base import ContentFile
from .models import Task, Diary, DiaryTask
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="このユーザー名は既に使用されています。"
            )
        ]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(use_url=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_image']

    def update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image', None)
        if profile_image:
            # 画像を開く
            image = Image.open(profile_image)

            # 画像を RGB モードに変換（必要な場合）
            if image.mode != 'RGB':
                image = image.convert('RGB')

            # 画像を正方形にクロップ
            width, height = image.size
            min_dimension = min(width, height)
            left = (width - min_dimension) / 2
            top = (height - min_dimension) / 2
            right = (width + min_dimension) / 2
            bottom = (height + min_dimension) / 2
            image = image.crop((left, top, right, bottom))

            # 画像を 200x200 にリサイズ
            image = image.resize((200, 200), Image.LANCZOS)

            # 画像をバッファに保存
            buffer = io.BytesIO()
            image.save(buffer, format='JPEG', quality=90)
            buffer.seek(0)

            # 加工した画像を ContentFile に変換
            file_name = profile_image.name
            processed_image = ContentFile(buffer.read(), name=file_name)

            # validated_data の profile_image を加工後の画像に置き換える
            validated_data['profile_image'] = processed_image

        # インスタンスを更新
        return super().update(instance, validated_data)


# タスクシリアライザー
class TaskSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')  # または 'user.id'
    class Meta:
        model = Task
        fields = ['id', 'name', 'date', 'is_daily', 'created_at', 'updated_at', 'user']


# 日記シリアライザー
class DiarySerializer(serializers.ModelSerializer):
    tasks = serializers.ListField(write_only=True)  # タスクのIDリストを受け取る
    task_ids = serializers.SerializerMethodField()  # 既存タスクIDを返す

    class Meta:
        model = Diary
        fields = ['id', 'date', 'content', 'tasks', 'task_ids']

    def get_task_ids(self, obj):
        # DiaryTaskモデルを通じて関連するタスクIDのリストを返す
        return Task.objects.filter(diarytask__diary=obj).values_list('id', flat=True)

    def create(self, validated_data):
        # タスクリストを取得
        task_ids = validated_data.pop('tasks', [])
        # リクエストのuserを取得
        user = self.context['request'].user  # contextからuserを取得
        
        # 日記を作成（userをセット）
        diary = Diary.objects.create(user=user, **validated_data)
        
        # DiaryTaskに関連付ける
        for task_id in task_ids:
            task = Task.objects.get(id=task_id)
            # DiaryTaskを作成（userをセット）
            DiaryTask.objects.create(user=user, diary=diary, task=task, is_completed=False)
        
        return diary

    def update(self, instance, validated_data):
        # タスクリストを取得
        task_ids = validated_data.pop('tasks', [])

        # 日記内容の更新
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        # リクエストのuserを取得
        user = self.context['request'].user  # contextからuserを取得

        # 関連付けられているタスクの更新
        DiaryTask.objects.filter(diary=instance).delete()  # 既存の関連付けを削除
        for task_id in task_ids:
            task = Task.objects.get(id=task_id)
            DiaryTask.objects.create(user=user, diary=instance, task=task, is_completed=False)  # userを追加

        return instance