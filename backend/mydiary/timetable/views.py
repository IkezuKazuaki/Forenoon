from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
import google.generativeai as genai
from django.conf import settings
import base64
import json
import logging
import traceback
from .models import ClassEntry
from .serializers import ClassEntrySerializer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

# ロガーの設定
logger = logging.getLogger('timetable')

class ClassEntryViewSet(viewsets.ModelViewSet):
    """
    時間割の授業エントリーに対するCRUD操作を提供するViewSet
    """
    serializer_class = ClassEntrySerializer
    permission_classes = [IsAuthenticated]    
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get_queryset(self):
        """
        現在のユーザーに関連する授業エントリーのみを返す
        """
        return ClassEntry.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        新しい授業エントリーを作成する
        """
        api_name = 'timetable.create'
        user_id = request.user.id
        request_data = request.data
        
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'授業エントリーの作成中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        """
        既存の授業エントリーを更新する
        """
        api_name = 'timetable.update'
        user_id = request.user.id
        request_data = request.data
        
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'授業エントリーの更新中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, *args, **kwargs):
        """
        授業エントリーを削除する
        """
        api_name = 'timetable.destroy'
        user_id = request.user.id
        request_data = {'id': kwargs.get('pk')}
        
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'授業エントリーの削除中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def retrieve(self, request, *args, **kwargs):
        """
        特定の授業エントリーを取得する
        """
        api_name = 'timetable.retrieve'
        user_id = request.user.id
        request_data = {'id': kwargs.get('pk')}
        
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'授業エントリーの取得中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def list(self, request, *args, **kwargs):
        """
        授業エントリーの一覧を取得する
        """
        api_name = 'timetable.list'
        user_id = request.user.id
        request_data = request.query_params.dict()
        
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'授業エントリー一覧の取得中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def perform_create(self, serializer):
        """
        新しい授業エントリーを作成する際に、現在のユーザーを自動的に設定
        """
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_day(self, request):
        """
        曜日ごとに授業エントリーをグループ化して返すカスタムエンドポイント
        """
        api_name = 'timetable.by_day'
        user_id = request.user.id
        request_data = request.query_params.dict()
        
        try:
            user_entries = self.get_queryset()
            days = ClassEntry.DAY_CHOICES
            
            result = {}
            for day_code, day_name in days:
                day_entries = user_entries.filter(day=day_code).order_by('period')
                result[day_code] = {
                    'day_name': day_name,
                    'entries': ClassEntrySerializer(day_entries, many=True).data
                }
            
            return Response(result)
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'曜日ごとの授業エントリー取得中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='from-image')
    def from_image(self, request):
        """
        時間割画像から授業情報を抽出するエンドポイント
        """
        api_name = 'timetable.from_image'
        user_id = request.user.id
        request_data = {'file_name': request.FILES.get('image', {}).name if 'image' in request.FILES else 'None'}
        
        if 'image' not in request.FILES:
            logger.error(
                'Missing image file', 
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': '画像ファイルが必要です'
                }
            )
            return Response(
                {'error': '画像ファイルが必要です'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        
        try:
            # Gemini APIの設定
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            # 画像をbase64エンコード
            image_content = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Gemini APIへのプロンプト
            prompt = """
            この時間割表の画像から授業情報を抽出してください。
            以下の情報を含む授業リストをJSON形式で返してください:
            - day: 曜日コード（MON, TUE, WED, THU, FRI）
            - period: 時限（1〜6の整数）
            - subject_name: 科目名
            - room: 教室（ない場合は空文字列）
            - teacher: 教員名（ない場合は空文字列）
            - note: メモ（ない場合は空文字列）
            
            例:
            [
              {
                "day": "MON",
                "period": 1,
                "subject_name": "数学",
                "room": "A101",
                "teacher": "山田先生",
                "note": ""
              },
              ...
            ]
            
            日本語の曜日は以下のように変換してください:
            - 月曜日 → MON
            - 火曜日 → TUE
            - 水曜日 → WED
            - 木曜日 → THU
            - 金曜日 → FRI
            
            JSONのみを返してください。
            """
            
            # Gemini APIにリクエスト
            response = model.generate_content([
                prompt,
                {
                    "mime_type": image_file.content_type,
                    "data": image_content
                }
            ])
            
            # レスポンスからJSONを抽出
            response_text = response.text
            
            # JSONの部分を抽出（余分なテキストがある場合）
            json_start = response_text.find('[')
            json_end = response_text.rfind(']') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                classes = json.loads(json_str)
            else:
                # JSON形式でない場合はエラー
                error_msg = 'Gemini APIからの応答を解析できませんでした'
                logger.error(
                    error_msg,
                    extra={
                        'name': api_name,
                        'user_id': user_id,
                        'request_data': json.dumps(request_data),
                        'message': f'{error_msg}: {response_text}'
                    }
                )
                return Response(
                    {'error': error_msg}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # 抽出された授業情報を返す
            return Response(classes)
            
        except Exception as e:
            # スタックトレースを取得
            stack_trace = traceback.format_exc()
            error_msg = f'画像解析中にエラーが発生しました: {str(e)}'
            
            # エラーログを出力
            logger.error(
                error_msg,
                extra={
                    'name': api_name,
                    'user_id': user_id,
                    'request_data': json.dumps(request_data),
                    'message': f'{error_msg}\n{stack_trace}'
                }
            )
            
            return Response(
                {'error': error_msg}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
