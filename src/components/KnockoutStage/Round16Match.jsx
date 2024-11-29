// src/components/KnockoutStage/Round16Match.jsx
import React, { useState } from 'react';
import { determineWinner } from './utils';

const Round16Match = ({ match, onResultSubmit }) => {
  const [scores, setScores] = useState({
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    extraTimeHome: match.extraTimeHome,
    extraTimeAway: match.extraTimeAway,
    penaltiesHome: match.penaltiesHome,
    penaltiesAway: match.penaltiesAway
  });

  const handleScoreChange = (field, value) => {
    if (!match.awayTeam) return; // Don't allow score changes if away team isn't set

    const numValue = parseInt(value) || 0;
    const newScores = { ...scores, [field]: numValue };
    setScores(newScores);
    
    const winner = determineWinner({
      ...match,
      ...newScores
    }, true);

    if (winner) {
      onResultSubmit(match.id, { ...newScores, winner });
    }
  };

  return (
    <div className="match-card round16">
      <div className="match-teams">
        <div className={`team home ${match.winner?.name === match.homeTeam.name ? 'winner' : ''}`}>
          <span className="team-name">{match.homeTeam.name}</span>
          <span className="team-rank">Rank: {match.homeTeam.rank}</span>
        </div>
        
        <div className="match-scores">
          {match.awayTeam ? (
            <>
              <div className="regular-time">
                <input
                  type="number"
                  min="0"
                  value={scores.homeScore || ''}
                  onChange={(e) => handleScoreChange('homeScore', e.target.value)}
                  placeholder="0"
                />
                <span className="score-separator">:</span>
                <input
                  type="number"
                  min="0"
                  value={scores.awayScore || ''}
                  onChange={(e) => handleScoreChange('awayScore', e.target.value)}
                  placeholder="0"
                />
              </div>

              {scores.homeScore === scores.awayScore && scores.homeScore !== undefined && (
                <>
                  <div className="extra-time">
                    <small>ET</small>
                    <input
                      type="number"
                      min="0"
                      value={scores.extraTimeHome || ''}
                      onChange={(e) => handleScoreChange('extraTimeHome', e.target.value)}
                      placeholder="0"
                    />
                    <span className="score-separator">:</span>
                    <input
                      type="number"
                      min="0"
                      value={scores.extraTimeAway || ''}
                      onChange={(e) => handleScoreChange('extraTimeAway', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  {scores.extraTimeHome === scores.extraTimeAway && scores.extraTimeHome !== undefined && (
                    <div className="penalties">
                      <small>Pen</small>
                      <input
                        type="number"
                        min="0"
                        value={scores.penaltiesHome || ''}
                        onChange={(e) => handleScoreChange('penaltiesHome', e.target.value)}
                        placeholder="0"
                      />
                      <span className="score-separator">:</span>
                      <input
                        type="number"
                        min="0"
                        value={scores.penaltiesAway || ''}
                        onChange={(e) => handleScoreChange('penaltiesAway', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="awaiting-winner">
              Awaiting playoff winner
            </div>
          )}
        </div>

        <div className={`team away ${match.winner?.name === match.awayTeam?.name ? 'winner' : ''}`}>
          {match.awayTeam ? (
            <>
              <span className="team-name">{match.awayTeam.name}</span>
              <span className="team-rank">Rank: {match.awayTeam.rank}</span>
            </>
          ) : (
            <span className="team-name placeholder">TBD</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Round16Match;
