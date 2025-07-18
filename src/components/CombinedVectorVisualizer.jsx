// src/components/CombinedVectorVisualizer.jsx
import React, { useState } from 'react';
import './CombinedVectorVisualizer.css';

// 하위 컴포넌트: 막대와 툴팁 로직
const BarWithTooltip = ({ value, color, barWidth, scaleFactor, leftOffset, zIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const barHeight = value * scaleFactor;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bar-with-tooltip"
      style={{
        left: leftOffset,
        width: `${barWidth}px`,
        height: `${barHeight}px`,
        backgroundColor: color,
        zIndex: zIndex,
      }}
    >
      {isHovered && (
        <div className="bar-tooltip">
          {value.toFixed(3)}
        </div>
      )}
    </div>
  );
};

const CombinedVectorVisualizer = ({ original, compare1, compare2, title, keys }) => {
  

  const maxLength = Math.max(original?.length || 0, compare1?.length || 0, compare2?.length || 0, keys?.length || 0);
  const allValues = [...(original || []), ...(compare1 || []), ...(compare2 || [])];
  const maxValue = Math.max(...allValues, 1); // Ensure maxValue is at least 1 to avoid division by zero

  const containerHeight = 200;
  const maxBarHeight = 150;
  const scaleFactor = maxValue > 0 ? maxBarHeight / maxValue : 0;

  const colors = {
    original: '#007bff', // Blue for Song 1
    compare1: '#28a745', // Green for Song 2
    compare2: '#6c757d', // Grey for a potential third vector
  };

  const barWidth = 10;
  const barSpacing = 2;
  const groupInnerWidth = barWidth * 3 + barSpacing * 2;
  const groupOuterSpacing = 10;

  return (
    <div className="combined-vector-visualizer-container">
      <h3 className="visualizer-title">{title || 'Vector Visualization'}</h3>
      <div className="visualizer-chart-area" style={{ height: `${containerHeight}px` }}>
        {Array.from({ length: maxLength }).map((_, index) => {
          const originalValue = original?.[index] || 0;
          const compare1Value = compare1?.[index] || 0;
          const compare2Value = compare2?.[index] || 0;
          const keyLabel = keys && keys[index] ? keys[index] : index; // Use key from array or index

          return (
            <div key={index} className="bar-group" style={{ minWidth: `${groupInnerWidth + groupOuterSpacing}px`, marginRight: `${groupOuterSpacing}px` }}>
              <div className="bar-container">
                <BarWithTooltip value={originalValue} color={colors.original} barWidth={barWidth} scaleFactor={scaleFactor} leftOffset={`calc(50% - ${barWidth * 1.5 + barSpacing}px)`} zIndex={3} />
                <BarWithTooltip value={compare1Value} color={colors.compare1} barWidth={barWidth} scaleFactor={scaleFactor} leftOffset={`calc(50% - ${barWidth * 0.5}px)`} zIndex={2} />
                <BarWithTooltip value={compare2Value} color={colors.compare2} barWidth={barWidth} scaleFactor={scaleFactor} leftOffset={`calc(50% + ${barWidth * 0.5 + barSpacing}px)`} zIndex={1} />
              </div>
              <div className="key-label">
                {keyLabel}
              </div>
            </div>
          );
        })}
      </div>
      <div className="visualizer-legend">
        <span className="legend-item" style={{ color: colors.original }}>■ 곡 1</span>
        <span className="legend-item" style={{ color: colors.compare1 }}>■ 곡 2</span>
        <span className="legend-item" style={{ color: colors.compare2, marginRight: '0' }}>■ 곡 3</span>
      </div>
    </div>
  );
};

export default CombinedVectorVisualizer;