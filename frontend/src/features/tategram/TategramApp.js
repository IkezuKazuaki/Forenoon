// src/features/tategram/TategramApp.js
import React from 'react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './TategramApp.css';

function TategramApp() {
  // ダミー投稿データ
  const dummyPosts = [
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
    {
      id: 1,
      user: 'ユーザーA',
      content: '縦書きSNS「Tategram」へようこそ。\nここでは文章が縦に流れます！',
    },
    {
      id: 2,
      user: 'ユーザーB',
      content: '投稿テストです。\n複数行でも改行が反映されます。',
    },
  ];

  return (
    <div className="tategram-container">
      {/* 右端に配置される */}
      <CreatePost />

      {/* CreatePostの左側に、PostCardが右から順に並ぶ */}
      {dummyPosts.map((post) => (
        <PostCard key={post.id} user={post.user} content={post.content} />
      ))}
    </div>
  );
}

export default TategramApp;
