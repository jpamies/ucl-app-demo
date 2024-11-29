// src/components/KnockoutStage/KnockoutStage.jsx
import React, { useState, useEffect } from 'react';
import { determineQualifiedTeams, generatePlayoffMatchups, generateRound16Matchups } from './utils';
import PlayoffMatch from './PlayoffMatch';
import Round16Match from './Round16Match';
import BracketView from './BracketView';
import './KnockoutStage.css';

const KnockoutStage = ({ standings }) => {
  const [knockoutData, setKnockoutData] = useState({
    playoffRound: [],
    round16: []
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'bracket'

  useEffect(() => {
    if (standings && standings.length > 0) {
      const { directQualifiers, playoffTeams } = determineQualifiedTeams(standings);
      const playoffMatchups = generatePlayoffMatchups(playoffTeams);
      
      setKnockoutData({
        playoffRound: playoffMatchups,
        round16: [] // Will be populated after playoff winners are determined
      });
    }
  }, [standings]);

  const handlePlayoffResult = (matchId, result) => {
    setKnockoutData(prev => {
      const updatedPlayoffRound = prev.playoffRound.map(match => {
        if (match.id === matchId) {
          return { ...match, ...result };
        }
        return match;
      });

      // If all playoff matches have winners, generate Round of 16
      const allPlayoffComplete = updatedPlayoffRound.every(match => match.winner);
      let updatedRound16 = prev.round16;

      if (allPlayoffComplete) {
        const playoffWinners = updatedPlayoffRound.map(match => match.winner);
        const { directQualifiers } = determineQualifiedTeams(standings);
        updatedRound16 = generateRound16Matchups(directQualifiers, playoffWinners);
      }

      return {
        playoffRound: updatedPlayoffRound,
        round16: updatedRound16
      };
    });
  };

  const handleRound16Result = (matchId, result) => {
    setKnockoutData(prev => ({
      ...prev,
      round16: prev.round16.map(match => 
        match.id === matchId ? { ...match, ...result } : match
      )
    }));
  };

  return (
    <div className="knockout-stage">
      <div className="knockout-header">
        <h2>Knockout Stage</h2>
        <div className="view-toggle">
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button 
            className={`view-button ${viewMode === 'bracket' ? 'active' : ''}`}
            onClick={() => setViewMode('bracket')}
          >
            Bracket View
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="knockout-rounds">
          <div className="playoff-round">
            <h3>Playoff Round</h3>
            <div className="matches-grid">
              {knockoutData.playoffRound.map(match => (
                <PlayoffMatch
                  key={match.id}
                  match={match}
                  onResultSubmit={handlePlayoffResult}
                />
              ))}
            </div>
          </div>

          {knockoutData.round16.length > 0 && (
            <div className="round-16">
              <h3>Round of 16</h3>
              <div className="matches-grid">
                {knockoutData.round16.map(match => (
                  <Round16Match
                    key={match.id}
                    match={match}
                    onResultSubmit={handleRound16Result}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <BracketView knockoutData={knockoutData} />
      )}
    </div>
  );
};

export default KnockoutStage;
