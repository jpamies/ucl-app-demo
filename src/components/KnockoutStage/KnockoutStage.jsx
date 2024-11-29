import React, { useState, useEffect } from 'react';
import BracketView from './BracketView';
import './KnockoutStage.css';

const KnockoutStage = ({ standings, round }) => {
  const [knockoutMatches, setKnockoutMatches] = useState([]);
  const [savedMatches, setSavedMatches] = useState({});

  const generateMatches = () => {
    const top8Teams = standings.slice(0, 8);
    const top9_24 = standings.slice(8, 24);

    // Generate Round of Playoff matches
    const pOFFMatches = [];
    for (let i = 0; i < 8; i++) {
      const matchKey = `R32-${i + 1}`;
      const savedMatch = savedMatches[matchKey];
      pOFFMatches.push({
        round: 'R32',
        matchNumber: i + 1,
        homeTeam: top9_24[i].name,
        awayTeam: top9_24[15 - i].name,
        homeScore: savedMatch?.homeScore ?? null,
        awayScore: savedMatch?.awayScore ?? null,
        winner: savedMatch?.winner ?? null
      });
    }

    // Generate Round of 16 matches
    const round16Matches = [];
    for (let i = 0; i < 8; i++) {
      const matchKey = `R16-${i + 1}`;
      const savedMatch = savedMatches[matchKey];
      round16Matches.push({
        round: 'R16',
        matchNumber: i + 1,
        homeTeam: top8Teams[i].name,
        awayTeam: savedMatch?.awayTeam || 'TBD',
        homeScore: savedMatch?.homeScore ?? null,
        awayScore: savedMatch?.awayScore ?? null,
        winner: savedMatch?.winner ?? null
      });
    }

    // Generate placeholder matches for later rounds
    const quarterFinals = Array(4).fill(null).map((_, i) => {
      const matchKey = `QF-${i + 1}`;
      const savedMatch = savedMatches[matchKey];
      return {
        round: 'QF',
        matchNumber: i + 1,
        homeTeam: savedMatch?.homeTeam || 'TBD',
        awayTeam: savedMatch?.awayTeam || 'TBD',
        homeScore: savedMatch?.homeScore ?? null,
        awayScore: savedMatch?.awayScore ?? null,
        winner: savedMatch?.winner ?? null
      };
    });

    const semiFinals = Array(2).fill(null).map((_, i) => {
      const matchKey = `SF-${i + 1}`;
      const savedMatch = savedMatches[matchKey];
      return {
        round: 'SF',
        matchNumber: i + 1,
        homeTeam: savedMatch?.homeTeam || 'TBD',
        awayTeam: savedMatch?.awayTeam || 'TBD',
        homeScore: savedMatch?.homeScore ?? null,
        awayScore: savedMatch?.awayScore ?? null,
        winner: savedMatch?.winner ?? null
      };
    });

    const final = [{
      round: 'F',
      matchNumber: 1,
      homeTeam: savedMatches['F-1']?.homeTeam || 'TBD',
      awayTeam: savedMatches['F-1']?.awayTeam || 'TBD',
      homeScore: savedMatches['F-1']?.homeScore ?? null,
      awayScore: savedMatches['F-1']?.awayScore ?? null,
      winner: savedMatches['F-1']?.winner ?? null
    }];

    const getKnockoutMatches = (round) => {
      const matchesByRound = {
        'R32': pOFFMatches,
        'R16': round16Matches,
        'QF': quarterFinals,
        'SF': semiFinals,
        'F': final
      };
    
      return [...(matchesByRound[round] || [...pOFFMatches, ...round16Matches, ...quarterFinals, ...semiFinals, ...final])];
    };
    
    setKnockoutMatches(getKnockoutMatches(round));
  };

  // Handle match updates
  const handleMatchUpdate = (updatedMatch) => {
    const matchKey = `${updatedMatch.round}-${updatedMatch.matchNumber}`;
    setSavedMatches(prev => ({
      ...prev,
      [matchKey]: updatedMatch
    }));
  };

  // Effect for initial load and prop changes
  useEffect(() => {
    generateMatches();
  }, [standings, round, savedMatches]);

  // Effect for tab focus changes
  useEffect(() => {
    const handleFocus = () => {
      generateMatches();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  return (
    <BracketView 
      matches={knockoutMatches} 
      round={round} 
      onMatchUpdate={handleMatchUpdate}
    />
  );
};

export default KnockoutStage;
