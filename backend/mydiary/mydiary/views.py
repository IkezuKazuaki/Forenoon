# views.py
import logging
from datetime import date, timedelta  # datetimeモジュールをインポート
from django.utils import timezone
from django.db.models import Q  # 複数条件でフィルタリングを行うため
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated  # 追加

from .models import Task, Diary  # TaskとDiaryは一度にインポート
from .serializers import TaskSerializer, DiarySerializer, UserSerializer, UserRegistrationSerializer

logger = logging.getLogger(__name__)

User = get_user_model()  # カスタムユーザーモデルを取得

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

class ProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        print("FILES:", request.FILES)
        user = request.user

        if 'profile_image' not in request.data:
            return Response({'error': 'プロフィール画像が含まれていません'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})  # コンテキストにリクエストを渡す
        return Response(serializer.data)

# タスクリストの取得と作成
class TaskListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)  # ログインユーザーのタスクのみ取得
        is_daily = self.request.query_params.get('is_daily')
        if is_daily is not None:
            if is_daily.lower() == 'true':
                queryset = queryset.filter(is_daily=True)
            elif is_daily.lower() == 'false':
                queryset = queryset.filter(is_daily=False)
        return queryset

# 個別のタスクの取得、更新、削除
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)  # ユーザーIDでフィルタリング

    def get_serializer(self, *args, **kwargs):
        if self.request.method == 'PUT':
            kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)


# 日記の取得と作成
class DiaryListView(generics.ListCreateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Diary.objects.filter(user=user)  # ユーザーIDでフィルタリング
        date_param = self.request.query_params.get('date', None)
        if date_param is not None:
            queryset = queryset.filter(date=date_param)
        return queryset

# 個別の日記の取得、更新、削除
class DiaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Diary.objects.filter(user=user)  # ユーザーIDでフィルタリング

# 今日のタスクリスト
class TodayTaskListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        date_param = self.request.query_params.get('date', None)
        if date_param:
            try:
                today = timezone.datetime.strptime(date_param, "%Y-%m-%d").date()
                return Task.objects.filter(date=today, user=user)
            except ValueError:
                print("Invalid date format received:", date_param)
                return Task.objects.none()
        return Task.objects.none()

    def perform_create(self, serializer):
        # リクエストから 'is_daily' を取得し、boolean に変換
        is_daily = self.request.data.get('is_daily', False)
        if isinstance(is_daily, str):
            is_daily = is_daily.lower() in ['true', '1', 'yes']

        if is_daily:
            # デイリータスクの場合は date を null に設定
            serializer.save(user=self.request.user, date=None, is_daily=True)
        else:
            # デイリータスクでない場合の処理
            date_param = self.request.data.get('date', None)
            if date_param:
                try:
                    task_date = timezone.datetime.strptime(date_param, "%Y-%m-%d").date()
                except ValueError:
                    print("Invalid date format received:", date_param)
                    task_date = timezone.now().date()  # パースできない場合は現在の日付を設定
            else:
                print("No 'date' provided, defaulting to today.")
                task_date = timezone.now().date()  # デフォルトで今日の日付を設定

            serializer.save(user=self.request.user, date=task_date, is_daily=False)
# 明日のタスクリスト
class TasksNextWeekView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        date_param = self.request.query_params.get('date', None)
        if date_param:
            # リクエストの `date` を解析
            start_date = timezone.datetime.strptime(date_param, "%Y-%m-%d").date()
            end_date = start_date + timedelta(days=6)
            # 翌日から一週間以内のタスクを取得
            return Task.objects.filter(date__range=(start_date, end_date), user=user)
        return Task.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, is_daily=False)

# デイリータスク
class DailyTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(is_daily=True, user=user)  # is_daily=True かつユーザーでフィルタリング
