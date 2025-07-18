
// src/components/ResultDisplay.jsx
import React from 'react';

const ResultDisplay = ({ title, results }) => {
  const getHighlightStyle = (isHighlighted) => ({
    fontWeight: isHighlighted ? 'bold' : 'normal',
    color: isHighlighted ? '#28a745' : '#333', // Green for highlighted, dark gray otherwise
  });

  const getBarColor = (method, value, isHighlighted) => {
    if (isHighlighted) return '#28a745'; // Green for highlighted

    if (method === 'Cosine' && value < 0) {
      return '#dc3545'; // Red for negative cosine similarity
    }
    return '#007bff'; // Default blue
  };

  const getSimilarityPercentage = (method, value) => {
    if (value === undefined || isNaN(value)) return 'N/A';

    let displayValue = value; // Default to raw value

    return `${(displayValue * 100).toFixed(0)}%`;
  };

  const getBarWidth = (method, value) => {
    if (value === undefined || isNaN(value)) return 0;

    let displayValue = value; // Default to raw value

    // For Cosine, use absolute value for width
    return Math.min(100, Math.max(0, Math.abs(displayValue) * 100)); // Ensure between 0 and 100
  };

  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: '0', color: '#0056b3' }}>{title}</h3>
      {
        Object.keys(results).map((method) => {
          const { similarity1, similarity2, highlight1, highlight2 } = results[method];
          return (
            <div key={method} style={{ marginBottom: '15px' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>{method}:</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ ...getHighlightStyle(highlight1), minWidth: '120px' }}>
                  비교 1: {getSimilarityPercentage(method, similarity1)}
                </span>
                <div style={{
                  height: '15px',
                  backgroundColor: getBarColor(method, similarity1, highlight1),
                  width: `${getBarWidth(method, similarity1)}%`,
                  borderRadius: '2px',
                  marginLeft: '10px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ ...getHighlightStyle(highlight2), minWidth: '120px' }}>
                  비교 2: {getSimilarityPercentage(method, similarity2)}
                </span>
                <div style={{
                  height: '15px',
                  backgroundColor: getBarColor(method, similarity2, highlight2),
                  width: `${getBarWidth(method, similarity2)}%`,
                  borderRadius: '2px',
                  marginLeft: '10px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default ResultDisplay;
