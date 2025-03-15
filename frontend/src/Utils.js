// 日本時間の今日の日付を取得（UTCに9時間足す）
const now = new Date();
const today = new Date(now.getTime() + 9 * 60 * 60 * 1000);  // UTCに9時間加算
export const todayFormatted = today.toISOString().split('T')[0];  // YYYY-MM-DD形式に変換

// 明日の日付を取得
const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);  // 今日に1日加算
export const tomorrowFormatted = tomorrow.toISOString().split('T')[0];  // YYYY-MM-DD形式に変換
