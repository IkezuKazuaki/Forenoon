// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import MyNavbar from './components/MyNavbar';
import UserProfile from './features/Profile/UserProfile';
import DiaryPage from './features/diary/DiaryPage';
import Dashboard from './components/Dashboard';
import SleepMaster from './features/sleepMaster/SleepMasterPage';
import LandingPage from './components/LandingPage';

// ★ 追加：Tategramのメインコンポーネントをインポート
import TategramApp from './features/tategram/TategramApp';
// 時間割ページをインポート
import TimetablePage from './features/timetable/TimetablePage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('access_token') !== null
  );

  const handleLogin = (token) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <UserProvider>
      <Router>
        {/* ログインしている場合のみナビバーを表示 */}
        {isAuthenticated && <MyNavbar onLogout={handleLogout} />}

        <Routes>
          {/* ログインページ */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route path="/register" element={<Register />} />

          {/* プロフィールページ */}
          <Route
            path="/profile"
            element={isAuthenticated ? <UserProfile /> : <LandingPage />}
          />

          {/* ダッシュボードページ */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <LandingPage />}
          />

          {/* 日記ページ */}
          <Route
            path="/diary"
            element={isAuthenticated ? <DiaryPage /> : <LandingPage />}
          />

          {/* SleepMasterページ */}
          <Route
            path="/sleep-master"
            element={isAuthenticated ? <SleepMaster /> : <LandingPage />}
          />

          {/* ★ 追加：Tategramページ */}
          <Route
            path="/tategram"
            element={isAuthenticated ? <TategramApp /> : <LandingPage />}
          />

          {/* 時間割ページ */}
          <Route
            path="/timetable"
            element={isAuthenticated ? <TimetablePage /> : <LandingPage />}
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
