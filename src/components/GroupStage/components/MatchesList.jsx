// src/components/GroupStage/components/MatchesList.jsx
import React, { useState, useEffect } from 'react';
import Round from '../../Round/Round';

function MatchesList({ rounds, matches, onScoreChange, onIncrement, onDecrement }) {
  const [expandedRounds, setExpandedRounds] = useState(new Set());

  useEffect(() => {
    if (matches.length > 0) {
      const roundsMap = new Map();
      matches.forEach(match => {
        if (!roundsMap.has(match.RoundNumber)) {
          roundsMap.set(match.RoundNumber, []);
        }
        roundsMap.get(match.RoundNumber).push(match);
      });

      const newExpandedRounds = new Set();
      roundsMap.forEach((roundMatches, roundNumber) => {
        if (!roundMatches.every(match => match.isLocked)) {
          newExpandedRounds.add(roundNumber);
        }
      });
      setExpandedRounds(newExpandedRounds);
    }
  }, [matches]);

  const toggleRound = (roundNumber) => {
    setExpandedRounds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roundNumber)) {
        newSet.delete(roundNumber);
      } else {
        newSet.add(roundNumber);
      }
      return newSet;
    });
  };

  return (
    <div className="matches-list">
      {rounds.map(roundNumber => {
        const roundMatches = matches.filter(m => m.RoundNumber === roundNumber);
        return (
          <Round
            key={roundNumber}
            round={roundNumber}
            matches={roundMatches}
            isExpanded={expandedRounds.has(roundNumber)}
            onToggle={() => toggleRound(roundNumber)}
            onScoreChange={onScoreChange}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        );
      })}
    </div>
  );
}

export default MatchesList;
