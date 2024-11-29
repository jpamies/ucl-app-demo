import React from 'react';
import '../styles/GroupStage.css';

const GroupStage = ({ standings, matches, expandedRounds, toggleRound, handleScoreChange, incrementScore, decrementScore, isRoundCompleted, getRoundDates, resetScores }) => {
  return (
    <>
      <div className="standings-container">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th className="team-column">Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr 
                key={team.name} 
                className={
                  index < 8 
                    ? 'qualification-zone' 
                    : index < 24 
                      ? 'knockout-playoff-zone' 
                      : ''
                }
              >
                <td>{index + 1}</td>
                <td className="team-column">{team.name}</td>
                <td>{team.played}</td>
                <td>{team.won}</td>
                <td>{team.drawn}</td>
                <td>{team.lost}</td>
                <td>{team.goalsFor}</td>
                <td>{team.goalsAgainst}</td>
                <td>{team.goalsFor - team.goalsAgainst}</td>
                <td className="points-column">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="matches-container">
        <div className="matches-header">
          <h2>Matches</h2>
          <button onClick={resetScores} className="reset-button">Reset All Scores</button>
        </div>

        <div className="matches-list">
          {Array.from(new Set(matches.map(m => m.RoundNumber))).sort((a, b) => a - b).map(roundNumber => {
            const roundMatches = matches.filter(m => m.RoundNumber === roundNumber);
            const isCompleted = isRoundCompleted(roundMatches);
            const isExpanded = expandedRounds.has(roundNumber);
            const dateRange = getRoundDates(roundMatches);

            return (
              <div key={roundNumber} className={`round-group ${isCompleted ? 'completed' : ''}`}>
                <div 
                  className="round-header" 
                  onClick={() => toggleRound(roundNumber)}
                >
                  <div className="round-info">
                    <h3>Round {roundNumber}</h3>
                    <span className="round-dates">{dateRange}</span>
                  </div>
                  <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
                
                {isExpanded && (
                  <div className="round-matches">
                    {roundMatches.map(match => (
                      <div key={match.MatchNumber} className={`match-item ${match.isLocked ? 'locked' : ''}`}>
                        <span className="team home">{match.HomeTeam}</span>
                        <div className="score-container">
                          <div className="score-spinner">
                            <button 
                              type="button" 
                              onClick={() => decrementScore(match.MatchNumber, 'home')}
                              disabled={match.isLocked}
                            >-</button>
                            <input
                              type="number"
                              min="0"
                              value={match.HomeTeamScore !== null ? match.HomeTeamScore : ''}
                              onChange={(e) => handleScoreChange(match.MatchNumber, 'home', e.target.value)}
                              disabled={match.isLocked}
                            />
                            <button 
                              type="button" 
                              onClick={() => incrementScore(match.MatchNumber, 'home')}
                              disabled={match.isLocked}
                            >+</button>
                          </div>
                          <span className="score-separator">-</span>
                          <div className="score-spinner">
                            <button 
                              type="button" 
                              onClick={() => decrementScore(match.MatchNumber, 'away')}
                              disabled={match.isLocked}
                            >-</button>
                            <input
                              type="number"
                              min="0"
                              value={match.AwayTeamScore !== null ? match.AwayTeamScore : ''}
                              onChange={(e) => handleScoreChange(match.MatchNumber, 'away', e.target.value)}
                              disabled={match.isLocked}
                            />
                            <button 
                              type="button" 
                              onClick={() => incrementScore(match.MatchNumber, 'away')}
                              disabled={match.isLocked}
                            >+</button>
                          </div>
                        </div>
                        <span className="team away">{match.AwayTeam}</span>
                        <span className="match-date">
                          {new Date(match.DateUtc).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GroupStage;
