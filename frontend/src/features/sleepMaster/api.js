// src/features/sleepMaster/api.js

import apiClient from '../../api/apiClient';

// SleepMaster関連API
export const fetchSchedules = () => {
  return apiClient.get('/api/sleep-master/schedules/');
};

export const fetchLatestSchedule = () => {
  return apiClient.get('/api/sleep-master/schedules/latest/');
};

export const createSchedule = (schedule) => {
  return apiClient.post('/api/sleep-master/schedules/', schedule);
};

export const updateSchedule = (scheduleId, updatedSchedule) => {
  return apiClient.put(`/api/sleep-master/schedules/${scheduleId}/`, updatedSchedule);
};

export const deleteSchedule = (scheduleId) => {
  return apiClient.delete(`/api/sleep-master/schedules/${scheduleId}/`);
};

// GeminiメッセージAPI
export const sendMessageToGemini = (message, character, currentTime, wakeUpTime, sleepTime) => {
  // 送信するペイロードを作成
  const payload = {
    character: character.id, // キャラクターのID
    content: message,        // ユーザーが入力したメッセージ
  };

  console.log("送信データ:", payload);

  // バックエンドに送信
  return apiClient.post('/api/sleep-master/gemini/message/', payload);
};

export const fetchCharacters = () => {
  return apiClient.get('/api/sleep-master/characters/');
};
