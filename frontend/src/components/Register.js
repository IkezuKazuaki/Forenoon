// src/components/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../features/diary/api'; 
import styles from './Form.module.css'; // 共通のCSSモジュールをインポート

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setErrors('パスワードが一致しません。');
      return;
    }
    try {
      await registerUser(username, password);
      // 登録成功後、ログインページにリダイレクト
      window.location.href = '/login?registered=true';
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setErrors(errorMessages);
      } else {
        setErrors('登録に失敗しました。');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <h2 className={styles.title}>新規登録</h2>
          {errors && <div className={styles.alertError}>{errors}</div>}
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
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="passwordConfirm">パスワード（確認）</label>
              <input
                id="passwordConfirm"
                type="password"
                className={styles.formInput}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>登録</button>
          </form>
          <div className={styles.linkContainer}>
            <p className={styles.linkText}>既にアカウントをお持ちですか？</p>
            <Link to="/login" className={styles.link}>
              <strong>ログインはこちら</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
