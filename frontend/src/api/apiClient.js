// src/api/apiClient.js

import axios from 'axios';
import { API_BASE_URL } from '../config';

// Axiosインスタンスの作成
const apiClient = axios.create({
  baseURL: API_BASE_URL, // ベースURLを設定（個別APIで拡張可能）
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWTトークンを自動でヘッダーに追加するリクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプターでエラーハンドリングを追加
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("401 Unauthorized: Redirecting to login");
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; // ログイン画面へリダイレクト
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
