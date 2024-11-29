// src/components/GroupStage/components/MatchesHeader.jsx
import React from 'react';

function MatchesHeader({ onReset }) {
  return (
    <div className="matches-header">
      <h2>Matches</h2>
      <button onClick={onReset} className="reset-button">
        Reset All Scores
      </button>
    </div>
  );
}

export default MatchesHeader;
