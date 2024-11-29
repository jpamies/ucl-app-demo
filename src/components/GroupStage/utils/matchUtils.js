// src/components/GroupStage/utils/matchUtils.js
export const loadMatchesFromJson = async () => {
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
  
  export const updateMatchScore = (match, matchNumber, team, value) => {
    if (match.MatchNumber === matchNumber && !match.isLocked) {
      return {
        ...match,
        [team === 'home' ? 'HomeTeamScore' : 'AwayTeamScore']: value
      };
    }
    return match;
  };
  
  export const calculateTeamStats = (homeScore, awayScore) => {
    if (typeof homeScore !== 'number' || typeof awayScore !== 'number') {
      return {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
    }
  
    const homeStats = {
      played: 1,
      won: homeScore > awayScore ? 1 : 0,
      drawn: homeScore === awayScore ? 1 : 0,
      lost: homeScore < awayScore ? 1 : 0,
      goalsFor: homeScore,
      goalsAgainst: awayScore,
      points: homeScore > awayScore ? 3 : homeScore === awayScore ? 1 : 0
    };
  
    const awayStats = {
      played: 1,
      won: awayScore > homeScore ? 1 : 0,
      drawn: homeScore === awayScore ? 1 : 0,
      lost: awayScore < homeScore ? 1 : 0,
      goalsFor: awayScore,
      goalsAgainst: homeScore,
      points: awayScore > homeScore ? 3 : homeScore === awayScore ? 1 : 0
    };
  
    return { homeStats, awayStats };
  };
  