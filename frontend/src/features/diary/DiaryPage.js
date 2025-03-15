// src/features/diary/DiaryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import DiaryForm from './components/DiaryForm/DiaryForm';
import { fetchAllDiaries } from './api';
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaRegStickyNote } from 'react-icons/fa'; // アイコンをインポート
import './DiaryPage.css'; // カスタムスタイルをインポート

// 日付をYYYY-MM-DD形式にフォーマットする関数をコンポーネント外に移動
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // 月は0から始まるため+1
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const DiaryPage = () => {
  // 未使用のselectedDateとsetSelectedDateを削除
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState([]);
  const [loadingDiaries, setLoadingDiaries] = useState(false);
  const [errorDiaries, setErrorDiaries] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 日記の一覧を取得する関数を useCallback でメモ化
  const fetchDiaries = useCallback(async () => {
    setLoadingDiaries(true);
    setErrorDiaries(null);
    try {
      const response = await fetchAllDiaries();
      // 日記を日付順（新しい順）にソート
      const sortedDiaries = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDiaries(sortedDiaries);
    } catch (error) {
      console.error('日記の取得に失敗しました:', error);
      setErrorDiaries('日記の取得中にエラーが発生しました。');
    } finally {
      setLoadingDiaries(false);
    }
  }, []);

  // 初回マウント時に日記の一覧を取得
  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  // 日記が作成・更新された後に日記の一覧を再取得
  const handleDiaryUpdated = () => {
    fetchDiaries();
  };

  // ダークモードの切り替え
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className="container my-5">
      {/* ダークモードトグルボタン */}
      <button className="dark-mode-toggle btn btn-secondary mb-4" onClick={toggleDarkMode}>
        {isDarkMode ? 'ライトモード' : 'ダークモード'}
      </button>

      <h1 className="text-center mb-4 display-4">予定と記録</h1>
      <div className="row mb-5">
        <div className="col-md-8 mx-auto">
          {/* DiaryFormのみを表示 */}
          <DiaryForm onDiaryCreated={handleDiaryUpdated} />
        </div>
      </div>
      <hr className="my-4" />
      <div className="row">
        <div className="col-md-8 mx-auto">
          {loadingDiaries ? (
            <p className="text-center">読み込み中...</p>
          ) : errorDiaries ? (
            <div className="alert alert-danger" role="alert">
              {errorDiaries}
            </div>
          ) : diaries.length > 0 ? (
            <VerticalTimeline>
              {diaries.map((diary) => (
                <VerticalTimelineElement
                  position="right"
                  key={diary.id}
                  date={formatDate(new Date(diary.date))}
                  iconStyle={{ background: '#00aaff', color: '#fff' }} // メインカラーに変更
                  icon={<FaRegStickyNote />}
                  contentStyle={{ background: '#e6f7ff', color: '#333' }} // 背景色とテキストカラーに変更
                  contentArrowStyle={{ borderRight: '7px solid  #e6f7ff' }} // 背景色に変更
                  className="diary-timeline-element"
                >
                  <h4 className="vertical-timeline-element-title">日記</h4>
                  <p>{diary.content}</p>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          ) : (
            <p className="text-center">まだ日記がありません。上のフォームから日記を作成してください。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
