// src/features/timetable/api.js

import apiClient from '../../api/apiClient';

// 時間割関連のAPI関数

// 全ての授業エントリーを取得
export const fetchAllClasses = () => {
  return apiClient.get('/api/timetable/classes/');
};

// 曜日ごとにグループ化された授業エントリーを取得
export const fetchClassesByDay = () => {
  return apiClient.get('/api/timetable/classes/by_day/');
};

// 特定の授業エントリーを取得
export const fetchClass = (classId) => {
  return apiClient.get(`/api/timetable/classes/${classId}/`);
};

// 新しい授業エントリーを作成
export const createClass = (classData) => {
  return apiClient.post('/api/timetable/classes/', classData);
};

// 複数の授業エントリーを一括作成
export const createMultipleClasses = (classesData) => {
  // 各授業データを個別にPOSTリクエストで作成
  const requests = classesData.map(classData => createClass(classData));
  return Promise.all(requests);
};

// 既存の授業エントリーを更新
export const updateClass = (classId, classData) => {
  return apiClient.put(`/api/timetable/classes/${classId}/`, classData);
};

// 授業エントリーを削除
export const deleteClass = (classId) => {
  return apiClient.delete(`/api/timetable/classes/${classId}/`);
};

// 時間割画像から授業情報を抽出
export const extractClassesFromImage = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // Content-Typeヘッダーを自動設定するためにカスタムヘッダーを削除
  return apiClient.post('/api/timetable/classes/from-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
