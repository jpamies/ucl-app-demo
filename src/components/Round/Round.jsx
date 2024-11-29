import React from 'react';
import Match from '../Match/Match';
import './Round.css';

const Round = ({ 
  round, 
  matches, 
  isExpanded, 
  onToggle, 
  onScoreChange, 
  onIncrement, 
  onDecrement 
}) => {
  const getRoundDates = (matches) => {
    const dates = matches.map(match => new Date(match.DateUtc));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const isCompleted = matches.every(match => match.isLocked);
  const dateRange = getRoundDates(matches);

  return (
    <div className={`round-group ${isCompleted ? 'completed' : ''}`}>
      <div className="round-header" onClick={onToggle}>
        <div className="round-info">
          <h3>Round {round}</h3>
          <span className="round-dates">{dateRange}</span>
        </div>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className="round-matches">
          {matches.map(match => (
            <Match 
              key={match.MatchNumber} 
              match={match}
              onScoreChange={onScoreChange}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Round;
