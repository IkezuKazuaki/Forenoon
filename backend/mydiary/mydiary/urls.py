# mydiary/mydiary/urls.py
from django.contrib import admin
from django.conf import settings  # settings をインポート
from django.conf.urls.static import static  # static をインポート
from django.urls import path, include
from .views import (
    TaskListView, 
    TaskDetailView, 
    DiaryListView, 
    DiaryDetailView, 
    TodayTaskListView, 
    TasksNextWeekView, 
    DailyTaskListView,
    ProfileImageUploadView,
    UserProfileView,
    UserRegistrationView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls), 
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('diaries/', DiaryListView.as_view(), name='diary-list'),
    path('diaries/<int:pk>/', DiaryDetailView.as_view(), name='diary-detail'),
    path('today-tasks/', TodayTaskListView.as_view(), name='today-task-list'),
    path('future-tasks/', TasksNextWeekView.as_view(), name='tomorrow-task-list'),
    path('daily-tasks/', DailyTaskListView.as_view(), name='daily-task-list'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('upload-profile-image/', ProfileImageUploadView.as_view(), name='upload-profile-image'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/sleep-master/', include('sleep_master.urls')),  # sleep_masterのURLを追加
    path('api/timetable/', include('timetable.urls')),  # timetableのURLを追加
]

# メディアファイルのURL設定（開発環境のみ）
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
