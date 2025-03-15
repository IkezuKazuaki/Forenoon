// src/components/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { login } from '../features/diary/api'; // api.jsからlogin関数をインポート
import { UserContext } from '../contexts/UserContext'; // UserContextをインポート
import styles from './Form.module.css'; // 共通のCSSモジュールをインポート

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchProfile } = useContext(UserContext); // UserContextからfetchProfileを取得

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('registered') === 'true') {
      setSuccessMessage('アカウントが作成されました。ログインしてください。');
      query.delete('registered');
      const newSearch = query.toString();
      const newLocation = {
        ...location,
        search: newSearch ? `?${newSearch}` : '',
      };
      window.history.replaceState(null, '', newLocation.pathname + newLocation.search);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      onLogin(token); // トークンを保存し、認証状態を更新
      await fetchProfile(); // ユーザー情報を更新
      navigate('/'); // ホーム画面に遷移
    } catch (err) {
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <h2 className={styles.title}>ログイン</h2>
          {successMessage && (
            <div className={styles.alertSuccess}>{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="username">ユーザー名</label>
              <input
                id="username"
                type="text"
                className={styles.formInput}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">パスワード</label>
              <input
                id="password"
                type="password"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className={styles.alertError}>{error}</div>}
            <button type="submit" className={styles.submitButton}>ログイン</button>
          </form>
          <div className={styles.linkContainer}>
            <p className={styles.linkText}>アカウントをお持ちでないですか？</p>
            <Link to="/register" className={styles.link}>
              <strong>新規登録はこちら</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
