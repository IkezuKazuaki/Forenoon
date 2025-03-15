// src/features/tategram/CreatePost.js
import React, { useState } from 'react';
import './CreatePost.css';

function CreatePost() {
  const [text, setText] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    console.log('新しい投稿:', text);
    setText('');
  };

  return (
    <form className="create-post" onSubmit={handlePost}>
      <div className="textarea-container">
        <textarea
          className="vertical-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="縦書きの投稿を入力..."
        />
      </div>
      <button type="submit" className="btn btn-primary">投稿</button>
    </form>
  );
}

export default CreatePost;
