import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import CompareSong from './pages/CompareSong';

function App() {
  const getNavLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    padding: '10px 20px',
    color: isActive ? '#0056b3' : '#495057',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '3px solid #0056b3' : '3px solid transparent',
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <Router>
      <div style={{
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        maxWidth: 'none',
        margin: 0
      }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '30px',
          borderBottom: '1px solid #dee2e6'
        }}>
          <NavLink to="/" style={getNavLinkStyle}>유사도 비교</NavLink>
          <NavLink to="/compare-song" style={getNavLinkStyle}>곡 비교</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare-song" element={<CompareSong />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
