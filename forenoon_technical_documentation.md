# Forenoon アプリケーション技術ドキュメント

## 1. 技術スタック概要

Forenoonアプリケーションは、モダンなWeb技術を活用した多機能アプリケーションで、フロントエンドとバックエンドが明確に分離されたアーキテクチャを採用しています。

### 1.1 バックエンド

- **言語**: Python 3.x
- **フレームワーク**: Django 5.1.2、Django REST Framework
- **データベース**: MySQL 
- **認証**: JWT (JSON Web Token)
- **外部API**: Google Gemini API 1.5 Flash

### 1.2 フロントエンド

- **言語**: JavaScript (ES6+)
- **フレームワーク**: React 18.3.1
- **状態管理**: React Hooks、Context API
- **ルーティング**: React Router 6.27.0
- **HTTP通信**: Axios 1.7.7
- **UI/UXライブラリ**:
  - Bootstrap 5.3.3
  - React Bootstrap 2.10.5
  - Material UI 6.1.4
  - React Icons 5.3.0
- **日付/時間管理**:
  - date-fns 4.1.0
  - moment 2.30.1
  - React Calendar 5.1.0
  - React Datepicker 7.5.0
  - FullCalendar 6.1.15
- **その他ライブラリ**:
  - JWT Decode 4.0.0
  - React Spring 9.7.4（アニメーション）
  - Three.js 0.171.0（3Dグラフィックス）
  - React Three Fiber 8.17.10（React用Three.jsラッパー）

## 2. システムアーキテクチャ

### 2.1 全体アーキテクチャ

Forenoonは、RESTful APIアーキテクチャに基づいた、フロントエンドとバックエンドの分離アーキテクチャを採用しています。

```
[クライアント(ブラウザ)] <--HTTP/HTTPS--> [フロントエンド(React)] <--API(JSON)--> [バックエンド(Django)] <--> [データベース(MySQL)]
```

### 2.2 バックエンドアーキテクチャ

バックエンドは、Django REST Frameworkを使用したRESTful APIとして実装されています。

- **プロジェクト構造**: `mydiary`プロジェクト内に複数のDjangoアプリケーションが存在
  - `mydiary`: コアアプリケーション（ユーザー認証、タスク管理、日記機能）
  - `sleep_master`: 睡眠管理とAIアシスタント機能
  - `timetable`: 時間割管理機能

- **認証システム**: JWT（JSON Web Token）を使用したステートレス認証
  - アクセストークン有効期間: 30分
  - リフレッシュトークン有効期間: 1日

- **データアクセス**: Django ORMを使用したデータベースアクセス
  - モデル定義
  - クエリ最適化
  - リレーショナルデータ管理

- **API設計**: Django REST Frameworkのビューセットとシリアライザーを使用
  - ViewSets: CRUD操作の自動生成
  - Serializers: モデルとJSONの相互変換
  - Permissions: 認証と権限管理

### 2.3 フロントエンドアーキテクチャ

フロントエンドは、React.jsを使用したSPA（Single Page Application）として実装されています。

- **コンポーネント構造**: 機能ベースのディレクトリ構造
  - `src/components`: 共通コンポーネント
  - `src/features`: 機能別コンポーネント
  - `src/contexts`: コンテキスト（グローバル状態）
  - `src/api`: API通信ロジック

- **状態管理**: React HooksとContext APIを使用
  - `useState`: ローカル状態管理
  - `useEffect`: 副作用処理
  - `useContext`: グローバル状態アクセス
  - `UserContext`: ユーザー情報の共有

- **ルーティング**: React Routerを使用したクライアントサイドルーティング
  - 保護されたルート（認証必須）
  - パブリックルート（認証不要）

- **API通信**: Axiosを使用したHTTP通信
  - インターセプター: トークン自動付与
  - エラーハンドリング: 401エラー時の自動リダイレクト

## 3. データベース設計

### 3.1 主要テーブル

- **User**: カスタムユーザーモデル
  - `username`: ユーザー名
  - `password`: パスワード（ハッシュ化）
  - `profile_image`: プロフィール画像

- **Task**: タスク情報
  - `user`: タスク所有者（外部キー）
  - `name`: タスク名
  - `date`: タスク日付（null可）
  - `is_daily`: デイリータスクフラグ
  - `created_at`: 作成日時
  - `updated_at`: 更新日時

- **Diary**: 日記情報
  - `user`: 日記所有者（外部キー）
  - `date`: 日記日付
  - `content`: 日記内容
  - `created_at`: 作成日時
  - `updated_at`: 更新日時

- **DiaryTask**: 日記とタスクの関連付け
  - `user`: 所有者（外部キー）
  - `diary`: 日記（外部キー）
  - `task`: タスク（外部キー）
  - `is_completed`: 完了状態

- **SleepSchedule**: 睡眠スケジュール
  - `user`: スケジュール所有者（外部キー）
  - `wake_up_time`: 目標起床時間
  - `sleep_time`: 目標就寝時間
  - `date`: 記録日付

- **Character**: AIアシスタントキャラクター
  - `name`: キャラクター名
  - `description`: キャラクター説明
  - `prompt`: AIへの指示（性格、セリフなど）
  - `icon`: キャラクターアイコン画像

- **ClassEntry**: 時間割の授業エントリー
  - `user`: 所有者（外部キー）
  - `day`: 曜日（選択肢）
  - `period`: 時限（選択肢）
  - `subject_name`: 科目名
  - `room`: 教室
  - `teacher`: 教員名
  - `note`: メモ

### 3.2 リレーションシップ

- User → Task: 1対多
- User → Diary: 1対多
- User → SleepSchedule: 1対多
- User → ClassEntry: 1対多
- Diary ↔ Task: 多対多（DiaryTaskを介して）

## 4. API設計

### 4.1 認証API

- **POST /api/register/**: ユーザー登録
  - リクエスト: `{ username, password }`
  - レスポンス: `{ id, username }`

- **POST /api/token/**: JWTトークン取得
  - リクエスト: `{ username, password }`
  - レスポンス: `{ access, refresh }`

- **POST /api/token/refresh/**: JWTトークン更新
  - リクエスト: `{ refresh }`
  - レスポンス: `{ access }`

### 4.2 ユーザープロフィールAPI

- **GET /user-profile/**: ユーザープロフィール取得
  - レスポンス: `{ id, username, profile_image }`

- **POST /upload-profile-image/**: プロフィール画像アップロード
  - リクエスト: `FormData (image)`
  - レスポンス: `{ profile_image }`

### 4.3 タスク管理API

- **GET /tasks/**: タスク一覧取得
- **POST /tasks/**: タスク作成
- **GET /tasks/{id}/**: 特定タスク取得
- **PUT /tasks/{id}/**: タスク更新
- **DELETE /tasks/{id}/**: タスク削除
- **GET /today-tasks/**: 今日のタスク取得
- **GET /future-tasks/**: 今後のタスク取得
- **GET /daily-tasks/**: デイリータスク取得

### 4.4 日記API

- **GET /diaries/**: 日記一覧取得
- **POST /diaries/**: 日記作成
- **GET /diaries/{id}/**: 特定日記取得
- **PUT /diaries/{id}/**: 日記更新
- **DELETE /diaries/{id}/**: 日記削除

### 4.5 睡眠管理API

- **GET /api/sleep-master/schedules/**: スケジュール一覧取得
- **POST /api/sleep-master/schedules/**: スケジュール作成
- **GET /api/sleep-master/schedules/{id}/**: 特定スケジュール取得
- **PUT /api/sleep-master/schedules/{id}/**: スケジュール更新
- **DELETE /api/sleep-master/schedules/{id}/**: スケジュール削除
- **GET /api/sleep-master/schedules/latest/**: 最新スケジュール取得
- **POST /api/sleep-master/gemini/message/**: Gemini APIメッセージ送信
  - リクエスト: `{ content, character }`
  - レスポンス: `{ reply }`
- **GET /api/sleep-master/characters/**: キャラクター一覧取得

### 4.6 時間割API

- **GET /api/timetable/classes/**: 授業一覧取得
- **POST /api/timetable/classes/**: 授業作成
- **GET /api/timetable/classes/{id}/**: 特定授業取得
- **PUT /api/timetable/classes/{id}/**: 授業更新
- **DELETE /api/timetable/classes/{id}/**: 授業削除
- **GET /api/timetable/classes/by_day/**: 曜日別授業取得

## 5. フロントエンド実装詳細

### 5.1 コンポーネント構造

- **共通コンポーネント**:
  - `MyNavbar`: ナビゲーションバー
  - `LandingPage`: ランディングページ
  - `Login`: ログインフォーム
  - `Register`: 登録フォーム
  - `Dashboard`: ダッシュボード
  - `ProfileAvatar`: プロフィール画像表示

- **機能別コンポーネント**:
  - `features/timetable/`: 時間割機能
    - `TimetablePage`: メインページ
    - `ClassEntry`: 授業エントリー表示
    - `ClassForm`: 授業フォーム
    - `Modal`: モーダルダイアログ
  - `features/sleepMaster/`: 睡眠管理機能
    - `SleepMasterPage`: メインページ
    - `TimeInput`: 時間入力コンポーネント
  - その他の機能（日記、タスク管理など）

### 5.2 状態管理

- **グローバル状態**:
  - `UserContext`: ユーザー情報（ログイン状態、プロフィールなど）

- **ローカル状態**:
  - 各機能コンポーネント内でのReact Hooks（useState, useEffect）による状態管理
  - フォーム状態、ローディング状態、エラー状態など

### 5.3 API通信

- **apiClient.js**: Axiosインスタンスの設定
  - ベースURL設定
  - リクエストインターセプター（トークン付与）
  - レスポンスインターセプター（エラーハンドリング）

- **機能別API関数**:
  - 各機能ディレクトリ内のapi.jsファイルに定義
  - CRUD操作に対応する関数群

### 5.4 ルーティング

- **公開ルート**: 認証不要でアクセス可能
  - ランディングページ
  - ログイン/登録ページ

- **保護ルート**: 認証が必要
  - ダッシュボード
  - 各機能ページ（日記、タスク、時間割、睡眠管理など）

## 6. バックエンド実装詳細

### 6.1 Django設定

- **settings.py**: プロジェクト設定
  - インストールされたアプリ
  - ミドルウェア設定
  - データベース設定
  - 認証設定
  - REST Framework設定
  - JWT設定
  - メディアファイル設定

### 6.2 モデル実装

- **モデル定義**: 各アプリケーション内のmodels.pyに定義
  - フィールド定義
  - リレーションシップ
  - メタデータ（順序付け、ユニーク制約など）
  - カスタムメソッド

- **カスタムロジック**:
  - Character.save(): アイコン画像の自動リサイズと正方形クロップ処理

### 6.3 ビュー実装

- **APIビュー**: 各アプリケーション内のviews.pyに定義
  - ViewSets: CRUD操作の自動生成
  - APIView: カスタムエンドポイント
  - 認証と権限チェック
  - カスタムアクション

- **特殊ビュー**:
  - GeminiMessageView: Google Gemini APIとの連携
  - LatestSleepScheduleView: 最新スケジュール取得

### 6.4 シリアライザー実装

- **モデルシリアライザー**: 各アプリケーション内のserializers.pyに定義
  - モデルフィールドのマッピング
  - バリデーションロジック
  - ネストされたシリアライザー

### 6.5 URL設定

- **URLパターン**: 各アプリケーション内のurls.pyに定義
  - エンドポイントのマッピング
  - ViewSetルーターの使用
  - ネストされたURLパターン

## 7. 外部API連携

### 7.1 Google Gemini API

- **設定**: API_KEYを環境変数から取得
- **モデル**: gemini-1.5-flash
- **プロンプト生成**: ユーザー名、キャラクター設定、睡眠スケジュール情報を含む
- **エラーハンドリング**: 各種APIエラーに対する適切な処理

### 7.2 メディアファイル処理

- **画像アップロード**: プロフィール画像、キャラクターアイコン
- **画像処理**: PILライブラリを使用した自動リサイズと正方形クロップ
- **メディアURL**: 開発環境でのメディアファイル提供

## 8. セキュリティ実装

### 8.1 認証セキュリティ

- **パスワード管理**: Djangoの標準ハッシュ化機能
- **JWT認証**: アクセストークンとリフレッシュトークンの分離
- **トークン有効期限**: アクセストークン30分、リフレッシュトークン1日

### 8.2 アクセス制御

- **認証チェック**: IsAuthenticated権限クラス
- **オブジェクトレベル権限**: ユーザー固有のデータへのアクセス制限
- **CSRF保護**: Django標準のCSRF保護

### 8.3 API保護

- **CORS設定**: 開発環境ではすべてのオリジンを許可
- **エラーハンドリング**: 適切なHTTPステータスコードとエラーメッセージ

## 9. 開発環境

### 9.1 ローカル開発環境

- **バックエンド**: Django開発サーバー（ポート8000）
- **フロントエンド**: React開発サーバー（ポート3000）
- **データベース**: MySQL
- **環境変数**:
  - GEMINI_API_KEY: Google Gemini APIキー
  - REACT_APP_API_BASE_URL: APIベースURL

### 9.2 開発ツール

- **パッケージ管理**:
  - バックエンド: pip
  - フロントエンド: npm
- **ビルドツール**: React Scripts 5.0.1
- **開発サーバー**:
  - バックエンド: Django runserver
  - フロントエンド: React start

## 10. 将来の拡張性

### 10.1 スケーラビリティ

- **データベース**: 本番環境ではより堅牢なデータベース設定が可能
- **静的ファイル**: 本番環境ではCDNやS3などの外部ストレージの利用が可能
- **APIキャッシュ**: パフォーマンス向上のためのキャッシュ導入が可能

### 10.2 機能拡張

- **健康管理機能**: 既存の睡眠管理機能の拡張
- **ソーシャル機能**: 友人との共有機能
- **モバイルアプリ**: React Nativeを使用したモバイルアプリ開発
- **データ分析**: ユーザーデータの可視化と分析機能

### 10.3 技術的改善

- **テスト導入**: 単体テスト、統合テスト、E2Eテスト
- **CI/CD**: 継続的インテグレーション/デリバリーパイプライン
- **コンテナ化**: Docker/Kubernetesによるコンテナ化
- **マイクロサービス化**: 機能ごとのマイクロサービス分割
