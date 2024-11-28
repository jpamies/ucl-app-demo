import React, { useState, useEffect } from 'react';
import initialMatchesData from './data/dump.json';
import './styles/main.css';

function App() {
  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('matches');
    if (savedMatches) {
      return JSON.parse(savedMatches);
    }
    return initialMatchesData.map(match => ({
      ...match,
      HomeTeamScore: null,
      AwayTeamScore: null
    }));
  });

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

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

      if (match.HomeTeamScore !== null && match.HomeTeamScore !== undefined &&
          match.AwayTeamScore !== null && match.AwayTeamScore !== undefined) {
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
        if (match.MatchNumber === matchNumber) {
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
      if (match.MatchNumber === matchNumber) {
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
      if (match.MatchNumber === matchNumber) {
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

  const resetScores = () => {
    if (window.confirm('Are you sure you want to reset all scores?')) {
      const resetMatches = matches.map(match => ({
        ...match,
        HomeTeamScore: null,
        AwayTeamScore: null
      }));
      setMatches(resetMatches);
    }
  };

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
          {matches.map(match => (
            <div key={match.MatchNumber} className="match-item">
              <span className="team home">{match.HomeTeam}</span>
              <div className="score-container">
                <div className="score-spinner">
                  <button type="button" onClick={() => decrementScore(match.MatchNumber, 'home')}>-</button>
                  <input
                    type="number"
                    min="0"
                    value={match.HomeTeamScore ?? ''}
                    onChange={(e) => handleScoreChange(match.MatchNumber, 'home', e.target.value)}
                  />
                  <button type="button" onClick={() => incrementScore(match.MatchNumber, 'home')}>+</button>
                </div>
                <span className="score-separator">-</span>
                <div className="score-spinner">
                  <button type="button" onClick={() => decrementScore(match.MatchNumber, 'away')}>-</button>
                  <input
                    type="number"
                    min="0"
                    value={match.AwayTeamScore ?? ''}
                    onChange={(e) => handleScoreChange(match.MatchNumber, 'away', e.target.value)}
                  />
                  <button type="button" onClick={() => incrementScore(match.MatchNumber, 'away')}>+</button>
                </div>
              </div>
              <span className="team away">{match.AwayTeam}</span>
              <span className="match-date">
                {new Date(match.DateUtc).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
