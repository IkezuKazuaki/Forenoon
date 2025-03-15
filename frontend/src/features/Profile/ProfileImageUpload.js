// ProfileImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfileImageUpload = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profile_image', image);

    try {
      const response = await axios.post('/api/upload-profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log('プロフィール画像がアップロードされました:', response.data);
      
      // アップロード成功時のコールバックを実行
      if (onUploadSuccess) onUploadSuccess(response.data.profile_image);

    } catch (error) {
      console.error('プロフィール画像のアップロードに失敗しました', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>アップロード</button>
    </div>
  );
};

export default ProfileImageUpload;
