// src/components/DataPreprocessor.jsx
import React, { useState } from 'react';

const DataPreprocessor = ({ onUseVector }) => {
  const [inputText, setInputText] = useState('');
  const [processedData, setProcessedData] = useState([]); // { key: string, value: number }[]

  const handleProcessData = () => {
    const lines = inputText.split('\n');
    const extracted = [];
    // Matches "- key: value" or "key: value"
    const regex = /^(?:-\s*)?(\w+):\s*(.*)$/;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        const key = match[1];
        const value = parseFloat(match[2]);
        if (isNaN(value)) {
          extracted.push({ key, value: 0 }); // Convert NaN to 0
        } else {
          extracted.push({ key, value: Number(value.toFixed(3)) }); // Apply toFixed(3) and convert back to number
        }
      }
    });

    setProcessedData(extracted);
  };

  const handleUse = (target) => {
    const vectorValues = processedData.map(item => item.value).join(',');
    const vectorKeys = processedData.map(item => item.key);
    onUseVector(target, vectorValues, vectorKeys);
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f0f0f0'
    }}>
      <h3 style={{ marginTop: '0', color: '#0056b3' }}>데이터 정제</h3>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="여기에 cyanite 데이터를 입력하세요 (예: mood 데이터 복붙)"
        rows="6"
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          marginBottom: '10px'
        }}
      ></textarea>
      <button
        onClick={handleProcessData}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        데이터 정제
      </button>

      {processedData.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <p><strong>정제된 벡터:</strong> [{processedData.map(item => item.value).join(', ')}]</p>
          <p><strong>추출된 키:</strong> [{processedData.map(item => item.key).join(', ')}]</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleUse('original')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              원본으로 사용
            </button>
            <button
              onClick={() => handleUse('compare1')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              비교 1로 사용
            </button>
            <button
              onClick={() => handleUse('compare2')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              비교 2로 사용
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreprocessor;