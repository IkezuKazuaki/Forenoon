// src/features/tategram/PostCard.js
import React from 'react';
import './PostCard.css';

function PostCard({ user, content }) {
  return (
    <div className="post-card">
      <div className="post-content">
        <p className="vertical-text">{content}</p>
      </div>
      <div className="user-info">by {user}</div>
    </div>
  );
}

export default PostCard;
