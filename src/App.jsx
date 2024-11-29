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

  const tabs = [
    { id: 'group', label: 'Group Stage' },
    { id: 'R32', label: 'Playoff Round' },
    { id: 'R16', label: 'Round of 16' },
    { id: 'QF', label: 'Quarter Finals' },
    { id: 'SF', label: 'Semi Finals' },
    { id: 'F', label: 'Final' }
  ];

  return (
    <div className="app">
      <h1>UEFA Champions League 2024/25</h1>
      
      <div className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'group' ? (
          <GroupStage onStandingsUpdate={handleStandingsUpdate} />
        ) : (
          <KnockoutStage 
            standings={standings} 
            round={activeTab}
          />
        )}
      </div>
    </div>
  );
}

export default App;
