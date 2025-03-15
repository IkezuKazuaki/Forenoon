// src/features/sleepMaster/components/TimeInput.js
import React from 'react';

const TimeInput = ({ label, value, onChange }) => {
  return (
    <div className="mb-3">
      <label>{label}:</label>
      <input
        type="time"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TimeInput;
