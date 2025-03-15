// src/features/diary/components/TaskManager.js
import React, { useState } from 'react';
import { Button, FormControl, ButtonGroup, InputGroup, Form } from 'react-bootstrap';
import { FaTrash, FaEdit, FaSave, FaTimes, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { registerLocale } from 'react-datepicker';
import './TaskManager.css'; // グローバルCSSをインポート

registerLocale('ja', ja);

const TASK_TYPES = {
  TODAY: 'today',
  DAILY: 'daily',
  FUTURE: 'future',
};

const formatDateWithDayOfWeek = (date) => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const day = days[date.getDay()];
  return `${y}/${m}/${d} (${day})`;
};

const TaskManager = ({
  tasks,
  selectedTasks,
  onTaskChange,
  onAddTask,
  onEditTask,
  onDeleteTask,
  futureTaskDate,
  setFutureTaskDate,
}) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  // 追加フォーム用
  const [newTaskType, setNewTaskType] = useState(TASK_TYPES.TODAY);
  const [newTaskName, setNewTaskName] = useState('');
  const [newFutureDate, setNewFutureDate] = useState(new Date());

  const handleEdit = (taskId, currentName) => {
    setEditingTaskId(taskId);
    setEditingTaskName(currentName);
  };

  const handleSave = (taskId, taskType) => {
    if (editingTaskName.trim() === '') return;
    onEditTask(taskId, editingTaskName.trim(), taskType);
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const handleAddNewTask = () => {
    if (newTaskName.trim() === '') return;
    const dateForFuture = newTaskType === TASK_TYPES.FUTURE ? newFutureDate : null;
    onAddTask(newTaskType, newTaskName.trim(), dateForFuture);
    setNewTaskName('');
  };

  const getTypeOrDateLabel = (task) => {
    if (task.type === TASK_TYPES.DAILY) return 'デイリー';
    if (task.type === TASK_TYPES.TODAY) return '今日';
    if (task.type === TASK_TYPES.FUTURE) return task.date; // FUTUREは日付表示
    return '';
  };

  return (
    <div className="taskManager">
      <h4 className="fw-bold">タスク一覧</h4>

      {/* 追加フォーム */}
      <InputGroup className="mb-3 inputGroup">
        {/* タスク種類選択 */}
        <Form.Select
          value={newTaskType}
          onChange={(e) => setNewTaskType(e.target.value)}
          style={{ maxWidth: '100px' }}
          className="me-2"
        >
          <option value={TASK_TYPES.DAILY}>デイリー</option>
          <option value={TASK_TYPES.TODAY}>今日</option>
          <option value={TASK_TYPES.FUTURE}>今後</option>
        </Form.Select>

        {newTaskType === TASK_TYPES.FUTURE && (
          <DatePicker
            selected={newFutureDate}
            onChange={(date) => setNewFutureDate(date)}
            customInput={
              <Button variant="outline-secondary" className="datePickerButton">
                <FaCalendarAlt />{' '}
                {newFutureDate ? formatDateWithDayOfWeek(newFutureDate) : '日付を選択'}
              </Button>
            }
            locale="ja"
            dateFormat="yyyy/MM/dd (eee)"
            todayButton="今日"
            className="me-2"
          />
        )}

        {/* タスク名入力。DatePickerがないときはここが広くなる */}
        <FormControl
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="タスクを追加"
          className="me-2"
          style={{ flex: '1 1 auto' }}
        />

        <Button variant="success" onClick={handleAddNewTask}>
          <FaPlus />
        </Button>
      </InputGroup>

      {/* タスク一覧表示 */}
      {tasks.length === 0 ? (
        <p>タスクがありません。</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="d-flex align-items-center mb-2">
            {/* チェックボックス */}
            <input
              type="checkbox"
              className="form-check-input me-2"
              id={`task-${task.id}`}
              value={task.id}
              onChange={(e) => onTaskChange(e, task.id)}
              checked={selectedTasks.includes(task.id)}
            />

            {/* タスク種類もしくは日付 */}
            <span className="me-2" style={{ minWidth: '80px' }}>
              {getTypeOrDateLabel(task)}
            </span>

            {editingTaskId === task.id ? (
              <>
                <FormControl
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => setEditingTaskName(e.target.value)}
                  className="editInput me-2"
                />
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleSave(task.id, task.type)}
                  className="me-2"
                >
                  <FaSave />
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancel}>
                  <FaTimes />
                </Button>
              </>
            ) : (
              <>
                <label
                  htmlFor={`task-${task.id}`}
                  className="form-check-label mb-0 me-2 flex-grow-1"
                >
                  {task.name}
                </label>

                <ButtonGroup size="sm" className="buttonGroup">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleEdit(task.id, task.name)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTask(task.id, task.type)}
                  >
                    <FaTrash />
                  </Button>
                </ButtonGroup>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskManager;
