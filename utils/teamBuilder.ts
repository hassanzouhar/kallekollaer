/**
 * Team Builder Utilities
 * Handles team construction from JSON data and roster management
 */

import { Team, Player, Position, TrainingFocus, StaffRole, TacticStyle, AggressionLevel } from '../types';
import { assignPersonality, createPlayer, calculateSkaterAttributes, calculateGoalieAttributes } from './playerGenerator';
import teamsData from '../data/teams.json';
import playersData from '../data/players.json';
import goaliesData from '../data/goalies.json';

/**
 * Builds all teams from JSON data with populated rosters
 */
export const buildTeamsFromData = (): Team[] => {
  const teams: Team[] = teamsData.map((teamData) => {
    return {
      id: teamData.id,
      name: teamData.name,
      city: teamData.city,
      colors: teamData.colors as [string, string],
      roster: [],
      wins: 0,
      losses: 0,
      draws: 0,
      otLosses: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      wallet: 10, // Default starter wallet
      staff: [
        {
          id: `coach-${teamData.id}`,
          name: 'Knut "The Whip" Knudsen',
          role: StaffRole.HEAD_COACH,
          level: 1,
          specialty: 'Old School'
        },
        {
          id: `asst-${teamData.id}`,
          name: 'Sven Svensen',
          role: StaffRole.ASSISTANT,
          level: 1,
          specialty: 'Drills'
        },
        {
          id: `fixer-${teamData.id}`,
          name: 'Rolf "Fixeren" Rolfsen',
          role: StaffRole.FIXER,
          level: 1,
          specialty: 'Deals'
        }
      ],
      upgrades: { equipmentLevel: 0, swagLevel: 0, facilityLevel: 0 },
      tactics: { style: TacticStyle.BALANCED, aggression: AggressionLevel.MEDIUM }
    };
  });

  // Populate rosters
  teams.forEach(team => {
    populateTeamRoster(team);
  });

  return teams;
};

/**
 * Populates a team's roster with players from JSON data and procedurally generated players
 */
function populateTeamRoster(team: Team): void {
  // 1. Add Goalies
  const teamGoalies = goaliesData.filter((g: any) => g.team === team.id);
  teamGoalies.forEach((goalieData: any, i: number) => {
    const skill = calculateGoalieAttributes(goalieData.stats.savePercent);
    const stamina = 100;

    team.roster.push({
      id: `real-g-${i}-${goalieData.name.replace(/\s/g, '')}`,
      name: goalieData.name,
      position: Position.GOALIE,
      skill,
      potential: Math.min(100, skill + 10),
      age: 16 + Math.floor(Math.random() * 3),
      stamina,
      fatigue: 0,
      morale: 80,
      line: i === 0 ? 'G1' : 'G2',
      aggression: 10,
      vision: 40,
      puckHandling: 40,
      goals: 0,
      assists: 0,
      shots: 0,
      pim: 0,
      trainingFocus: TrainingFocus.GENERAL,
      isInjured: false,
      injuryWeeksLeft: 0,
      personality: assignPersonality(skill, 10, 40, 40, stamina)
    });
  });

  // 2. Add Skaters
  const teamPlayers = playersData.filter((p: any) => p.team === team.id);
  // Sort by points to prioritize best players
  teamPlayers.sort((a: any, b: any) => b.stats.points - a.stats.points);

  const defendersNeeded = 8;
  let defendersCount = 0;

  teamPlayers.forEach((playerData: any, i: number) => {
    const attr = calculateSkaterAttributes({
      gamesPlayed: playerData.stats.gamesPlayed,
      points: playerData.stats.points,
      goals: playerData.stats.goals,
      penaltyMinutes: playerData.stats.penaltyMinutes,
      faceOffs: playerData.stats.faceOffs
    });

    let pos: Position = attr.pos;

    // Assign defenders since CSV lacks explicit position data
    if (defendersCount < defendersNeeded && (i > 6 || (pos !== Position.CENTER && Math.random() > 0.5))) {
      pos = Position.DEFENDER;
      defendersCount++;
    }

    const stamina = 80 + Math.floor(Math.random() * 20);

    team.roster.push({
      id: `real-p-${i}-${playerData.name.replace(/\s/g, '')}`,
      name: playerData.name,
      position: pos,
      skill: attr.skill,
      potential: Math.min(100, attr.skill + Math.floor(Math.random() * 15)),
      age: 16 + Math.floor(Math.random() * 3),
      stamina,
      fatigue: 0,
      morale: 80,
      line: 'BENCH',
      aggression: attr.aggression,
      vision: Math.floor(attr.skill * 0.8),
      puckHandling: attr.puckHandling,
      goals: 0,
      assists: 0,
      shots: 0,
      pim: 0,
      trainingFocus: TrainingFocus.GENERAL,
      isInjured: false,
      injuryWeeksLeft: 0,
      personality: assignPersonality(
        attr.skill,
        attr.aggression,
        Math.floor(attr.skill * 0.8),
        attr.puckHandling,
        stamina
      )
    });
  });

  // 3. Fill roster gaps with procedurally generated players
  fillRosterGaps(team);

  // 4. Assign lines based on skill
  assignLines(team);
}

/**
 * Fills roster gaps with procedurally generated players
 */
function fillRosterGaps(team: Team): void {
  // Ensure 2 Goalies
  while (team.roster.filter(p => p.position === Position.GOALIE).length < 2) {
    const p = createPlayer(Position.GOALIE, team.id, team.roster.length);
    const gCount = team.roster.filter(r => r.position === Position.GOALIE).length;
    p.line = gCount === 0 ? 'G1' : 'G2';
    team.roster.push(p);
  }

  // Ensure 8 Defenders (4 pairs)
  while (team.roster.filter(p => p.position === Position.DEFENDER).length < 8) {
    team.roster.push(createPlayer(Position.DEFENDER, team.id, team.roster.length));
  }

  // Ensure at least 22 total players (2G + 20 Skaters for 4 lines)
  while (team.roster.length < 22) {
    team.roster.push(createPlayer(Position.FORWARD, team.id, team.roster.length));
  }
}

/**
 * Assigns line positions to players based on skill level
 */
function assignLines(team: Team): void {
  const goalies = team.roster
    .filter(p => p.position === Position.GOALIE)
    .sort((a, b) => b.skill - a.skill);

  const defenders = team.roster
    .filter(p => p.position === Position.DEFENDER)
    .sort((a, b) => b.skill - a.skill);

  const attackers = team.roster
    .filter(p => p.position !== Position.GOALIE && p.position !== Position.DEFENDER)
    .sort((a, b) => b.skill - a.skill);

  // Assign Goalies
  if (goalies[0]) goalies[0].line = 'G1';
  if (goalies[1]) goalies[1].line = 'G2';
  for (let i = 2; i < goalies.length; i++) {
    goalies[i].line = 'BENCH';
  }

  // Assign Defenders (2 per line, 4 lines)
  defenders.forEach((p, i) => {
    if (i < 2) p.line = 'L1';
    else if (i < 4) p.line = 'L2';
    else if (i < 6) p.line = 'L3';
    else if (i < 8) p.line = 'L4';
    else p.line = 'BENCH';
  });

  // Assign Attackers (3 per line, 4 lines)
  attackers.forEach((p, i) => {
    if (i < 3) p.line = 'L1';
    else if (i < 6) p.line = 'L2';
    else if (i < 9) p.line = 'L3';
    else if (i < 12) p.line = 'L4';
    else p.line = 'BENCH';
  });
}

/**
 * Replenishes rosters by filling gaps with new procedurally generated players
 */
export const replenishRosters = (teams: Team[]): Team[] => {
  teams.forEach(team => {
    fillRosterGaps(team);
    assignLines(team);
  });
  return teams;
};

/**
 * Pre-built teams constant
 * This is initialized once and exported for use throughout the app
 */
export const INITIAL_TEAMS = buildTeamsFromData();
