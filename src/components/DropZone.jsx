import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function DropZone({ id, song, children, zoneIndex }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const baseStyle = {
    padding: '20px',
    margin: '10px',
    minHeight: '100px',
    width: '45%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  const getDynamicStyle = () => {
    const zoneColors = {
      1: { empty: '#f8f9fa', filled: '#e3f2fd', border: '#007bff', font: '#0056b3' },
      2: { empty: '#f8f9fa', filled: '#e6f9f0', border: '#28a745', font: '#155724' }, // 글씨색을 진한 녹색으로 변경
    };

    const colors = zoneColors[zoneIndex] || zoneColors[1];

    if (isOver) {
      return {
        ...baseStyle,
        backgroundColor: colors.filled,
        border: `2px dashed ${colors.border}`,
        boxShadow: `0 0 10px ${colors.filled}`,
      };
    }

    if (song) {
      return {
        ...baseStyle,
        backgroundColor: colors.filled,
        border: `2px solid ${colors.border}`,
        fontWeight: 'bold',
        color: colors.font, // 동적으로 글씨색 적용
      };
    }

    return {
      ...baseStyle,
      backgroundColor: colors.empty,
      border: '2px dashed #ced4da',
      color: '#6c757d'
    };
  };

  return (
    <div ref={setNodeRef} style={getDynamicStyle()}>
      {song ? children : <p>이곳에 곡을 드롭하세요</p>}
    </div>
  );
}

export default DropZone;
