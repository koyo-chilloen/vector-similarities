
// src/components/VectorInput.jsx
import React from 'react';

const VectorInput = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="쉼표로 구분된 숫자 입력 (예: 1,2,3)"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default VectorInput;
