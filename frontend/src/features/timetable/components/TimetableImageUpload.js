// src/features/timetable/components/TimetableImageUpload.js

import React, { useState } from 'react';
import { extractClassesFromImage } from '../api';

const TimetableImageUpload = ({ onClassesExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // ファイル選択時の処理
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  // アップロード処理
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('ファイルを選択してください');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // 画像をアップロードして授業情報を抽出
      const response = await extractClassesFromImage(selectedFile);
      
      // 抽出された授業情報を親コンポーネントに渡す
      onClassesExtracted(response.data);
      
      // ファイル選択をリセット
      setSelectedFile(null);
    } catch (err) {
      console.error('時間割画像の解析に失敗しました', err);
      setError(
        err.response?.data?.error || 
        '時間割画像の解析に失敗しました。別の画像を試すか、手動で授業を追加してください。'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="timetable-image-upload">
      <div className="upload-container">
        <input
          type="file"
          id="timetable-image"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          disabled={isUploading}
        />
        <label htmlFor="timetable-image" className="file-label">
          {selectedFile ? selectedFile.name : '時間割画像を選択'}
        </label>
        
        <button
          className="btn btn-primary upload-button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              解析中...
            </>
          ) : (
            '時間割を解析'
          )}
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
      
      <div className="upload-info mt-3">
        <p>
          <i className="bi bi-info-circle me-2"></i>
          時間割表の画像をアップロードすると、AIが自動的に授業情報を抽出します。
          抽出後、内容を確認・編集してから保存できます。
        </p>
      </div>
    </div>
  );
};

export default TimetableImageUpload;
