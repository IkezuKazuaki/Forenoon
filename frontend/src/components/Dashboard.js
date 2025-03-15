// src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 display-4">ダッシュボード</h1>
      <div className="row">
        <div className="col-md-10 mx-auto">
          {/* ユーザーの概要や最近の活動を表示 */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">ようこそ、ユーザー名さん！</h5>
              <p className="card-text">ここにユーザーの概要や統計情報を表示します。</p>
            </div>
          </div>
          {/* 他のコンテンツを追加 */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">最近の活動</h5>
              <p className="card-text">最近作成した日記やタスクを表示します。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
