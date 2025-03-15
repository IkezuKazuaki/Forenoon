//src/features/sleepMaster/sleepMasterPage.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { createSchedule, fetchLatestSchedule, sendMessageToGemini, fetchCharacters } from './api';
import TimeInput from './components/TimeInput';
import './sleepMaster.css';

const SleepMaster = () => {
  const { user } = useContext(UserContext);
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messages, setMessages] = useState([]);
  const [character, setCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetchCharacters();
        setCharacters(response.data);
        setCharacter(response.data[0]); // デフォルトで最初のキャラクターを選択
      } catch (error) {
        console.error('キャラクターリストの取得に失敗しました', error);
      }
    };

    loadCharacters();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getLatestSchedule = async () => {
      try {
        const response = await fetchLatestSchedule();
        const schedule = response.data;
        if (schedule) {
          setWakeUpTime(schedule.wake_up_time);
          setSleepTime(schedule.sleep_time);
        }
      } catch (error) {
        console.error('既存のスケジュールの取得に失敗しました', error);
      }
    };

    getLatestSchedule();
  }, []);

  const handleSendMessage = async (message) => {
    const characterPrefixedMessage = `${message}`;
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: characterPrefixedMessage },
    ]);

    try {
      const response = await sendMessageToGemini(message, character);
      const aiReply = response.data.reply || 'AIからの返答がありません。';
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiReply }]);
    } catch (error) {
      console.error('Gemini API呼び出しに失敗しました', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'エラー！' }]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const saveSchedule = async () => {
    try {
      const schedule = { wake_up_time: wakeUpTime, sleep_time: sleepTime };
      await createSchedule(schedule);
      await handleSendMessage('スケジュールを登録しました！');
    } catch (error) {
      console.error('スケジュールの保存に失敗しました', error);
    }
  };

  const handleSleepButton = () => {
    handleSendMessage('おやすみなさい！');
  };

  const handleWakeUpButton = () => {
    handleSendMessage('おはようございます！');
  };

  return (
    <div
      className="container my-5"
      style={{
        maxWidth: '500px',
        backgroundColor: '#E5E5E5',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <h1 className="text-center mb-4">SleepMaster</h1>

      <TimeInput label="起きる時間" value={wakeUpTime} onChange={setWakeUpTime} />
      <TimeInput label="寝る時間" value={sleepTime} onChange={setSleepTime} />

      <div className="mb-3">
        <label>キャラ設定:</label>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="characterDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {character ? (
              <>
                <img
                  src={character.icon}
                  alt={character.name}
                  style={{ width: '20px', height: '20px', marginRight: '8px' }}
                />
                {character.name}
              </>
            ) : (
              'キャラクターを選択'
            )}
          </button>
          <ul className="dropdown-menu" aria-labelledby="characterDropdown">
            {characters.map((char) => (
              <li key={char.id}>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => setCharacter(char)}
                >
                  <img
                    src={char.icon}
                    alt={char.name}
                    style={{ width: '20px', height: '20px', marginRight: '8px' }}
                  />
                  {char.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mb-3">
        <button className="btn btn-primary" onClick={saveSchedule}>
          スケジュールを保存
        </button>
        <button className="btn btn-success ml-2" onClick={handleWakeUpButton}>
          起きた！
        </button>
        <button className="btn btn-secondary ml-2" onClick={handleSleepButton}>
          寝る！
        </button>
      </div>

      <div
        className="chat-container"
        style={{
          height: '400px',
          overflowY: 'scroll',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message mb-3 d-flex ${msg.sender === 'user' ? 'justify-content-end' : ''}`}
          >
            {msg.sender === 'ai' && character?.icon && (
              <img
                src={character.icon}
                alt="AI"
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
            )}
            <div
              style={{
                maxWidth: '70%',
                backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#FFFFFF',
                color: '#000',
                padding: '10px 15px',
                borderRadius: '20px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
              }}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <img
                src={user?.profile_image || '/default-profile.png'}
                alt="User"
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '10px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SleepMaster;
