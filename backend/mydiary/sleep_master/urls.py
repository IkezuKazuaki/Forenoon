from django.urls import path
from django.conf import settings  # settingsをインポート
from django.conf.urls.static import static  # staticをインポート
from .views import (
    SleepScheduleListCreateView, 
    SleepScheduleRetrieveUpdateDestroyView,
    LatestSleepScheduleView,
    GeminiMessageView, 
    CharacterListView,
)

urlpatterns = [
    path('schedules/', SleepScheduleListCreateView.as_view(), name='sleep-schedule-list-create'),
    path('schedules/<int:id>/', SleepScheduleRetrieveUpdateDestroyView.as_view(), name='sleep-schedule-detail'),
    path('schedules/latest/', LatestSleepScheduleView.as_view(), name='sleep-schedule-latest'),  # 新しいエンドポイント
    path('gemini/message/', GeminiMessageView.as_view(), name='gemini-message'),
    path('characters/', CharacterListView.as_view(), name='character-list'),
]

# メディアファイルの配信設定
if settings.DEBUG:  # 開発環境でのみ有効
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
