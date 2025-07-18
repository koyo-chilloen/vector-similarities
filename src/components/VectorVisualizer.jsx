// src/components/VectorVisualizer.jsx
import React from 'react';

const VectorVisualizer = ({ label, vector }) => {
  if (!vector || vector.length === 0) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: '0', color: '#0056b3' }}>{label} 시각화</h3>
        <p>유효한 벡터 데이터가 없습니다.</p>
      </div>
    );
  }

  // 벡터 값의 최대값을 찾아 스케일링에 사용 (양수만 고려)
  const maxValue = Math.max(...vector);
  const scaleFactor = maxValue > 0 ? 100 / maxValue : 0; // 막대 높이 최대 100px

  return (
    <div style={{
      marginBottom: '20px',
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    }}>
      <h3 style={{ marginTop: '0', color: '#0056b3' }}>{label} 시각화</h3>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '120px', // 막대 그래프 전체 높이
        borderBottom: '1px solid #ccc',
        position: 'relative',
        overflowX: 'auto',
        paddingBottom: '10px',
        justifyContent: 'flex-start' // 막대들을 왼쪽 정렬
      }}>
        {vector.map((value, index) => {
          const barHeight = value * scaleFactor; // 값에 비례하여 높이 계산

          return (
            <div
              key={index}
              title={`Index: ${index}, Value: ${value}`}
              style={{
                width: '20px', // 각 막대의 너비
                height: `${barHeight}px`,
                backgroundColor: '#4CAF50', // 양수만 고려하여 초록색
                margin: '0 2px',
                position: 'relative',
                bottom: '0', // 바닥에서 시작
                transition: 'height 0.3s ease-in-out',
                display: 'flex', // 값 표시를 위해 flex 사용
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8em',
                fontWeight: 'bold'
              }}
            ></div>
          );
        })}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.9em', color: '#666' }}>
        (각 막대는 벡터의 한 요소를 나타냅니다.)
      </p>
    </div>
  );
};

export default VectorVisualizer;