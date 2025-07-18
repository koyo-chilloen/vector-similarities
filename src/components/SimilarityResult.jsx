import React from 'react';

const ProgressBar = ({ value, label, type, isTotal = false }) => {
  const percentage = (value * 100).toFixed(1);

  const colorPalette = {
    cosine:    { bg: '#ede7f6', bar: '#673ab7' }, // Purple-ish
    euclidean: { bg: '#e3f2fd', bar: '#2196f3' }, // Blue
    manhattan: { bg: '#e0f2f7', bar: '#03a9f4' }, // Light Blue
  };

  const totalColorPalette = {
    cosine:    { bg: '#d1c4e9', bar: '#4527a0' }, // Deep Purple-ish
    euclidean: { bg: '#bbdefb', bar: '#1565c0' }, // Deep Blue
    manhattan: { bg: '#b2ebf2', bar: '#01579b' }, // Deep Light Blue
  };

  const colors = isTotal ? totalColorPalette[type] : colorPalette[type];

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
      <span style={{ width: '80px', fontSize: '0.9em', color: '#555' }}>{label}</span>
      <div style={{ flex: 1, backgroundColor: colors.bg, borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: colors.bar,
            padding: '6px', 
            color: 'white', 
            textAlign: 'right',
            fontSize: '0.9em',
            whiteSpace: 'nowrap',
            transition: 'width 0.5s ease-in-out'
          }}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

const calculateTotalScores = (results) => {
  const totals = { cosine: [], euclidean: [], manhattan: [] };
  Object.values(results).forEach(cat => {
    if(typeof cat.cosine === 'number' && cat.cosine !== 0) totals.cosine.push(cat.cosine);
    if(typeof cat.euclidean === 'number' && cat.euclidean !== 0) totals.euclidean.push(cat.euclidean);
    if(typeof cat.manhattan === 'number' && cat.manhattan !== 0) totals.manhattan.push(cat.manhattan);
  });

  return {
    cosine: totals.cosine.length > 0 ? totals.cosine.reduce((a, b) => a + b, 0) / totals.cosine.length : 0,
    euclidean: totals.euclidean.length > 0 ? totals.euclidean.reduce((a, b) => a + b, 0) / totals.euclidean.length : 0,
    manhattan: totals.manhattan.length > 0 ? totals.manhattan.reduce((a, b) => a + b, 0) / totals.manhattan.length : 0,
  };
}

function SimilarityResult({ result }) {
  if (!result) return null;

  const totalScores = calculateTotalScores(result.results);

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>
        {result.song1Title} <span style={{ color: '#6c757d' }}>vs</span> {result.song2Title}
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong style={{ fontSize: '1.2em', display: 'block', marginBottom: '12px', color: '#333' }}>종합 유사도</strong>
        <ProgressBar value={totalScores.cosine} label="코사인" type="cosine" isTotal={true} />
        <ProgressBar value={totalScores.euclidean} label="유클리드" type="euclidean" isTotal={true} />
        <ProgressBar value={totalScores.manhattan} label="맨해튼" type="manhattan" isTotal={true} />
      </div>

      <ul style={{ listStyle: 'none', padding: 0, borderTop: '1px solid #eee', paddingTop: '15px' }}>
        {Object.entries(result.results).map(([key, values]) => (
          <li key={key} style={{ marginBottom: '15px' }}>
            <strong style={{ textTransform: 'capitalize', display: 'block', marginBottom: '8px' }}>{key}</strong>
            {typeof values.cosine === 'number' ? <ProgressBar value={values.cosine} label="코사인" type="cosine" /> : <div>코사인: N/A</div>}
            {typeof values.euclidean === 'number' ? <ProgressBar value={values.euclidean} label="유클리드" type="euclidean" /> : <div>유클리드: N/A</div>}
            {typeof values.manhattan === 'number' ? <ProgressBar value={values.manhattan} label="맨해튼" type="manhattan" /> : <div>맨해튼: N/A</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SimilarityResult;