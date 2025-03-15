// src/components/ProfileAvatar.jsx
import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Avatar, Menu, MenuItem, Divider, ListItemIcon, Typography } from '@mui/material';
import { AccountCircle, Logout, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {handleLogout} from '../App';

const ProfileAvatar = ({ onLogout }) => {
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings'); // 設定ページがあればここにリンク
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
    handleClose();
  };

  return (
    <>
      <Avatar
        src={user?.profile_image || '/default-profile.png'}
        alt={user?.username || 'ユーザー'}
        sx={{
          width: 48,
          height: 48,
          ml: 2,
          cursor: 'pointer',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', // 影を追加してスタイリッシュに
        }}
        onClick={handleClick}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 200,
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Typography variant="subtitle1" align="center" sx={{ mt: 1, mb: 1 }}>
          {user?.username || 'ユーザー名'}
        </Typography>
        <Divider />

        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          プロフィール
        </MenuItem>

        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          設定
        </MenuItem>

        <Divider />

        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          ログアウト
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileAvatar;
