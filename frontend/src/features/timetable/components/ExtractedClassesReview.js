// src/features/timetable/components/ExtractedClassesReview.js

import React, { useState } from 'react';

const ExtractedClassesReview = ({ classes, onSave, onCancel }) => {
  const [editedClasses, setEditedClasses] = useState(classes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 曜日の表示名マッピング
  const dayDisplayMap = {
    MON: '月曜日',
    TUE: '火曜日',
    WED: '水曜日',
    THU: '木曜日',
    FRI: '金曜日',
  };

  // 授業情報の更新処理
  const handleClassChange = (index, field, value) => {
    const updatedClasses = [...editedClasses];
    updatedClasses[index] = {
      ...updatedClasses[index],
      [field]: value,
    };
    setEditedClasses(updatedClasses);
  };

  // 授業の削除処理
  const handleRemoveClass = (index) => {
    const updatedClasses = [...editedClasses];
    updatedClasses.splice(index, 1);
    setEditedClasses(updatedClasses);
  };

  // 保存処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(editedClasses);
    } catch (error) {
      console.error('授業情報の保存に失敗しました', error);
      alert('授業情報の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="extracted-classes-review">
      <h3>抽出された授業情報</h3>
      <p className="text-muted mb-4">
        以下の授業情報を確認・編集してから保存してください。
      </p>

      {editedClasses.length === 0 ? (
        <div className="alert alert-info">
          授業情報が抽出されませんでした。別の画像を試すか、手動で授業を追加してください。
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {editedClasses.map((classItem, index) => (
            <div key={index} className="class-item-card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {dayDisplayMap[classItem.day] || '曜日不明'} {classItem.period}限
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveClass(index)}
                >
                  削除
                </button>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor={`day-${index}`} className="form-label">曜日</label>
                    <select
                      id={`day-${index}`}
                      className="form-select"
                      value={classItem.day}
                      onChange={(e) => handleClassChange(index, 'day', e.target.value)}
                      required
                    >
                      <option value="MON">月曜日</option>
                      <option value="TUE">火曜日</option>
                      <option value="WED">水曜日</option>
                      <option value="THU">木曜日</option>
                      <option value="FRI">金曜日</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`period-${index}`} className="form-label">時限</label>
                    <select
                      id={`period-${index}`}
                      className="form-select"
                      value={classItem.period}
                      onChange={(e) => handleClassChange(index, 'period', parseInt(e.target.value))}
                      required
                    >
                      <option value={1}>1限</option>
                      <option value={2}>2限</option>
                      <option value={3}>3限</option>
                      <option value={4}>4限</option>
                      <option value={5}>5限</option>
                      <option value={6}>6限</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor={`subject-${index}`} className="form-label">科目名</label>
                  <input
                    type="text"
                    id={`subject-${index}`}
                    className="form-control"
                    value={classItem.subject_name}
                    onChange={(e) => handleClassChange(index, 'subject_name', e.target.value)}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor={`room-${index}`} className="form-label">教室</label>
                    <input
                      type="text"
                      id={`room-${index}`}
                      className="form-control"
                      value={classItem.room || ''}
                      onChange={(e) => handleClassChange(index, 'room', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor={`teacher-${index}`} className="form-label">教員</label>
                    <input
                      type="text"
                      id={`teacher-${index}`}
                      className="form-control"
                      value={classItem.teacher || ''}
                      onChange={(e) => handleClassChange(index, 'teacher', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor={`note-${index}`} className="form-label">メモ</label>
                  <textarea
                    id={`note-${index}`}
                    className="form-control"
                    value={classItem.note || ''}
                    onChange={(e) => handleClassChange(index, 'note', e.target.value)}
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  保存中...
                </>
              ) : (
                '時間割に保存'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExtractedClassesReview;
