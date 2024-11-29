// src/types/knockout.ts
export interface KnockoutTeam {
    name: string;
    rank: number;
    group: string;
    country: string;
    qualificationType: 'direct' | 'playoff';
  }
  
  export interface PlayoffMatch {
    id: number;
    homeTeam: KnockoutTeam;
    awayTeam: KnockoutTeam;
    homeScore?: number;
    awayScore?: number;
    extraTimeHome?: number;
    extraTimeAway?: number;
    penaltiesHome?: number;
    penaltiesAway?: number;
    winner?: KnockoutTeam;
  }
  
  export interface Round16Match {
    id: number;
    homeTeam: KnockoutTeam;
    awayTeam: KnockoutTeam | null;
    homeScore?: number;
    awayScore?: number;
    extraTimeHome?: number;
    extraTimeAway?: number;
    penaltiesHome?: number;
    penaltiesAway?: number;
    winner?: KnockoutTeam;
  }
  
  export interface KnockoutStage {
    playoffRound: PlayoffMatch[];
    round16: Round16Match[];
  }
  