// src/components/GroupStage/components/MatchesContainer.jsx
import React from 'react';
import MatchesHeader from './MatchesHeader';
import MatchesList from './MatchesList';

function MatchesContainer({ matches, onScoreChange, onIncrement, onDecrement, onReset }) {
  const rounds = Array.from(new Set(matches.map(m => m.RoundNumber))).sort((a, b) => a - b);

  return (
    <div className="matches-container">
      <MatchesHeader onReset={onReset} />
      <MatchesList
        rounds={rounds}
        matches={matches}
        onScoreChange={onScoreChange}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />
    </div>
  );
}

export default MatchesContainer;
