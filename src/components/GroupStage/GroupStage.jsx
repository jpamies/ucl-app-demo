import React, { useState, useEffect } from 'react';
import Standings from '../Standings/Standings';
import Round from '../Round/Round';
import './GroupStage.css';

function GroupStage() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRounds, setExpandedRounds] = useState(new Set());

  const loadMatchesFromJson = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/dump.json`);
      if (!response.ok) {
        throw new Error('Failed to load matches data');
      }
      const initialMatchesData = await response.json();
      
      return initialMatchesData.map(match => {
        const homeScore = match.HomeTeamScore === null || match.HomeTeamScore === undefined || match.HomeTeamScore === '' 
          ? null 
          : Number(match.HomeTeamScore);
        const awayScore = match.AwayTeamScore === null || match.AwayTeamScore === undefined || match.AwayTeamScore === '' 
          ? null 
          : Number(match.AwayTeamScore);

        return {
          ...match,
          isLocked: homeScore !== null && awayScore !== null,
          HomeTeamScore: homeScore,
          AwayTeamScore: awayScore
        };
      });
    } catch (error) {
      throw error;
    }
  };

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

  const calculateStandings = () => {
    const teamsMap = new Map();

    matches.forEach(match => {
      if (!teamsMap.has(match.HomeTeam)) {
        teamsMap.set(match.HomeTeam, {
          name: match.HomeTeam,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        });
      }
      if (!teamsMap.has(match.AwayTeam)) {
        teamsMap.set(match.AwayTeam, {
          name: match.AwayTeam,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        });
      }

      if (typeof match.HomeTeamScore === 'number' && typeof match.AwayTeamScore === 'number') {
        const homeTeam = teamsMap.get(match.HomeTeam);
        const awayTeam = teamsMap.get(match.AwayTeam);

        homeTeam.played++;
        awayTeam.played++;

        homeTeam.goalsFor += match.HomeTeamScore;
        homeTeam.goalsAgainst += match.AwayTeamScore;
        awayTeam.goalsFor += match.AwayTeamScore;
        awayTeam.goalsAgainst += match.HomeTeamScore;

        if (match.HomeTeamScore > match.AwayTeamScore) {
          homeTeam.won++;
          homeTeam.points += 3;
          awayTeam.lost++;
        } else if (match.HomeTeamScore < match.AwayTeamScore) {
          awayTeam.won++;
          awayTeam.points += 3;
          homeTeam.lost++;
        } else {
          homeTeam.drawn++;
          awayTeam.drawn++;
          homeTeam.points++;
          awayTeam.points++;
        }
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goalsFor - a.goalsFor;
    });
  };

  const handleScoreChange = (matchNumber, team, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setMatches(prevMatches => 
        prevMatches.map(match => {
          if (match.MatchNumber === matchNumber && !match.isLocked) {
            return {
              ...match,
              [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: numValue
            };
          }
          return match;
        })
      );
    }
  };

  const incrementScore = (matchNumber, team) => {
    setMatches(prevMatches => 
      prevMatches.map(match => {
        if (match.MatchNumber === matchNumber && !match.isLocked) {
          const currentScore = team === 'home' ? match.HomeTeamScore : match.AwayTeamScore;
          const newScore = (currentScore === null || currentScore === undefined) ? 1 : currentScore + 1;
          return {
            ...match,
            [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: newScore
          };
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
          return {
            ...match,
            [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: newScore
          };
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

  if (isLoading) return <div className="loading">Loading matches...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const standings = calculateStandings();
  const rounds = Array.from(new Set(matches.map(m => m.RoundNumber))).sort((a, b) => a - b);

  return (
    <div className="group-stage">
      <Standings standings={standings} />

      <div className="matches-container">
        <div className="matches-header">
          <h2>Matches</h2>
          <button onClick={resetScores} className="reset-button">Reset All Scores</button>
        </div>

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
                onScoreChange={handleScoreChange}
                onIncrement={incrementScore}
                onDecrement={decrementScore}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupStage;
