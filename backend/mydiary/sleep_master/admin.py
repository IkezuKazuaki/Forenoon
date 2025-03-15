from django.contrib import admin
from .models import Character

@admin.register(Character)  # 管理画面にモデルを登録
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')  # 一覧表示する項目
    search_fields = ('name',)  # 検索可能なフィールド
