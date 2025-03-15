from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClassEntryViewSet

# DRF routerを使用してViewSetのURLを自動生成
router = DefaultRouter()
router.register(r'classes', ClassEntryViewSet, basename='class-entry')

urlpatterns = [
    path('', include(router.urls)),
]
