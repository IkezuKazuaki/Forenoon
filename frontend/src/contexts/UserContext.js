import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../features/diary/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetchUserProfile();
      console.log(response)
      setUser(response.data);
    } catch (error) {
      console.error('ユーザープロフィールの取得に失敗しました', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};
