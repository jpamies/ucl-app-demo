// src/App.jsx
import React, { useState, useCallback } from 'react';
import GroupStage from './components/GroupStage/GroupStage';
import KnockoutStage from './components/KnockoutStage/KnockoutStage';
import './styles/main.css';

function App() {
  const [activeTab, setActiveTab] = useState('group');
  const [standings, setStandings] = useState([]);

  const handleStandingsUpdate = useCallback((newStandings) => {
    setStandings(newStandings);
  }, []);

  return (
    <div className="app">
      <h1>UEFA Champions League 2024/25</h1>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => setActiveTab('group')}
        >
          Group Stage
        </button>
        <button 
          className={`tab-button ${activeTab === 'knockout' ? 'active' : ''}`}
          onClick={() => setActiveTab('knockout')}
        >
          Knockout Phase
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'group' ? (
          <GroupStage onStandingsUpdate={handleStandingsUpdate} />
        ) : (
          <KnockoutStage standings={standings} />
        )}
      </div>
    </div>
  );
}

export default App;
