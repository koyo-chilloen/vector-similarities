
// src/utils/similarity.js

// 벡터 파싱 함수
const parseVector = (input) => {
  try {
    // Remove brackets and split by comma, then trim each part
    const cleanedInput = input.replace(/[\[\]]/g, '');
    return cleanedInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
  } catch (e) {
    console.error("Error parsing vector:", input, e);
    return [];
  }
};

// 코사인 유사도 계산
const cosineSimilarity = (vec1, vec2) => {
  if (vec1.length === 0 || vec2.length === 0) return 0;
  if (vec1.length !== vec2.length) {
    console.warn("Vectors have different lengths for cosine similarity.");
    return 0; // 또는 에러 처리
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
};

// 유클리드 거리 계산
const euclideanDistance = (vec1, vec2) => {
  if (vec1.length === 0 || vec2.length === 0) return Infinity;
  if (vec1.length !== vec2.length) {
    console.warn("Vectors have different lengths for euclidean distance.");
    return Infinity; // 또는 에러 처리
  }

  let sumOfSquares = 0;
  for (let i = 0; i < vec1.length; i++) {
    sumOfSquares += (vec1[i] - vec2[i]) ** 2;
  }
  return Math.sqrt(sumOfSquares);
};

// 맨해튼 거리 계산
const manhattanDistance = (vec1, vec2) => {
  if (vec1.length === 0 || vec2.length === 0) return Infinity;
  if (vec1.length !== vec2.length) {
    console.warn("Vectors have different lengths for manhattan distance.");
    return Infinity; // 또는 에러 처리
  }

  let sumOfAbsoluteDifferences = 0;
  for (let i = 0; i < vec1.length; i++) {
    sumOfAbsoluteDifferences += Math.abs(vec1[i] - vec2[i]);
  }
  return sumOfAbsoluteDifferences;
};

export { parseVector, cosineSimilarity, euclideanDistance, manhattanDistance };
