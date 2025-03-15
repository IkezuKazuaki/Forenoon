from datetime import datetime
import pytz

# 日本時間のタイムゾーン設定
jst = pytz.timezone('Asia/Tokyo')


def generate_prompt(username, character_name, wake_up_time, sleep_time, content):
    """
    プロンプト生成関数
    """
    current_time = datetime.now(jst).strftime('%H:%M')

    prompt = (
        f"ユーザーの名前: {username} \n"
        f"あなたのキャラ設定: {character_name}\n"
        f"ユーザーの目標起床時刻: {wake_up_time}\n"
        f"ユーザーの目標就寝時刻: {sleep_time}\n"
        f"ユーザーの現在時刻: {current_time}\n"
        f"ユーザーが送信したメッセージ: {content}"
    )
    print("pompt", prompt)
    return prompt
