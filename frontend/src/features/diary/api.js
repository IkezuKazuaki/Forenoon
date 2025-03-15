// src/features/diary/api.js
import apiClient from '../../api/apiClient';

// タスク関連API
export const fetchTodayTasks = (date) => {
  console.log("fetchTodayTasks called with date:", date);
  return apiClient.get(`/today-tasks/?date=${date}`);
};

export const fetchFutureTasks = (date) => {
  console.log("fetchTomorrowTasks called with date:", date);
  return apiClient.get(`/future-tasks/?date=${date}`);
};

export const fetchDailyTasks = () => {
  console.log("fetchDailyTasks called");
  return apiClient.get(`/daily-tasks/`);
};

export const addTodayTask = (task) => {
  console.log("addTodayTask called with task:", task);
  return apiClient.post('/today-tasks/', task);
};

export const addTomorrowTask = (task) => {
  console.log("addTomorrowTask called with task:", task);
  return apiClient.post('/tomorrow-tasks/', task);
};

export const editTask = (taskId, updatedTask) => {
  console.log("editTask called with taskId:", taskId, "and updatedTask:", updatedTask);
  return apiClient.put(`/tasks/${taskId}/`, updatedTask);
};

export const deleteTask = (taskId) => {
  console.log("deleteTask called with taskId:", taskId);
  return apiClient.delete(`/tasks/${taskId}/`);
};

export const addTask = (taskType, task) => {
  console.log("addTask called with taskType:", taskType, "and task:", task);
  const endpoint = '/today-tasks/';
  return apiClient.post(endpoint, task);
};


// 日記関連API
export const fetchDiary = (date) => apiClient.get(`/diaries/?date=${date}`);
export const fetchAllDiaries = () => apiClient.get('/diaries/');  // これを追加して、日記の一覧を取得
export const createDiary = (diaryData) => {
    return apiClient.post('/diaries/', diaryData);
};  
export const updateDiary = (diaryId, diaryData) => apiClient.put(`/diaries/${diaryId}/`, diaryData);

// プロフィール画像のアップロード
export const uploadProfileImage = (imageFile) => {
  console.log("imageFile", imageFile);
  const formData = new FormData();
  formData.append('profile_image', imageFile);
  console.log("formData", formData);
  return apiClient.post('/upload-profile-image/', formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
};



// ユーザープロフィールの取得
export const fetchUserProfile = () => {
  return apiClient.get('/user-profile/');
};
// 認証関連API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/token/', {
      username,
      password,
    });
    const { access } = response.data;
    return access;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await apiClient.post('/api/register/', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
};