// src/features/diary/components/DiaryForm.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import TaskManager from '../TaskManager';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { UserContext } from '../../../../contexts/UserContext';
import {
  fetchTodayTasks,
  fetchDailyTasks,
  fetchFutureTasks,
  fetchDiary,
  createDiary,
  updateDiary,
  addTask,
  editTask,
  deleteTask
} from '../../api';

const TASK_TYPES = {
  TODAY: 'today',
  DAILY: 'daily',
  FUTURE: 'future'
};

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DiaryForm = ({ onDiaryCreated }) => {
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [content, setContent] = useState('');
  const [todayTasks, setTodayTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [futureTasks, setFutureTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [futureTaskDate, setFutureTaskDate] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const [diaryId, setDiaryId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const { userId } = useContext(UserContext);

  const fetchTasksAndDiaryData = useCallback(async () => {
    try {
      if (!date) return;
      const [todayResponse, dailyResponse] = await Promise.all([
        fetchTodayTasks(date),
        fetchDailyTasks()
      ]);
      setTodayTasks(todayResponse.data);
      setDailyTasks(dailyResponse.data);

      const diaryResponse = await fetchDiary(date);
      if (diaryResponse.data.length > 0) {
        const diary = diaryResponse.data[0];
        setContent(diary.content);
        setDiaryId(diary.id);

        const task_ids = diary.task_ids || [];
        const selectedFromToday = todayResponse.data
          .filter(task => task_ids.includes(task.id))
          .map(task => task.id);
        const selectedFromDaily = dailyResponse.data
          .filter(task => task_ids.includes(task.id))
          .map(task => task.id);

        setSelectedTasks([...selectedFromToday, ...selectedFromDaily]);
      } else {
        setContent('');
        setDiaryId(null);
        setSelectedTasks([]);
      }
    } catch (error) {
      console.error('タスクまたは日記の取得に失敗しました', error);
      setSnackbarMessage('タスクまたは日記の取得に失敗しました');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [date]);

  const fetchFutureTasksData = useCallback(async () => {
    try {
      if (!futureTaskDate) return;
      const formattedDate = formatDate(futureTaskDate);
      const response = await fetchFutureTasks(formattedDate);
      setFutureTasks(response.data);
    } catch (error) {
      console.error('今後のタスクの取得に失敗しました', error);
      setSnackbarMessage('今後のタスクの取得に失敗しました');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, [futureTaskDate]);

  useEffect(() => {
    fetchTasksAndDiaryData();
  }, [fetchTasksAndDiaryData]);

  useEffect(() => {
    fetchFutureTasksData();
  }, [fetchFutureTasksData]);

  // futureTasks取得後に選択状態反映
  useEffect(() => {
    const adjustSelectedTasksForFuture = async () => {
      if (diaryId) {
        const diaryResponse = await fetchDiary(date);
        if (diaryResponse.data.length > 0) {
          const diary = diaryResponse.data[0];
          const task_ids = diary.task_ids || [];
          const selectedFromFuture = futureTasks
            .filter(task => task_ids.includes(task.id))
            .map(task => task.id);
          setSelectedTasks(prev => Array.from(new Set([...prev, ...selectedFromFuture])));
        }
      }
    };
    adjustSelectedTasksForFuture();
  }, [futureTasks, diaryId, date]);

  useEffect(() => {
    const selectedDate = new Date(date);
    const newFutureDate = new Date(selectedDate);
    newFutureDate.setDate(newFutureDate.getDate() + 1);
    setFutureTaskDate(newFutureDate);
  }, [date]);

  const handleDeleteTask = useCallback(async (taskId, taskType) => {
    try {
      await deleteTask(taskId);
      if (taskType === TASK_TYPES.TODAY) {
        setTodayTasks(prev => prev.filter(task => task.id !== taskId));
      } else if (taskType === TASK_TYPES.DAILY) {
        setDailyTasks(prev => prev.filter(task => task.id !== taskId));
      } else if (taskType === TASK_TYPES.FUTURE) {
        setFutureTasks(prev => prev.filter(task => task.id !== taskId));
      }

      setSelectedTasks(prev => prev.filter(id => id !== taskId));
      setSnackbarMessage('タスクが削除されました');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('タスクの削除に失敗しました:', error);
      setSnackbarMessage('タスクの削除に失敗しました。');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, []);

  const handleEditTask = useCallback(async (taskId, newName, taskType) => {
    try {
      const response = await editTask(taskId, { name: newName });
      if (taskType === TASK_TYPES.TODAY) {
        setTodayTasks(prev => prev.map(task => (task.id === taskId ? response.data : task)));
      } else if (taskType === TASK_TYPES.DAILY) {
        setDailyTasks(prev => prev.map(task => (task.id === taskId ? response.data : task)));
      } else if (taskType === TASK_TYPES.FUTURE) {
        setFutureTasks(prev => prev.map(task => (task.id === taskId ? response.data : task)));
      }

      setSnackbarMessage('タスクが更新されました');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('タスクの編集に失敗しました:', error);
      setSnackbarMessage('タスクの編集に失敗しました。');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const diaryData = {
      userId,
      date,
      content,
      tasks: selectedTasks,
    };
    try {
      if (diaryId) {
        const response = await updateDiary(diaryId, diaryData);
        console.log('日記が更新されました:', response.data);
        setSnackbarMessage('日記が更新されました');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        const response = await createDiary(diaryData);
        console.log('日記が作成されました:', response.data);
        setSnackbarMessage('日記が作成されました');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setDiaryId(response.data.id);
      }
      if (onDiaryCreated) onDiaryCreated();
    } catch (error) {
      console.error('日記の保存に失敗しました:', error);
      setSnackbarMessage('日記の保存に失敗しました');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleTaskChange = (e, taskId) => {
    const isChecked = e.target.checked;
    setSelectedTasks(prev =>
      isChecked ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const handleAddTask = async (taskType, taskName, futureDate) => {
    try {
      const taskData = { name: taskName };
      if (taskType === TASK_TYPES.DAILY) {
        taskData.is_daily = true;
        taskData.date = null;
      } else if (taskType === TASK_TYPES.TODAY) {
        taskData.is_daily = false;
        taskData.date = date;
      } else if (taskType === TASK_TYPES.FUTURE && futureDate) {
        taskData.is_daily = false;
        taskData.date = formatDate(futureDate);
      }

      const response = await addTask(taskType, taskData);

      if (taskType === TASK_TYPES.TODAY) {
        setTodayTasks(prev => [...prev, response.data]);
      } else if (taskType === TASK_TYPES.DAILY) {
        setDailyTasks(prev => [...prev, response.data]);
      } else if (taskType === TASK_TYPES.FUTURE) {
        setFutureTasks(prev => [...prev, response.data]);
      }

      setSelectedTasks(prev => [...prev, response.data.id]);

      setSnackbarMessage('タスクが追加されました');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error(`タスクの追加に失敗しました`, error);
      setSnackbarMessage(`タスクの追加に失敗しました。`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const allTasks = [
    ...dailyTasks.map(t => ({ ...t, type: TASK_TYPES.DAILY })),
    ...todayTasks.map(t => ({ ...t, type: TASK_TYPES.TODAY })),
    ...futureTasks.map(t => ({ ...t, type: TASK_TYPES.FUTURE })),
  ];

  return (
    <div className="card p-4 shadow-sm">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">日記の作成</h2>
        </Col>
        <Col md="auto">
          <InputGroup>
            <FormControl
              id="diary-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </InputGroup>
        </Col>
      </Row>

      <form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col>
            <label htmlFor="diary-content" className="form-label">内容:</label>
            <textarea
              id="diary-content"
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            ></textarea>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <TaskManager
              tasks={allTasks}
              selectedTasks={selectedTasks}
              onTaskChange={handleTaskChange}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              futureTaskDate={futureTaskDate}
              setFutureTaskDate={setFutureTaskDate}
            />
          </Col>
        </Row>

        <button type="submit" className="btn btn-primary w-100">
          保存
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DiaryForm;
