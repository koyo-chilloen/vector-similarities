import React, { useState, useMemo } from 'react';
import VectorInput from '../components/VectorInput';
import ResultDisplay from '../components/ResultDisplay';
import DataPreprocessor from '../components/DataPreprocessor';
import CombinedVectorVisualizer from '../components/CombinedVectorVisualizer';
import {
  parseVector,
  cosineSimilarity,
  euclideanDistance,
  manhattanDistance,
} from '../utils/similarity';

function Home() {
  const [originalVector, setOriginalVector] = useState('');
  const [compareVector1, setCompareVector1] = useState('');
  const [compareVector2, setCompareVector2] = useState('');

  // 키 값들을 저장할 새로운 상태
  const [originalKeys, setOriginalKeys] = useState([]);
  const [compare1Keys, setCompare1Keys] = useState([]);
  const [compare2Keys, setCompare2Keys] = useState([]);

  const parsedOriginal = useMemo(() => parseVector(originalVector), [originalVector]);
  const parsedCompare1 = useMemo(() => parseVector(compareVector1), [compareVector1]);
  const parsedCompare2 = useMemo(() => parseVector(compareVector2), [compareVector2]);

  const handleUseVector = (target, vectorString, keys) => {
    if (target === 'original') {
      setOriginalVector(vectorString);
      setOriginalKeys(keys);
    } else if (target === 'compare1') {
      setCompareVector1(vectorString);
      setCompare1Keys(keys);
    } else if (target === 'compare2') {
      setCompareVector2(vectorString);
      setCompare2Keys(keys);
    }
  };

  const calculateSimilarities = () => {
    const results = {};

    // 코사인 유사도
    const cosSim1 = cosineSimilarity(parsedOriginal, parsedCompare1);
    const cosSim2 = cosineSimilarity(parsedOriginal, parsedCompare2);
    results.Cosine = {
      similarity1: cosSim1,
      similarity2: cosSim2,
      highlight1: cosSim1 > cosSim2,
      highlight2: cosSim2 > cosSim1,
    };

    // 유클리드 유사도 (거리 기반)
    const eucDist1 = euclideanDistance(parsedOriginal, parsedCompare1);
    const eucSim1 = 1 / (1 + eucDist1);
    const eucDist2 = euclideanDistance(parsedOriginal, parsedCompare2);
    const eucSim2 = 1 / (1 + eucDist2);
    results.Euclidean = {
      similarity1: eucSim1,
      similarity2: eucSim2,
      highlight1: eucSim1 > eucSim2, // 유사도는 클수록 좋으므로 >
      highlight2: eucSim2 > eucSim1,
    };

    // 맨해튼 유사도 (거리 기반)
    const manDist1 = manhattanDistance(parsedOriginal, parsedCompare1);
    const manSim1 = 1 / (1 + manDist1);
    const manDist2 = manhattanDistance(parsedOriginal, parsedCompare2);
    const manSim2 = 1 / (1 + manDist2);
    results.Manhattan = {
      similarity1: manSim1,
      similarity2: manSim2,
      highlight1: manSim1 > manSim2, // 유사도는 클수록 좋으므로 >
      highlight2: manSim2 > manSim1,
    };

    return results;
  };

  const similarityResults = useMemo(() => {
    // 모든 벡터가 유효한지 확인 (길이가 0이 아니고, 길이가 일치하는지)
    const areVectorsValid = 
      parsedOriginal.length > 0 &&
      parsedCompare1.length > 0 &&
      parsedCompare2.length > 0 &&
      parsedOriginal.length === parsedCompare1.length &&
      parsedOriginal.length === parsedCompare2.length;

    return areVectorsValid ? calculateSimilarities() : {};
  }, [parsedOriginal, parsedCompare1, parsedCompare2]);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    }}>

      <DataPreprocessor onUseVector={handleUseVector} />

      <VectorInput
        label="원본 벡터"
        value={originalVector}
        onChange={setOriginalVector}
      />
      <VectorInput
        label="비교 1 벡터"
        value={compareVector1}
        onChange={setCompareVector1}
      />
      <VectorInput
        label="비교 2 벡터"
        value={compareVector2}
        onChange={setCompareVector2}
      />

      {Object.keys(similarityResults).length > 0 && (
        <ResultDisplay title="유사도 결과" results={similarityResults} />
      )}

      
      <CombinedVectorVisualizer 
        original={parsedOriginal}
        compare1={parsedCompare1}
        compare2={parsedCompare2}
        keys={originalKeys} // originalKeys를 keys prop으로 전달
      />

    </div>
  );
}

export default Home;
