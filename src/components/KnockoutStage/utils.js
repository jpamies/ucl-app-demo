// src/components/KnockoutStage/utils.js
export const determineQualifiedTeams = (standings) => {
    const qualifiedTeams = standings.slice(0, 24).map((team, index) => ({
      name: team.name,
      rank: index + 1,
      group: team.group || 'A', // Fallback group if not provided
      country: team.country || 'Unknown', // Fallback country if not provided
      qualificationType: index < 8 ? 'direct' : 'playoff'
    }));
  
    return {
      directQualifiers: qualifiedTeams.filter(team => team.qualificationType === 'direct'),
      playoffTeams: qualifiedTeams.filter(team => team.qualificationType === 'playoff')
    };
  };
  
  export const generatePlayoffMatchups = (playoffTeams) => {
    const highRankedTeams = playoffTeams.slice(0, 8); // Ranks 9-16
    const lowRankedTeams = playoffTeams.slice(8); // Ranks 17-24
    
    return highRankedTeams.map((homeTeam, index) => ({
      id: index + 1,
      homeTeam,
      awayTeam: lowRankedTeams[index],
      homeScore: undefined,
      awayScore: undefined,
      extraTimeHome: undefined,
      extraTimeAway: undefined,
      penaltiesHome: undefined,
      penaltiesAway: undefined
    }));
  };
  
  export const generateRound16Matchups = (directQualifiers, playoffWinners) => {
    const shuffledPlayoffWinners = shuffleWithRestrictions(playoffWinners);
    
    return directQualifiers.map((homeTeam, index) => ({
      id: index + 1,
      homeTeam,
      awayTeam: shuffledPlayoffWinners[index] || null,
      homeScore: undefined,
      awayScore: undefined,
      extraTimeHome: undefined,
      extraTimeAway: undefined,
      penaltiesHome: undefined,
      penaltiesAway: undefined
    }));
  };
  
  export const shuffleWithRestrictions = (teams, restrictions = { sameCountry: true, sameGroup: true }) => {
    const result = [];
    const available = [...teams];
    
    while (available.length > 0) {
      const validOpponents = available.filter(team => {
        if (!team) return false;
        if (result.length === 0) return true;
        if (restrictions.sameCountry && team.country === result[result.length - 1]?.country) return false;
        if (restrictions.sameGroup && team.group === result[result.length - 1]?.group) return false;
        return true;
      });
      
      if (validOpponents.length === 0) {
        // If no valid opponents, take any remaining team
        const index = Math.floor(Math.random() * available.length);
        result.push(available.splice(index, 1)[0]);
      } else {
        const index = Math.floor(Math.random() * validOpponents.length);
        const selectedTeam = validOpponents[index];
        result.push(selectedTeam);
        available.splice(available.indexOf(selectedTeam), 1);
      }
    }
    
    return result;
  };
  
  export const determineWinner = (match, includeExtraTime = false) => {
    if (!match.homeScore || !match.awayScore) return null;
    
    if (match.homeScore === match.awayScore) {
      if (includeExtraTime && match.extraTimeHome !== undefined && match.extraTimeAway !== undefined) {
        return match.extraTimeHome > match.extraTimeAway ? match.homeTeam : match.awayTeam;
      }
      if (match.penaltiesHome !== undefined && match.penaltiesAway !== undefined) {
        return match.penaltiesHome > match.penaltiesAway ? match.homeTeam : match.awayTeam;
      }
      return null; // No winner yet
    }
    return match.homeScore > match.awayScore ? match.homeTeam : match.awayTeam;
  };
  