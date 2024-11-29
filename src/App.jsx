import React, { useState } from 'react';
import GroupStage from './components/GroupStage/GroupStage';
import './styles/main.css';

function App() {
  const [activeTab, setActiveTab] = useState('group');

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
          <GroupStage />
        ) : (
          <div className="knockout-phase">
            <h2>Knockout Phase</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
