// src/components/KnockoutStage/BracketView.jsx
import React from 'react';
import './BracketView.css';

const BracketView = ({ knockoutData }) => {
  const { playoffRound, round16 } = knockoutData;

  const renderTeam = (team, isWinner = false) => {
    if (!team) return <div className="bracket-team empty">TBD</div>;
    
    return (
      <div className={`bracket-team ${isWinner ? 'winner' : ''}`}>
        <span className="team-name">{team.name}</span>
        <span className="team-score">
          {team.score !== undefined ? team.score : '-'}
        </span>
      </div>
    );
  };

  const renderMatch = (match, round) => {
    if (!match) return null;

    return (
      <div className={`bracket-match ${round}`}>
        <div className="bracket-teams">
          {renderTeam(match.homeTeam, match.winner?.name === match.homeTeam.name)}
          {renderTeam(match.awayTeam, match.winner?.name === match.awayTeam?.name)}
        </div>
        {match.homeScore !== undefined && match.awayScore !== undefined && (
          <div className="match-score">
            {match.homeScore} - {match.awayScore}
            {match.extraTimeHome !== undefined && (
              <span className="extra-time">
                (ET: {match.extraTimeHome}-{match.extraTimeAway})
              </span>
            )}
            {match.penaltiesHome !== undefined && (
              <span className="penalties">
                (Pen: {match.penaltiesHome}-{match.penaltiesAway})
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bracket-container">
      <div className="bracket-round playoff-round">
        <h3 className="round-title">Playoff Round</h3>
        <div className="matches-column">
          {playoffRound.map(match => renderMatch(match, 'playoff'))}
        </div>
      </div>

      <div className="bracket-connector">
        {playoffRound.map((_, index) => (
          <div key={index} className="connector-line" />
        ))}
      </div>

      <div className="bracket-round round-16">
        <h3 className="round-title">Round of 16</h3>
        <div className="matches-column">
          {round16.map(match => renderMatch(match, 'round16'))}
        </div>
      </div>
    </div>
  );
};

export default BracketView;
