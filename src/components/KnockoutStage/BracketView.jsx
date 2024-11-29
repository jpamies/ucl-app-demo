// src/components/KnockoutStage/BracketView.jsx
import React, { useState, useEffect } from 'react';
import { FaTrophy } from 'react-icons/fa';
import './BracketView.css';

const BracketView = ({ matches, round }) => {
  const [matchResults, setMatchResults] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);

  // Load saved results from localStorage based on the round
  useEffect(() => {
    const savedResults = localStorage.getItem(`matchWinners_${round}`);
    if (savedResults) {
      setMatchResults(JSON.parse(savedResults));
    }
  }, [round]);

  const handleWinnerSelection = (matchNumber, team, teamName) => {
    setPendingSelection({ matchNumber, team, teamName });
    setShowConfirmation(true);
  };

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(`matchWinners_${round}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const confirmWinnerSelection = () => {
    if (pendingSelection) {
      const { matchNumber, team, teamName } = pendingSelection;
      const updatedResults = {
        ...matchResults,
        [matchNumber]: {
          team,
          teamName,
          timestamp: new Date().toISOString()
        }
      };

      setMatchResults(updatedResults);
      saveToLocalStorage(updatedResults);
    }
    setShowConfirmation(false);
    setPendingSelection(null);
  };

  const clearResults = () => {
    setMatchResults({});
    localStorage.removeItem(`matchWinners_${round}`);
  };

  const getRoundTitle = () => {
    switch (round) {
      case 'R32':
        return 'Playoff Runners-up';
      case 'R16':
        return 'Round of 16';
      case 'QF':
        return 'Quarter Finals';
      case 'SF':
        return 'Semi Finals';
      case 'F':
        return 'Final';
      default:
        return '----';
    }
  };

  return (
    <div className="bracket">
      <div className="bracket-round">
        <div className="round-header">
          <h3>{getRoundTitle()}</h3>
          <button onClick={clearResults} className="clear-btn">
            Clear Results
          </button>
        </div>
        <div className="matches">
          {matches.map((match, index) => (
            <div key={match.matchNumber} className="match-box">
              <div className="match-info">
                <span className="match-number">Match {match.matchNumber}</span>
              </div>
              <div 
                className={`team ${matchResults[match.matchNumber]?.team === 'home' ? 'winner' : ''}`}
                onClick={() => handleWinnerSelection(match.matchNumber, 'home', match.homeTeam)}
              >
                <span className="team-name">
                  {match.homeTeam}
                  {matchResults[match.matchNumber]?.team === 'home' && (
                    <FaTrophy className="winner-icon" />
                  )}
                </span>
                <span className="score">{match.homeScore}</span>
              </div>
              <div 
                className={`team ${matchResults[match.matchNumber]?.team === 'away' ? 'winner' : ''}`}
                onClick={() => handleWinnerSelection(match.matchNumber, 'away', match.awayTeam)}
              >
                <span className="team-name">
                  {match.awayTeam}
                  {matchResults[match.matchNumber]?.team === 'away' && (
                    <FaTrophy className="winner-icon" />
                  )}
                </span>
                <span className="score">{match.awayScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h4>Confirm Winner</h4>
            <p>[{round}]  Are you sure you want to select {pendingSelection?.teamName} as the winner?</p>
            <div className="modal-actions">
              <button onClick={confirmWinnerSelection} className="confirm-btn">
                Confirm
              </button>
              <button onClick={() => setShowConfirmation(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketView;
