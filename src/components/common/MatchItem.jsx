import React, { useState, useEffect } from 'react';

function MatchItem({ match, prediction, onPredictionUpdate }) {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  useEffect(() => {
    if (prediction) {
      setHomeScore(prediction.homeScore);
      setAwayScore(prediction.awayScore);
    }
  }, [prediction]);

  const handleScoreUpdate = () => {
    if (homeScore !== '' && awayScore !== '') {
      onPredictionUpdate(match.id, {
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore)
      });
    }
  };

  if (match.isPlayed) {
    return (
      <div className="match-item played">
        <span className="team home">{match.homeTeam}</span>
        <span className="score">{match.homeScore} - {match.awayScore}</span>
        <span className="team away">{match.awayTeam}</span>
      </div>
    );
  }

  return (
    <div className="match-item prediction">
      <span className="team home">{match.homeTeam}</span>
      <input
        type="number"
        min="0"
        value={homeScore}
        onChange={(e) => setHomeScore(e.target.value)}
        onBlur={handleScoreUpdate}
      />
      <span>-</span>
      <input
        type="number"
        min="0"
        value={awayScore}
        onChange={(e) => setAwayScore(e.target.value)}
        onBlur={handleScoreUpdate}
      />
      <span className="team away">{match.awayTeam}</span>
    </div>
  );
}

export default MatchItem;
