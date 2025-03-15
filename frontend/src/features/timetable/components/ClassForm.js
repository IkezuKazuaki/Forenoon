// src/features/timetable/components/ClassForm.js

import React, { useState, useEffect } from 'react';

const ClassForm = ({ classData, onSubmit, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    day: 'MON',
    period: 1,
    subject_name: '',
    room: '',
    teacher: '',
    note: '',
  });

  // 編集モードの場合、既存のデータをフォームに設定
  useEffect(() => {
    if (classData) {
      setFormData({
        day: classData.day,
        period: classData.period,
        subject_name: classData.subject_name,
        room: classData.room || '',
        teacher: classData.teacher || '',
        note: classData.note || '',
      });
    }
  }, [classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="day">曜日</label>
        <select
          id="day"
          name="day"
          className="form-control"
          value={formData.day}
          onChange={handleChange}
          required
        >
          <option value="MON">月曜日</option>
          <option value="TUE">火曜日</option>
          <option value="WED">水曜日</option>
          <option value="THU">木曜日</option>
          <option value="FRI">金曜日</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="period">時限</label>
        <select
          id="period"
          name="period"
          className="form-control"
          value={formData.period}
          onChange={handleChange}
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

      <div className="form-group">
        <label htmlFor="subject_name">科目名</label>
        <input
          type="text"
          id="subject_name"
          name="subject_name"
          className="form-control"
          value={formData.subject_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="room">教室</label>
        <input
          type="text"
          id="room"
          name="room"
          className="form-control"
          value={formData.room}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="teacher">担当教員</label>
        <input
          type="text"
          id="teacher"
          name="teacher"
          className="form-control"
          value={formData.teacher}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="note">メモ</label>
        <textarea
          id="note"
          name="note"
          className="form-control"
          value={formData.note}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          キャンセル
        </button>
        
        <div>
          {classData && (
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={() => onDelete(classData.id)}
            >
              削除
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {classData ? '更新' : '登録'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClassForm;
