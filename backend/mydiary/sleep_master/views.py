#sleep_master/views.py
from datetime import datetime
import pytz
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SleepSchedule, Character
from .serializers import SleepScheduleSerializer, CharacterSerializer, GeminiMessageSerializer
from rest_framework.views import APIView
import google.generativeai as genai
from google.api_core.exceptions import InvalidArgument, PermissionDenied, GoogleAPICallError
import os
import logging
from .utils.prompt_generator import generate_prompt
from django.conf import settings

# ログ設定
logger = logging.getLogger(__name__)

jst = pytz.timezone('Asia/Tokyo')

# ユーザーのスケジュールを取得または新規作成
class SleepScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = SleepScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SleepSchedule.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# 特定のスケジュールを取得、更新、削除
class SleepScheduleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SleepScheduleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return SleepSchedule.objects.filter(user=self.request.user)

# 最新のスケジュールを取得
class LatestSleepScheduleView(generics.RetrieveAPIView):
    serializer_class = SleepScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        latest_schedule = SleepSchedule.objects.filter(user=self.request.user).order_by('-date').first()
        if not latest_schedule:
            raise generics.NotFound('スケジュールが見つかりません。')
        return latest_schedule

# Gemini APIを利用したメッセージ処理
class GeminiMessageView(APIView):
    """
    フロントエンドからのメッセージを受け取り、Gemini APIを呼び出す。
    """

    def post(self, request, *args, **kwargs):
        serializer = GeminiMessageSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning("バリデーションエラー: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # バリデーション済みデータを取得
        validated_data = serializer.validated_data
        character_id = validated_data.get("character")
        content = validated_data.get("content")

        # キャラクター情報を取得
        try:
            character = Character.objects.get(id=character_id)
        except Character.DoesNotExist:
            logger.error(f"キャラクターID {character_id} が見つかりません。")
            return Response(
                {"error": "指定されたキャラクターが見つかりません。"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ユーザーのスケジュールを取得
        user = request.user
        latest_schedule = SleepSchedule.objects.filter(user=user).order_by('-date').first()
        if latest_schedule:
            wake_up_time = latest_schedule.wake_up_time.strftime('%H:%M:%S')
            sleep_time = latest_schedule.sleep_time.strftime('%H:%M:%S')
        else:
            # スケジュールがない場合のデフォルト値
            wake_up_time = "07:00:00"
            sleep_time = "23:00:00"

        username = user.username  # ログイン中のユーザーの名前を取得

        # プロンプトを生成
        prompt = generate_prompt(username, character.prompt, wake_up_time, sleep_time, content)
        logger.info(f"生成されたプロンプト: {prompt}")

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # Geminiモデルを利用してメッセージ生成
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)

            # レスポンスから返答を抽出
            reply = response.text if hasattr(response, 'text') and response.text else "返答がありませんでした。"
            logger.info(f"Geminiからの応答: {reply}")
            return Response({"reply": reply}, status=status.HTTP_200_OK)

        except PermissionDenied as e:
            logger.error(f"Gemini API認証エラー: {str(e)}")
            return Response({"error": "Gemini API認証に失敗しました。"}, status=status.HTTP_403_FORBIDDEN)

        except InvalidArgument as e:
            logger.error(f"Gemini APIリクエストエラー: {str(e)}")
            return Response({"error": f"Geminiリクエストエラー: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except GoogleAPICallError as e:
            logger.error(f"Gemini API通信エラー: {str(e)}")
            return Response({"error": f"Gemini通信エラー: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Gemini APIの処理中にエラーが発生しました: {str(e)}")
            return Response({"error": f"Gemini APIエラー: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# キャラクター情報を取得するエンドポイント
class CharacterListView(APIView):
    def get(self, request, *args, **kwargs):
        characters = Character.objects.all()
        character_list = []

        for character in characters:
            # 相対パスを完全なURLに変換
            icon_url = request.build_absolute_uri(character.icon.url) if character.icon else None
            character_list.append({
                "id": character.id,
                "name": character.name,
                "description": character.description,
                "icon": icon_url,  # 完全なURLを追加
            })

        return Response(character_list, status=status.HTTP_200_OK)
