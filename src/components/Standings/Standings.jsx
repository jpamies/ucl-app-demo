import React from 'react';
import './Standings.css';

const Standings = ({ standings }) => {
  return (
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
  );
};

export default Standings;
