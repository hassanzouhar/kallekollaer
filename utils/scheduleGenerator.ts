/**
 * Schedule Generator Utilities
 * Handles match schedule generation for the season
 */

import { Team, ScheduledMatch } from '../types';

/**
 * Generates a round-robin schedule for all teams
 * Each team plays every other team twice (home and away)
 */
export const generateSchedule = (teams: Team[]): ScheduledMatch[] => {
  const schedule: ScheduledMatch[] = [];
  let matchId = 1;
  let currentWeek = 1;

  // Round-robin algorithm: each team plays every other team twice
  const n = teams.length;
  const rounds = (n - 1) * 2; // Home and away

  for (let round = 0; round < rounds; round++) {
    const matchesThisRound: ScheduledMatch[] = [];

    for (let i = 0; i < n / 2; i++) {
      let home = (round + i) % n;
      let away = (n - 1 - i + round) % n;

      // Swap home/away for the second half of the season
      if (round >= (n - 1)) {
        [home, away] = [away, home];
      }

      matchesThisRound.push({
        id: `match-${matchId++}`,
        week: currentWeek,
        homeTeamId: teams[home].id,
        awayTeamId: teams[away].id,
        homeScore: 0,
        awayScore: 0,
        played: false
      });
    }

    schedule.push(...matchesThisRound);
    currentWeek++;
  }

  return schedule;
};

/**
 * Generates a playoff bracket schedule
 * Top 8 teams compete in a single-elimination tournament
 */
export const generatePlayoffSchedule = (teams: Team[], startWeek: number): ScheduledMatch[] => {
  // Sort teams by points
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    // Tiebreaker: goal differential
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });

  // Top 8 teams make playoffs
  const playoffTeams = sortedTeams.slice(0, 8);
  const schedule: ScheduledMatch[] = [];
  let matchId = 1000; // Start playoff match IDs at 1000

  // Quarterfinals (Week 1)
  const quarterfinals = [
    { home: 0, away: 7 }, // 1 vs 8
    { home: 3, away: 4 }, // 4 vs 5
    { home: 1, away: 6 }, // 2 vs 7
    { home: 2, away: 5 }  // 3 vs 6
  ];

  quarterfinals.forEach((matchup) => {
    schedule.push({
      id: `playoff-qf-${matchId++}`,
      week: startWeek,
      homeTeamId: playoffTeams[matchup.home].id,
      awayTeamId: playoffTeams[matchup.away].id,
      homeScore: 0,
      awayScore: 0,
      played: false,
      isPlayoff: true,
      round: 'Quarterfinal'
    });
  });

  return schedule;
};
