import React from 'react';
import '../styles/KnockoutMatch.css';

const KnockoutMatch = ({ match, round }) => {
  return (
    <div className="knockout-match">
      <div className="knockout-team">
        <span className="team-name">{match.team1.name || 'TBD'}</span>
        <div className="knockout-scores">
          <input 
            type="number" 
            value={match.team1.firstLeg ?? ''} 
            readOnly 
            placeholder="-"
          />
          <input 
            type="number" 
            value={match.team1.secondLeg ?? ''} 
            readOnly 
            placeholder="-"
          />
        </div>
      </div>
      <div className="knockout-team">
        <span className="team-name">{match.team2.name || 'TBD'}</span>
        <div className="knockout-scores">
          <input 
            type="number" 
            value={match.team2.firstLeg ?? ''} 
            readOnly 
            placeholder="-"
          />
          <input 
            type="number" 
            value={match.team2.secondLeg ?? ''} 
            readOnly 
            placeholder="-"
          />
        </div>
      </div>
    </div>
  );
};

export default KnockoutMatch;
