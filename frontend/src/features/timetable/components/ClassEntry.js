// src/features/timetable/components/ClassEntry.js

import React from 'react';

const ClassEntry = ({ classData, onClick }) => {
  if (!classData) {
    return (
      <div className="empty-cell">
        <span>授業なし</span>
      </div>
    );
  }

  return (
    <div className="class-entry" onClick={() => onClick(classData)}>
      <h4>{classData.subject_name}</h4>
      {classData.room && <p className="room">{classData.room}</p>}
      {classData.teacher && <p className="teacher">{classData.teacher}</p>}
    </div>
  );
};

export default ClassEntry;
