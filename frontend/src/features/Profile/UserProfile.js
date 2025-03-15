import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, Button } from '@mui/material';
import { fetchUserProfile, uploadProfileImage } from '../diary/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchUserProfile();
        console.log('User profile fetched:', response.data); // プロフィール取得確認
        setUser(response.data);
      } catch (error) {
        console.error('プロフィール情報の取得に失敗しました', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // ファイルが選択されたか確認
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('画像を選択してください');
      return;
    }
    try {
      const response = await uploadProfileImage(image);
      console.log('アップロード成功', response.data);
      // プロフィール画像を更新する
      setUser(prevUser => ({
        ...prevUser,
        profile_image: response.data.profile_image,
      }));
      alert('プロフィール画像が更新されました');
    } catch (error) {
      console.error('アップロード失敗', error);
      alert('画像のアップロードに失敗しました');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 345, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardMedia
          component="img"
          sx={{
            width: 200,
            height: 200,
            objectFit: 'cover',
            borderRadius: '50%',
            mt: 2,
          }}
          image={user?.profile_image || '/default-profile.png'}
          alt="プロフィール画像"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {user?.username || 'ユーザー名'}
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
              アップロード
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" onClick={() => alert("プロフィール情報の編集機能がここに追加される予定です")}>
              プロフィール編集
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
