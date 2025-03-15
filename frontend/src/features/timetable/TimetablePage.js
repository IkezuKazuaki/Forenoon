// src/features/timetable/TimetablePage.js

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { 
  fetchAllClasses, 
  createClass, 
  updateClass, 
  deleteClass, 
  createMultipleClasses 
} from './api';
import ClassEntry from './components/ClassEntry';
import ClassForm from './components/ClassForm';
import Modal from './components/Modal';
import TimetableImageUpload from './components/TimetableImageUpload';
import ExtractedClassesReview from './components/ExtractedClassesReview';
import './timetable.css';

const TimetablePage = () => {
  const { user } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  
  // 画像アップロード関連の状態
  const [extractedClasses, setExtractedClasses] = useState(null);
  const [showExtractedReview, setShowExtractedReview] = useState(false);

  // 曜日と時限の定義
  const days = [
    { code: 'MON', name: '月曜日' },
    { code: 'TUE', name: '火曜日' },
    { code: 'WED', name: '水曜日' },
    { code: 'THU', name: '木曜日' },
    { code: 'FRI', name: '金曜日' },
  ];
  
  const periods = [1, 2, 3, 4, 5, 6];

  // 授業データの取得
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchAllClasses();
        setClasses(response.data);
        setError(null);
      } catch (err) {
        console.error('授業データの取得に失敗しました', err);
        setError('授業データの取得に失敗しました。再読み込みしてください。');
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  // 特定の曜日と時限の授業を取得
  const getClassForDayAndPeriod = (day, period) => {
    return classes.find(
      (classItem) => classItem.day === day && classItem.period === period
    );
  };

  // 授業をクリックした時の処理
  const handleClassClick = (classData) => {
    setSelectedClass(classData);
    setModalOpen(true);
  };

  // 空のセルをクリックした時の処理
  const handleEmptyCellClick = (day, period) => {
    setSelectedClass(null);
    setSelectedCell({ day, period });
    setModalOpen(true);
  };

  // フォーム送信時の処理
  const handleFormSubmit = async (formData) => {
    try {
      let response;
      
      if (selectedClass) {
        // 既存の授業を更新
        response = await updateClass(selectedClass.id, formData);
        
        // 更新後のデータで状態を更新
        setClasses(
          classes.map((classItem) =>
            classItem.id === selectedClass.id ? response.data : classItem
          )
        );
      } else {
        // 新しい授業を作成
        response = await createClass(formData);
        
        // 新しい授業を追加
        setClasses([...classes, response.data]);
      }
      
      // モーダルを閉じる
      setModalOpen(false);
      setSelectedClass(null);
      setSelectedCell(null);
    } catch (err) {
      console.error('授業の保存に失敗しました', err);
      alert('授業の保存に失敗しました。もう一度お試しください。');
    }
  };

  // 授業削除時の処理
  const handleDeleteClass = async (classId) => {
    if (window.confirm('この授業を削除してもよろしいですか？')) {
      try {
        await deleteClass(classId);
        
        // 削除した授業を状態から除外
        setClasses(classes.filter((classItem) => classItem.id !== classId));
        
        // モーダルを閉じる
        setModalOpen(false);
        setSelectedClass(null);
      } catch (err) {
        console.error('授業の削除に失敗しました', err);
        alert('授業の削除に失敗しました。もう一度お試しください。');
      }
    }
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setSelectedCell(null);
  };
  
  // 画像から抽出された授業情報を処理
  const handleClassesExtracted = (extractedClassesData) => {
    setExtractedClasses(extractedClassesData);
    setShowExtractedReview(true);
  };
  
  // 抽出された授業情報を保存
  const handleSaveExtractedClasses = async (classesData) => {
    try {
      // 既存の授業と重複する可能性があるため、曜日と時限の組み合わせをチェック
      const existingDayPeriodPairs = classes.map(c => `${c.day}-${c.period}`);
      const newClasses = classesData.filter(c => !existingDayPeriodPairs.includes(`${c.day}-${c.period}`));
      
      if (newClasses.length === 0) {
        alert('追加できる授業がありません。既に同じ曜日・時限の授業が登録されています。');
        setShowExtractedReview(false);
        setExtractedClasses(null);
        return;
      }
      
      // 複数の授業を一括登録
      const responses = await createMultipleClasses(newClasses);
      
      // 新しい授業を状態に追加
      const newClassEntries = responses.map(response => response.data);
      setClasses([...classes, ...newClassEntries]);
      
      // レビュー画面を閉じる
      setShowExtractedReview(false);
      setExtractedClasses(null);
      
      // 成功メッセージ
      alert(`${newClasses.length}件の授業を時間割に追加しました。`);
    } catch (err) {
      console.error('授業の一括保存に失敗しました', err);
      alert('授業の保存に失敗しました。もう一度お試しください。');
    }
  };
  
  // 抽出された授業情報のレビューをキャンセル
  const handleCancelExtractedReview = () => {
    setShowExtractedReview(false);
    setExtractedClasses(null);
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className="timetable-container">
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">授業データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="timetable-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h1>時間割</h1>
        <p>月曜日から金曜日までの授業スケジュールを管理できます。</p>
      </div>
      
      {/* 時間割画像アップロードセクション */}
      <div className="image-upload-section mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="mb-0">時間割画像から授業を登録</h3>
          </div>
          <div className="card-body">
            <TimetableImageUpload onClassesExtracted={handleClassesExtracted} />
          </div>
        </div>
      </div>

      <div className="timetable-grid">
        {/* 左上の空白セル */}
        <div className="timetable-cell header"></div>
        
        {/* 曜日ヘッダー */}
        {days.map((day) => (
          <div key={day.code} className="timetable-cell header">
            {day.name}
          </div>
        ))}

        {/* 時限と授業のグリッド */}
        {periods.map((period) => (
          <React.Fragment key={period}>
            {/* 時限セル */}
            <div className="timetable-cell period">{period}限</div>
            
            {/* 各曜日の授業セル */}
            {days.map((day) => {
              const classData = getClassForDayAndPeriod(day.code, period);
              return (
                <div
                  key={`${day.code}-${period}`}
                  className="timetable-cell"
                  onClick={() =>
                    classData
                      ? handleClassClick(classData)
                      : handleEmptyCellClick(day.code, period)
                  }
                >
                  {classData ? (
                    <ClassEntry classData={classData} onClick={handleClassClick} />
                  ) : (
                    <div className="add-button">+</div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* 授業フォームモーダル */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedClass ? '授業を編集' : '新しい授業を追加'}
      >
        <ClassForm
          classData={selectedClass}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          onDelete={handleDeleteClass}
        />
      </Modal>
      
      {/* 抽出された授業情報レビューモーダル */}
      <Modal
        isOpen={showExtractedReview}
        onClose={handleCancelExtractedReview}
        title="時間割画像から抽出された授業"
      >
        {extractedClasses && (
          <ExtractedClassesReview
            classes={extractedClasses}
            onSave={handleSaveExtractedClasses}
            onCancel={handleCancelExtractedReview}
          />
        )}
      </Modal>
    </div>
  );
};

export default TimetablePage;
