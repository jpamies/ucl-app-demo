// src/components/KnockoutStage/BracketView.jsx
import React from 'react';
import './BracketView.css';

const BracketView = ({ matches }) => {
  // Organize matches by round
  const playOff = matches.filter(m => m.round === 'R32');
  const roundOf16 = matches.filter(m => m.round === 'R16');
  const quarterFinals = matches.filter(m => m.round === 'QF');
  const semiFinals = matches.filter(m => m.round === 'SF');
  const final = matches.filter(m => m.round === 'F');

  return (
    <div className="bracket">
      <div className="bracket-round round-32">
        <h3>Runner up playoff</h3>
        <div className="matches">
          {playOff.map((match, index) => (
             <React.Fragment key={index}>
            <div key={index} className="match-box">
              <div className={`team ${match.winner === match.homeTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.homeTeam}</span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div className={`team ${match.winner === match.awayTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.awayTeam}</span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
             
            {index === 3 && <hr className="bracket-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bracket-round round-16">
        <h3>Round of 16</h3>
        <div className="matches">
          {roundOf16.map((match, index) => (             
            <React.Fragment key={index}>
            <div key={index} className="match-box">
              <div className={`team ${match.winner === match.homeTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.homeTeam}</span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div className={`team ${match.winner === match.awayTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.awayTeam}</span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
            {index === 3 && <hr className="bracket-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bracket-round quarter-finals">
        <h3>Quarter Finals</h3>
        <div className="matches">
          {quarterFinals.map((match, index) => (
                        <React.Fragment key={index}>
            <div key={index} className="match-box">
              <div className={`team ${match.winner === match.homeTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.homeTeam}</span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div className={`team ${match.winner === match.awayTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.awayTeam}</span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
                        {index === 2 && <hr className="bracket-divider" />}
                        </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bracket-round semi-finals">
        <h3>Semi Finals</h3>
        <div className="matches">
          {semiFinals.map((match, index) => (
            <div key={index} className="match-box">
              <div className={`team ${match.winner === match.homeTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.homeTeam}</span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div className={`team ${match.winner === match.awayTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.awayTeam}</span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bracket-round final">
        <h3>Final</h3>
        <div className="matches">
          {final.map((match, index) => (
            <div key={index} className="match-box final-match">
              <div className={`team ${match.winner === match.homeTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.homeTeam}</span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div className={`team ${match.winner === match.awayTeam ? 'winner' : ''}`}>
                <span className="team-name">{match.awayTeam}</span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BracketView;
