/**
 * Player Generator Utilities
 * Handles procedural player generation and attribute assignment
 */

import { Player, Position, PlayerPersonality, TrainingFocus } from '../types';

/**
 * Assigns a personality type based on player attributes
 */
export const assignPersonality = (
  skill: number,
  aggression: number,
  vision: number,
  puckHandling: number,
  stamina: number
): PlayerPersonality => {
  if (aggression > 75 && skill < 60) return PlayerPersonality.ENFORCER;
  if (vision > 70 && puckHandling > 70) return PlayerPersonality.PLAYMAKER;
  if (skill > 75 && aggression < 50) return PlayerPersonality.SNIPER;
  if (stamina > 80 && aggression > 50) return PlayerPersonality.GRINDER;
  if (stamina > 70 && vision > 50 && aggression > 40) return PlayerPersonality.TWOWAY;
  return PlayerPersonality.NONE;
};

/**
 * Creates a procedurally generated player
 */
export const createPlayer = (
  position: Position,
  idPrefix: string,
  index: number,
  isWonderkid = false,
  scoutSkill = 0
): Player => {
  const firstNames = [
    'Lars', 'Ole', 'Magnus', 'Henrik', 'Kristian',
    'Anders', 'Jonas', 'Håkon', 'Eirik', 'Fredrik',
    'Sven', 'Erik', 'Bjørn', 'Tor', 'Leif'
  ];

  const lastNames = [
    'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen',
    'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen',
    'Berg', 'Dahl', 'Lund', 'Haugen', 'Bakke'
  ];

  // Scout skill (0-10) boosts base skill range
  const scoutBonus = scoutSkill * 3; // 0-30 bonus
  const baseSkill = isWonderkid
    ? 60 + scoutBonus
    : Math.floor(Math.random() * 40) + 30 + scoutBonus;

  const aggression = Math.floor(Math.random() * 60) + 20;
  const vision = Math.floor(Math.random() * 60) + 20;
  const puckHandling = Math.floor(Math.random() * 60) + 20;
  const stamina = Math.floor(Math.random() * 30) + 60;

  // Unique ID with random suffix to prevent duplicates
  const uniqueSuffix = Math.floor(Math.random() * 1000000);

  return {
    id: `${idPrefix}-proc-${index}-${Date.now()}-${uniqueSuffix}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    position,
    skill: Math.min(100, baseSkill),
    potential: Math.min(100, baseSkill + 20 + scoutSkill),
    age: Math.floor(Math.random() * 3) + 16,
    stamina,
    fatigue: 0,
    morale: 80,
    trainingPoints: 10,
    line: 'BENCH',
    aggression,
    vision,
    puckHandling,
    goals: 0,
    assists: 0,
    shots: 0,
    pim: 0,
    trainingFocus: TrainingFocus.GENERAL,
    isInjured: false,
    injuryWeeksLeft: 0,
    personality: assignPersonality(baseSkill, aggression, vision, puckHandling, stamina)
  };
};

/**
 * Calculate player attributes from real player stats
 */
export const calculateSkaterAttributes = (stats: {
  gamesPlayed: number;
  points: number;
  goals: number;
  penaltyMinutes: number;
  faceOffs: number;
}) => {
  const ppg = stats.points / (stats.gamesPlayed || 1);

  // Base skill driven by Points Per Game
  // Map 0 PPG -> 35 skill, 2.3 PPG -> 90 skill
  let skill = Math.min(95, 35 + (ppg * 25));

  // Aggression driven by PIM
  const aggression = Math.min(99, 20 + (stats.penaltyMinutes * 2));

  // Puck handling varies around skill level
  const puckHandling = Math.min(95, skill + (Math.random() * 10));

  // Position logic: if player takes faceoffs, likely a Center
  let pos = Position.FORWARD;
  if (stats.faceOffs > 10) pos = Position.CENTER;

  return { skill: Math.floor(skill), aggression, puckHandling, pos };
};

/**
 * Calculate goalie attributes from real goalie stats
 */
export const calculateGoalieAttributes = (savePercent: number) => {
  // Map 85% -> 60 skill, 94% -> 95 skill
  const skill = Math.max(50, Math.min(99, (savePercent - 80) * 5));
  return Math.floor(skill);
};
