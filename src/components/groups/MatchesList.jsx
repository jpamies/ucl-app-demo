import React from 'react';
import MatchItem from '../common/MatchItem';

function MatchesList({ matches, predictions, onPredictionUpdate }) {
  return (
    <div className="matches-list">
      {matches.map(match => (
        <MatchItem
          key={match.id}
          match={match}
          prediction={predictions[match.id]}
          onPredictionUpdate={onPredictionUpdate}
        />
      ))}
    </div>
  );
}

export default MatchesList;
