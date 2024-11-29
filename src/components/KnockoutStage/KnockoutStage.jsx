// src/components/KnockoutStage/KnockoutStage.jsx
import React, { useState, useEffect } from 'react';
import BracketView from './BracketView';
import './KnockoutStage.css';

const KnockoutStage = ({ standings }) => {
  const [knockoutMatches, setKnockoutMatches] = useState([]);

  useEffect(() => {
    // Generate initial knockout matches based on standings
    const top8Teams = standings.slice(0, 8);
    const top9_24 = standings.slice(8, 24);

    // Generate Round of Playoff matches
    const pOFFMatches = [];
    for (let i = 0; i < 8; i++) {
        pOFFMatches.push({
          round: 'R32',
          matchNumber: i + 1,
          homeTeam: top9_24[i].name,
          awayTeam: top9_24[15 - i].name,
          homeScore: null,
          awayScore: null,
          winner: null
        });
      }

    // Generate Round of 16 matches
    const round16Matches = [];
    for (let i = 0; i < 8; i++) {
      round16Matches.push({
        round: 'R16',
        matchNumber: i + 1,
        homeTeam: top8Teams[i].name,
        awayTeam: 'TBD',
        homeScore: null,
        awayScore: null,
        winner: null
      });
    }

    // Generate placeholder matches for later rounds
    const quarterFinals = Array(4).fill(null).map((_, i) => ({
      round: 'QF',
      matchNumber: i + 1,
      homeTeam: 'TBD',
      awayTeam: 'TBD',
      homeScore: null,
      awayScore: null,
      winner: null
    }));

    const semiFinals = Array(2).fill(null).map((_, i) => ({
      round: 'SF',
      matchNumber: i + 1,
      homeTeam: 'TBD',
      awayTeam: 'TBD',
      homeScore: null,
      awayScore: null,
      winner: null
    }));

    const final = [{
      round: 'F',
      matchNumber: 1,
      homeTeam: 'TBD',
      awayTeam: 'TBD',
      homeScore: null,
      awayScore: null,
      winner: null
    }];

    setKnockoutMatches([...pOFFMatches, ...round16Matches, ...quarterFinals, ...semiFinals, ...final]);
  }, [standings]);

  return (
    <div className="knockout-stage">
      <h2>Knockout Stage</h2>
      <BracketView matches={knockoutMatches} />
    </div>
  );
};

export default KnockoutStage;
