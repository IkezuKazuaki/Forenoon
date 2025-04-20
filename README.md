## 概要 | Overview

Forenoonは、ユーザーの日常生活をサポートするための多機能Webアプリケーションです。タスク管理、日記記録、睡眠スケジュール管理、時間割管理などの機能を統合し、ユーザーの生産性向上と健康的な生活習慣の確立を支援します。

## 機能 | Features

- **ユーザー認証** | **User Authentication**
  - アカウント登録、ログイン/ログアウト
  - プロフィール画像のアップロードと管理
  - JWT認証によるセキュアなアクセス

- **タスク管理** | **Task Management**
  - デイリータスク、今日のタスク、今後のタスクの作成と管理
  - タスクの完了状態の追跡
  - タスクの編集と削除

- **日記機能** | **Diary Function**
  - 日付ごとの日記の作成と管理
  - タスクと日記の関連付け
  - タイムライン形式での表示

- **睡眠管理（SleepMaster）** | **Sleep Management (SleepMaster)**
  - 目標起床時間と就寝時間の設定
  - AIアシスタントとの対話によるサポート
  - 複数のキャラクターから選択可能なAIアシスタント

- **時間割管理** | **Timetable Management**
  - 曜日と時限ごとの授業スケジュール管理
  - 科目、教室、教員情報の記録
  - 画像から時間割の自動読み取り

## 技術スタック | Technology Stack

### バックエンド | Backend
- **言語** | **Language**: Python 3.x
- **フレームワーク** | **Framework**: Django 5.1.2, Django REST Framework
- **データベース** | **Database**: MySQL
- **認証** | **Authentication**: JWT (JSON Web Token)
- **外部API** | **External API**: Google Gemini API 1.5 Flash

### フロントエンド | Frontend
- **言語** | **Language**: JavaScript (ES6+)
- **フレームワーク** | **Framework**: React 18.3.1
- **状態管理** | **State Management**: React Hooks, Context API
- **ルーティング** | **Routing**: React Router 6.27.0
- **HTTP通信** | **HTTP Communication**: Axios 1.7.7
- **UI/UXライブラリ** | **UI/UX Libraries**:
  - Bootstrap 5.3.3
  - React Bootstrap 2.10.5
  - Material UI 6.1.4
  - React Icons 5.3.0
- **日付/時間管理** | **Date/Time Management**:
  - date-fns 4.1.0
  - moment 2.30.1
  - React Calendar 5.1.0
  - React Datepicker 7.5.0
  - FullCalendar 6.1.15

## プロジェクト構造 | Project Structure

```
forenoon/
├── backend/                 # バックエンドコード
│   └── mydiary/             # Djangoプロジェクト
│       ├── mydiary/         # コアアプリケーション
│       ├── sleep_master/    # 睡眠管理アプリケーション
│       ├── timetable/       # 時間割管理アプリケーション
│       └── manage.py        # Djangoコマンドラインツール
│
├── frontend/                # フロントエンドコード
│   ├── public/              # 静的ファイル
│   └── src/                 # Reactソースコード
│       ├── components/      # 共通コンポーネント
│       ├── contexts/        # Reactコンテキスト
│       ├── features/        # 機能別コンポーネント
│       ├── api/             # API通信
│       └── App.js           # メインアプリケーション
│
└── README.md                # プロジェクト説明
```

## セットアップと実行方法 | Setup and Running

### 前提条件 | Prerequisites
- Python 3.x
- Node.js と npm
- MySQL

### バックエンドのセットアップ | Backend Setup

```bash
# 仮想環境の作成と有効化
python -m venv myenv
source myenv/bin/activate  # Linuxの場合
myenv\Scripts\activate     # Windowsの場合

# 依存関係のインストール
cd backend
pip install -r requirements.txt

# データベースのセットアップ
cd mydiary
python manage.py migrate

# 開発サーバーの起動
python manage.py runserver
```

### フロントエンドのセットアップ | Frontend Setup

```bash
# 依存関係のインストール
cd frontend
npm install

# 開発サーバーの起動
npm start
```

アプリケーションは以下のURLでアクセスできます：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000

## 環境変数 | Environment Variables

バックエンドの `backend/mydiary/.env` ファイルに以下の環境変数を設定してください：

```
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Django設定
DJANGO_SECRET_KEY=your_django_secret_key
DJANGO_DEBUG=True

# データベース設定
DB_NAME=mydiary_db
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# CORS設定
CORS_ORIGIN_ALLOW_ALL=True
```

フロントエンドの `.env` ファイルに以下の環境変数を設定してください：

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 環境変数の説明

- **GEMINI_API_KEY**: Google Gemini APIのアクセスキー
- **DJANGO_SECRET_KEY**: Djangoアプリケーションの秘密鍵（セキュリティのため必ず変更してください）
- **DJANGO_DEBUG**: デバッグモードの有効/無効（本番環境では `False` に設定）
- **DB_NAME, DB_USER, DB_PASSWORD**: データベース接続情報
- **CORS_ORIGIN_ALLOW_ALL**: CORS設定（本番環境では `False` に設定し、特定のオリジンのみ許可）

## API仕様 | API Specification

詳細なAPI仕様については、[forenoon_technical_documentation.md](forenoon_technical_documentation.md)を参照してください。

主要なエンドポイント：

- **認証** | **Authentication**
  - `POST /api/register/`: ユーザー登録
  - `POST /api/token/`: JWTトークン取得
  - `POST /api/token/refresh/`: JWTトークン更新

- **タスク管理** | **Task Management**
  - `GET /tasks/`: タスク一覧取得
  - `POST /tasks/`: タスク作成
  - `GET /tasks/{id}/`: 特定タスク取得
  - `PUT /tasks/{id}/`: タスク更新
  - `DELETE /tasks/{id}/`: タスク削除

- **日記** | **Diary**
  - `GET /diaries/`: 日記一覧取得
  - `POST /diaries/`: 日記作成
  - `GET /diaries/{id}/`: 特定日記取得
  - `PUT /diaries/{id}/`: 日記更新
  - `DELETE /diaries/{id}/`: 日記削除

- **睡眠管理** | **Sleep Management**
  - `GET /api/sleep-master/schedules/`: スケジュール一覧取得
  - `POST /api/sleep-master/schedules/`: スケジュール作成
  - `POST /api/sleep-master/gemini/message/`: Gemini APIメッセージ送信

- **時間割** | **Timetable**
  - `GET /api/timetable/classes/`: 授業一覧取得
  - `POST /api/timetable/classes/`: 授業作成
  - `GET /api/timetable/classes/by_day/`: 曜日別授業取得

