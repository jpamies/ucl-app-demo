// src/components/GroupStage/hooks/useStandings.js
import { useMemo, useEffect } from 'react';

export function useStandings(matches, onStandingsUpdate) {
  const standings = useMemo(() => {
    const teamsMap = new Map();

    // Initialize teams first
    matches.forEach(match => {
      if (!teamsMap.has(match.HomeTeam)) {
        teamsMap.set(match.HomeTeam, {
          name: match.HomeTeam,
          group: match.Group || 'A',
          country: match.HomeTeamCountry || 'Unknown',
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
          group: match.Group || 'A',
          country: match.AwayTeamCountry || 'Unknown',
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        });
      }
    });

    // Calculate statistics for each match
    matches.forEach(match => {
      if (typeof match.HomeTeamScore === 'number' && typeof match.AwayTeamScore === 'number') {
        const homeTeam = teamsMap.get(match.HomeTeam);
        const awayTeam = teamsMap.get(match.AwayTeam);

        // Update matches played
        homeTeam.played++;
        awayTeam.played++;

        // Update goals
        homeTeam.goalsFor += match.HomeTeamScore;
        homeTeam.goalsAgainst += match.AwayTeamScore;
        awayTeam.goalsFor += match.AwayTeamScore;
        awayTeam.goalsAgainst += match.HomeTeamScore;

        // Update wins, draws, losses and points
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

    // Convert to array and sort
    return Array.from(teamsMap.values())
      .sort((a, b) => {
        // First sort by points
        if (b.points !== a.points) return b.points - a.points;
        
        // If points are equal, sort by goal difference
        const goalDiffA = a.goalsFor - a.goalsAgainst;
        const goalDiffB = b.goalsFor - b.goalsAgainst;
        if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
        
        // If goal difference is equal, sort by goals scored
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        
        // If everything is equal, sort alphabetically by team name
        return a.name.localeCompare(b.name);
      });
  }, [matches]);

  useEffect(() => {
    if (standings.length > 0) {
      onStandingsUpdate(standings);
    }
  }, [standings, onStandingsUpdate]);

  return standings;
}
