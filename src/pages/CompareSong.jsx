import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { DndContext } from '@dnd-kit/core';
import DraggableSong from '../components/DraggableSong';
import DropZone from '../components/DropZone';
import SimilarityResult from '../components/SimilarityResult';
import CombinedVectorVisualizer from '../components/CombinedVectorVisualizer'; // Import the visualizer
import { parseVector, cosineSimilarity, euclideanDistance, manhattanDistance } from '../utils/similarity';

function CompareSong() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [song1, setSong1] = useState(null);
  const [song2, setSong2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [vectorDataForVisualization, setVectorDataForVisualization] = useState(null); // New state for visualization data

  const [vectorKeys, setVectorKeys] = useState(null); // New state for vector keys
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Papa.parse('/song_data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const sortedSongs = results.data.sort((a, b) => a.title.localeCompare(b.title));
        setSongs(sortedSongs);
        setLoading(false);
      },
      error: (err) => {
        setError('CSV 파일을 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    });

    // Load vector_keys.json
    fetch('/vector_keys.json')
      .then(response => response.json())
      .then(data => setVectorKeys(data))
      .catch(err => console.error("Failed to load vector_keys.json", err));
  }, []);

  useEffect(() => {
    if (song1 && song2 && vectorKeys) { // Add vectorKeys to condition
      const categories = ['mood', 'advancedGenre',, 'movement', 'character'];
      const results = {};
      const visualizationData = {};

      categories.forEach(category => {
        let vec1 = parseVector(song1[category]);
        let vec2 = parseVector(song2[category]);

        if (vec1.length === 0 && vec2.length > 0) {
          vec1 = new Array(vec2.length).fill(0);
        } else if (vec2.length === 0 && vec1.length > 0) {
          vec2 = new Array(vec1.length).fill(0);
        }

        visualizationData[category] = { vec1, vec2 }; // Store parsed vectors for visualization

        if (vec1.length === vec2.length) {
          const cosSim = cosineSimilarity(vec1, vec2);
          const eucDist = euclideanDistance(vec1, vec2);
          const manDist = manhattanDistance(vec1, vec2);

          const eucSim = 1 / (1 + eucDist);
          const manSim = 1 / (1 + manDist);

          results[category] = {
            cosine: cosSim,
            euclidean: eucSim,
            manhattan: manSim,
          };
        } else {
          results[category] = {
            cosine: 'N/A',
            euclidean: 'N/A',
            manhattan: 'N/A',
          };
        }
      });
      setComparisonResult({
        song1Title: song1.title.replace('.mp3', ''),
        song2Title: song2.title.replace('.mp3', ''),
        results,
      });
      setVectorDataForVisualization(visualizationData); // Set visualization data
    } else {
      setComparisonResult(null);
      setVectorDataForVisualization(null); // Clear visualization data
    }
  }, [song1, song2, vectorKeys]); // Add vectorKeys to dependency array

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  const handleSongClick = (song) => {
    if (!song1) {
      setSong1(song);
    } else if (!song2) {
      setSong2(song);
    } else { // Both song1 and song2 are filled
      setSong2(song); // Replace song2 with the newly clicked song
    }
  };

  return (
    <div className="compare-song-container">
        {/* Left Column: Song List */}
        <div className="compare-song-left-column">
          <div className="drop-zone-container">
            <div className="selected-song-display" onClick={() => setSong1(null)}>
              {song1 ? song1.title.replace('.mp3', '') : '선택된 곡 1'}
            </div>
            <div className="selected-song-display" onClick={() => setSong2(null)}>
              {song2 ? song2.title.replace('.mp3', '') : '선택된 곡 2'}
            </div>
          </div>
          <h2>곡 목록</h2>
          <input
            type="text"
            placeholder="곡 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="song-search-input"
          />
          <div className="song-list">
            {songs
              .filter(song =>
                song.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(song => (
                <DraggableSong key={song.id} song={song} onClick={handleSongClick} />
              ))}
          </div>
        </div>

        {/* Right Column: Drop Zones, Results, Visualizations */}
        <div className="compare-song-right-column">
          <SimilarityResult result={comparisonResult} />

          {vectorDataForVisualization && (
            <div className="vector-visualization-wrapper">
              <h2>벡터 시각화</h2>
              <CombinedVectorVisualizer 
                original={vectorDataForVisualization.mood.vec1}
                compare1={vectorDataForVisualization.mood.vec2}
                title="Mood Vector Comparison"
                keys={vectorKeys?.mood}
              />
              <CombinedVectorVisualizer 
                original={vectorDataForVisualization.advancedGenre.vec1}
                compare1={vectorDataForVisualization.advancedGenre.vec2}
                title="Advanced Genre Vector Comparison"
                keys={vectorKeys?.advancedGenre}
              />
              <CombinedVectorVisualizer 
                original={vectorDataForVisualization.movement.vec1}
                compare1={vectorDataForVisualization.movement.vec2}
                title="Movement Vector Comparison"
                keys={vectorKeys?.movement}
              />
              <CombinedVectorVisualizer 
                original={vectorDataForVisualization.character.vec1}
                compare1={vectorDataForVisualization.character.vec2}
                title="Character Vector Comparison"
                keys={vectorKeys?.character}
              />
            </div>
          )}
        </div>
      </div>
  );
}

export default CompareSong;
