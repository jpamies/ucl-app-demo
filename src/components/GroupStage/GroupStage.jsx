// src/components/GroupStage/GroupStage.jsx
import React from 'react';
import Standings from '../Standings/Standings';
import MatchesContainer from './components/MatchesContainer';
import LoadingError from './components/LoadingError';
import { useMatches } from './hooks/useMatches';
import { useStandings } from './hooks/useStandings';
import './GroupStage.css';

function GroupStage({ onStandingsUpdate }) {
  const {
    matches,
    isLoading,
    error,
    handleScoreChange,
    incrementScore,
    decrementScore,
    resetScores
  } = useMatches();

  const standings = useStandings(matches, onStandingsUpdate);

  if (isLoading || error) {
    return <LoadingError isLoading={isLoading} error={error} />;
  }

  return (
    <div className="group-stage">
      <Standings standings={standings} />
      <MatchesContainer
        matches={matches}
        onScoreChange={handleScoreChange}
        onIncrement={incrementScore}
        onDecrement={decrementScore}
        onReset={resetScores}
      />
    </div>
  );
}

export default GroupStage;
