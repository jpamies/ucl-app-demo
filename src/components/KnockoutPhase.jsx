import React from 'react';
import KnockoutMatch from './KnockoutMatch';
import '../styles/KnockoutPhase.css';

const KnockoutPhase = ({ knockoutMatches }) => {
  return (
    <div className="knockout-container">
      <div className="knockout-round">
        <h3>Round of 32</h3>
        <div className="knockout-matches">
          {knockoutMatches.roundOf32.matches.map((match, index) => (
            <KnockoutMatch 
              key={index} 
              match={match} 
              round="roundOf32"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnockoutPhase;
