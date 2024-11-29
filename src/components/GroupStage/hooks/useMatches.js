// src/components/GroupStage/hooks/useMatches.js
import { useState, useEffect } from 'react';
import { loadMatchesFromJson, updateMatchScore } from '../utils/matchUtils';

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const baseMatches = await loadMatchesFromJson();
        const savedMatches = localStorage.getItem('matches');
        
        if (savedMatches) {
          const parsedSavedMatches = JSON.parse(savedMatches);
          const mergedMatches = baseMatches.map(baseMatch => {
            const savedMatch = parsedSavedMatches.find(m => m.MatchNumber === baseMatch.MatchNumber);
            return baseMatch.isLocked ? baseMatch : (savedMatch || baseMatch);
          });
          setMatches(mergedMatches);
        } else {
          setMatches(baseMatches);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, []);

  useEffect(() => {
    if (matches.length > 0) {
      const matchesToSave = matches
        .filter(match => !match.isLocked && (match.HomeTeamScore !== null || match.AwayTeamScore !== null));
      
      if (matchesToSave.length > 0) {
        localStorage.setItem('matches', JSON.stringify(matchesToSave));
      }
    }
  }, [matches]);

  const handleScoreChange = (matchNumber, team, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMatches(prevMatches => 
        prevMatches.map(match => updateMatchScore(match, matchNumber, team, numValue))
      );
    }
  };

  const incrementScore = (matchNumber, team) => {
    setMatches(prevMatches => 
      prevMatches.map(match => {
        if (match.MatchNumber === matchNumber && !match.isLocked) {
          const currentScore = team === 'home' ? match.HomeTeamScore : match.AwayTeamScore;
          const newScore = (currentScore === null || currentScore === undefined) ? 1 : currentScore + 1;
          return updateMatchScore(match, matchNumber, team, newScore);
        }
        return match;
      })
    );
  };

  const decrementScore = (matchNumber, team) => {
    setMatches(prevMatches => 
      prevMatches.map(match => {
        if (match.MatchNumber === matchNumber && !match.isLocked) {
          const currentScore = team === 'home' ? match.HomeTeamScore : match.AwayTeamScore;
          const newScore = (currentScore === null || currentScore === undefined || currentScore === 0) ? 0 : currentScore - 1;
          return updateMatchScore(match, matchNumber, team, newScore);
        }
        return match;
      })
    );
  };

  const resetScores = async () => {
    if (window.confirm('Are you sure you want to reset all scores? Locked matches will not be affected.')) {
      try {
        localStorage.clear();
        setIsLoading(true);
        const matchesWithScores = await loadMatchesFromJson();
        setMatches(matchesWithScores);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    matches,
    isLoading,
    error,
    handleScoreChange,
    incrementScore,
    decrementScore,
    resetScores
  };
}
