import React from 'react';
import './Match.css';

const Match = ({ match, onScoreChange, onIncrement, onDecrement }) => {
  return (
    <div className={`match-item ${match.isLocked ? 'locked' : ''}`}>
      <span className="team home">{match.HomeTeam}</span>
      <div className="score-container">
        <div className="score-spinner">
          <button 
            type="button" 
            onClick={() => onDecrement(match.MatchNumber, 'home')}
            disabled={match.isLocked}
          >-</button>
          <input
            type="number"
            min="0"
            value={match.HomeTeamScore !== null ? match.HomeTeamScore : ''}
            onChange={(e) => onScoreChange(match.MatchNumber, 'home', e.target.value)}
            disabled={match.isLocked}
          />
          <button 
            type="button" 
            onClick={() => onIncrement(match.MatchNumber, 'home')}
            disabled={match.isLocked}
          >+</button>
        </div>
        <span className="score-separator">-</span>
        <div className="score-spinner">
          <button 
            type="button" 
            onClick={() => onDecrement(match.MatchNumber, 'away')}
            disabled={match.isLocked}
          >-</button>
          <input
            type="number"
            min="0"
            value={match.AwayTeamScore !== null ? match.AwayTeamScore : ''}
            onChange={(e) => onScoreChange(match.MatchNumber, 'away', e.target.value)}
            disabled={match.isLocked}
          />
          <button 
            type="button" 
            onClick={() => onIncrement(match.MatchNumber, 'away')}
            disabled={match.isLocked}
          >+</button>
        </div>
      </div>
      <span className="team away">{match.AwayTeam}</span>
      <span className="match-date">
        {new Date(match.DateUtc).toLocaleDateString()}
      </span>
    </div>
  );
};

export default Match;
