import React, { useState, useEffect } from 'react';
import './styles/main.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRounds, setExpandedRounds] = useState(new Set());

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRoundDates = (roundMatches) => {
    const dates = roundMatches.map(match => new Date(match.DateUtc));
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const loadMatchesFromJson = async () => {
    console.log('Attempting to fetch from:', `${process.env.PUBLIC_URL}/data/dump.json`);
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/dump.json`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to load matches data');
      }
      const initialMatchesData = await response.json();
      console.log('Data loaded successfully:', initialMatchesData);
      return initialMatchesData.map(match => {
        // Convert scores to numbers, handling null, undefined, and empty string cases
        const homeScore = match.HomeTeamScore === null || match.HomeTeamScore === undefined || match.HomeTeamScore === '' 
          ? null 
          : Number(match.HomeTeamScore);
        const awayScore = match.AwayTeamScore === null || match.AwayTeamScore === undefined || match.AwayTeamScore === '' 
          ? null 
          : Number(match.AwayTeamScore);

        return {
          ...match,
          // A match is locked if both scores are numbers (including 0)
          isLocked: homeScore !== null && awayScore !== null,
          // Set the converted scores
          HomeTeamScore: homeScore,
          AwayTeamScore: awayScore
        };
      });
    } catch (error) {
      console.error('Error in loadMatchesFromJson:', error);
      throw error;
    }
  };

  const isRoundCompleted = (roundMatches) => {
    return roundMatches.every(match => match.isLocked);
  };

  useEffect(() => {
    const loadMatches = async () => {
      try {
        console.log('Starting to load matches');
        const baseMatches = await loadMatchesFromJson();
        
        // Get saved matches from localStorage
        const savedMatches = localStorage.getItem('matches');
        if (savedMatches) {
          const parsedSavedMatches = JSON.parse(savedMatches);
          
          // Merge saved matches with base matches, keeping locked matches from base
          const mergedMatches = baseMatches.map(baseMatch => {
            const savedMatch = parsedSavedMatches.find(m => m.MatchNumber === baseMatch.MatchNumber);
            if (baseMatch.isLocked) {
              return baseMatch; // Keep locked match data from dump.json
            }
            return savedMatch || baseMatch; // Use saved match data if it exists, otherwise use base
          });
          
          setMatches(mergedMatches);
        } else {
          setMatches(baseMatches);
        }
      } catch (err) {
        console.error('Error in loadMatches:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, []);

  useEffect(() => {
    if (matches.length > 0) {
      // Only save unlocked matches with scores to localStorage
      const matchesToSave = matches.map(match => {
        if (match.isLocked) {
          return null; // Don't save locked matches
        }
        if (match.HomeTeamScore !== null || match.AwayTeamScore !== null) {
          return match;
        }
        return null;
      }).filter(Boolean); // Remove null entries

      if (matchesToSave.length > 0) {
        localStorage.setItem('matches', JSON.stringify(matchesToSave));
      }
    }
  }, [matches]);

  useEffect(() => {
    if (matches.length > 0) {
      // Group matches by round
      const roundsMap = new Map();
      matches.forEach(match => {
        if (!roundsMap.has(match.RoundNumber)) {
          roundsMap.set(match.RoundNumber, []);
        }
        roundsMap.get(match.RoundNumber).push(match);
      });

      // Set initial expanded state for incomplete rounds
      const newExpandedRounds = new Set();
      roundsMap.forEach((roundMatches, roundNumber) => {
        if (!isRoundCompleted(roundMatches)) {
          newExpandedRounds.add(roundNumber);
        }
      });
      setExpandedRounds(newExpandedRounds);
    }
  }, [matches]); // Only run when matches change

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

      // Check if both scores are numbers (including 0)
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
      const updatedMatches = matches.map(match => {
        if (match.MatchNumber === matchNumber && !match.isLocked) {
          return {
            ...match,
            [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: numValue
          };
        }
        return match;
      });
      setMatches(updatedMatches);
    }
  };

  const incrementScore = (matchNumber, team) => {
    const updatedMatches = matches.map(match => {
      if (match.MatchNumber === matchNumber && !match.isLocked) {
        const currentScore = team === 'home' ? match.HomeTeamScore : match.AwayTeamScore;
        const newScore = (currentScore === null || currentScore === undefined) ? 1 : currentScore + 1;
        return {
          ...match,
          [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: newScore
        };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const decrementScore = (matchNumber, team) => {
    const updatedMatches = matches.map(match => {
      if (match.MatchNumber === matchNumber && !match.isLocked) {
        const currentScore = team === 'home' ? match.HomeTeamScore : match.AwayTeamScore;
        const newScore = (currentScore === null || currentScore === undefined || currentScore === 0) ? 0 : currentScore - 1;
        return {
          ...match,
          [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: newScore
        };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const resetScores = async () => {
    if (window.confirm('Are you sure you want to reset all scores? Locked matches will not be affected.')) {
      try {
        // Clear localStorage
        localStorage.clear();
        
        // Set loading state to true while resetting
        setIsLoading(true);
        
        // Reload data from dump.json
        const matchesWithScores = await loadMatchesFromJson();
        setMatches(matchesWithScores);
        setIsLoading(false);
        
      } catch (err) {
        setError(err.message);
        console.error('Error reloading matches:', err);
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading matches...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const standings = calculateStandings();

  return (
    <div className="app">
      <h1>UEFA Champions League 2024/25</h1>
      
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
    </div>
  );
}

export default App;
