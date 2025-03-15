// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className={styles.landingContainer}>
      <nav className={styles.landingNavbar}>
        <div className={styles.logo}>Ikezu App</div>
        <div className={styles.navLinks}>
        <Link
            to="/login"
            className={`${styles.customButtonOutline}`}
            aria-label="ログインページに移動"
            >
            <i className="bi bi-box-arrow-in-right"></i> ログイン
            </Link>
            <Link
            to="/register"
            className={`${styles.customButton}`}
            aria-label="登録ページに移動"
            >
            <i className="bi bi-person-plus"></i> 登録
            </Link>
        </div>
      </nav>
      <header className={styles.landingHeader}>
        <h1>あなたの日常を、よりスマートに</h1>
        <p>
          タスク管理、日記、そしてGeminiによる起床時間管理を組み合わせたオールインワンアプリ。
        </p>
        <Link
          to="/register"
          className={`${styles.ctaButton} btn btn-primary btn-lg`}
        >
          今すぐ始める
        </Link>
      </header>
      <section className={styles.featuresSection}>
        <div className={styles.feature}>
          <i className="bi bi-check-circle"></i>
          <h2>タスク管理</h2>
          <p>シンプルで直感的なタスク管理機能で、生産性を向上。</p>
        </div>
        <div className={styles.feature}>
          <i className="bi bi-journal"></i>
          <h2>日記</h2>
          <p>毎日の出来事やアイデアを記録し、自分だけの思い出を残しましょう。</p>
        </div>
        <div className={styles.feature}>
          <i className="bi bi-alarm"></i>
          <h2>Geminiによる起床管理</h2>
          <p>AIアシスタントGeminiがあなたの睡眠をサポートします。</p>
        </div>
      </section>
      <footer className={styles.landingFooter}>
        <p>&copy; 2023 Ikezu. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
