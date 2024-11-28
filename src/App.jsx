import React, { useState, useEffect } from 'react';
import initialMatchesData from './data/dump.json';
import './styles/main.css';

function App() {
  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('matches');
    if (savedMatches) {
      return JSON.parse(savedMatches);
    }
    // Initialize matches with null scores if they don't exist
    return initialMatchesData.map(match => ({
      ...match,
      HomeTeamScore: null,
      AwayTeamScore: null
    }));
  });
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [newScore, setNewScore] = useState({ home: '', away: '' });

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

      // Only count matches with valid scores (not null or undefined)
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

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    if (selectedMatch && newScore.home !== '' && newScore.away !== '') {
      const updatedMatches = matches.map(match => {
        if (match.MatchNumber === selectedMatch.MatchNumber) {
          return {
            ...match,
            HomeTeamScore: parseInt(newScore.home),
            AwayTeamScore: parseInt(newScore.away)
          };
        }
        return match;
      });
      setMatches(updatedMatches);
      setSelectedMatch(null);
      setNewScore({ home: '', away: '' });
      localStorage.setItem('matches', JSON.stringify(updatedMatches));
    }
  };

  const resetScores = () => {
    if (window.confirm('Are you sure you want to reset all scores?')) {
      const resetMatches = matches.map(match => ({
        ...match,
        HomeTeamScore: null,
        AwayTeamScore: null
      }));
      setMatches(resetMatches);
      setSelectedMatch(null);
      setNewScore({ home: '', away: '' });
      localStorage.setItem('matches', JSON.stringify(resetMatches));
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
        
        {selectedMatch && (
          <form onSubmit={handleScoreSubmit} className="score-form">
            <h3>Enter Score</h3>
            <div className="score-inputs">
              <span className="team home">{selectedMatch.HomeTeam}</span>
              <input
                type="number"
                min="0"
                value={newScore.home}
                onChange={(e) => setNewScore({ ...newScore, home: e.target.value })}
                required
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                value={newScore.away}
                onChange={(e) => setNewScore({ ...newScore, away: e.target.value })}
                required
              />
              <span className="team away">{selectedMatch.AwayTeam}</span>
            </div>
            <div className="form-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setSelectedMatch(null)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="matches-list">
          {matches.map(match => (
            <div 
              key={match.MatchNumber} 
              className={`match-item ${!match.HomeTeamScore && !match.AwayTeamScore ? 'pending' : ''}`}
              onClick={() => {
                // Allow editing for matches without scores or with null/undefined scores
                if (!match.HomeTeamScore && !match.AwayTeamScore) {
                  setSelectedMatch(match);
                  setNewScore({ home: '', away: '' });
                }
              }}
              style={{ cursor: !match.HomeTeamScore && !match.AwayTeamScore ? 'pointer' : 'default' }}
            >
              <span className="team home">{match.HomeTeam}</span>
              <span className="score">
                {(match.HomeTeamScore || match.HomeTeamScore === 0) && (match.AwayTeamScore || match.AwayTeamScore === 0) ? 
                  `${match.HomeTeamScore} - ${match.AwayTeamScore}` : 
                  'Click to add score'}
              </span>
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
