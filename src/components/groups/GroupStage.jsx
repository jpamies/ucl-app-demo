import React from 'react';
import GroupStandings from './GroupStandings';
import MatchesList from './MatchesList';

function GroupStage({ group, matches, predictions, onPredictionUpdate }) {
  return (
    <div className="group-stage">
      <div className="group-header">
        <h2>Group {group}</h2>
      </div>
      <div className="group-content">
        <GroupStandings 
          group={group} 
          matches={matches} 
          predictions={predictions}
        />
        <MatchesList 
          matches={matches}
          predictions={predictions}
          onPredictionUpdate={onPredictionUpdate}
        />
      </div>
    </div>
  );
}

export default GroupStage;