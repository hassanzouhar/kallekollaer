
export enum Position {
  GOALIE = 'G',
  DEFENDER = 'D',
  FORWARD = 'F',
  CENTER = 'C'
}

export type LineAssignment = 'L1' | 'L2' | 'L3' | 'L4' | 'G1' | 'G2' | 'BENCH';

export enum PlayerPersonality {
  SNIPER = 'SNIPER',       // Bonus to scoring
  PLAYMAKER = 'PLAYMAKER', // Bonus to assists/vision
  GRINDER = 'GRINDER',     // Bonus to defense/fatigue drain on opponent
  ENFORCER = 'ENFORCER',   // High aggression, protects stars
  TWOWAY = 'TWOWAY',       // Balanced, reliable
  NONE = 'NONE'
}

export enum TrainingFocus {
  GENERAL = 'GENERAL',
  TECHNICAL = 'TECHNICAL', // Boosts Skill
  PHYSICAL = 'PHYSICAL',   // Boosts Stamina
  TACTICAL = 'TACTICAL',   // Boosts Potential (Small chance) / Intelligence
  REST = 'REST'            // Boosts Morale, recovers Energy
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  
  // Core Stats
  skill: number; // 0-100 (Overall Ability)
  potential: number; // 0-100 (Max Ability)
  stamina: number; // 0-100 (Match Condition)
  fatigue: number; // 0-100 (Long term tiredness)
  morale: number; // 0-100
  age: number; // 15-18
  
  // Tactical
  line: LineAssignment;
  personality: PlayerPersonality;

  // New Detailed Attributes
  aggression: number; // 0-100 (Likelihood of penalties/hits)
  vision: number; // 0-100 (Assist chance)
  puckHandling: number; // 0-100 (Goal/Deplay chance)

  // Career/Season Stats
  goals: number;
  assists: number;
  shots: number; // Shots on Goal
  pim: number; // Penalties in Minutes
  
  // Management
  trainingFocus: TrainingFocus;
  isInjured: boolean;
  injuryWeeksLeft: number;
}

export enum StaffRole {
  HEAD_COACH = 'HEAD_COACH',
  ASSISTANT = 'ASSISTANT',
  FIXER = 'FIXER'
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  level: number; // 1-10
  specialty: string; // Flavor text
}

export interface ClubUpgrades {
  equipmentLevel: number; // 0-5, Boosts in-game skill
  swagLevel: number;      // 0-5, Boosts morale recovery
  facilityLevel: number;  // 0-5, Boosts training xp
}

export enum TacticStyle {
  BALANCED = 'BALANCED',
  DUMP_AND_CHASE = 'DUMP_AND_CHASE',
  SKILL_CYCLE = 'SKILL_CYCLE',
  COUNTER_ATTACK = 'COUNTER_ATTACK',
  TRAP = 'TRAP'
}

export enum AggressionLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  ENFORCER = 'ENFORCER'
}

export interface Tactics {
  style: TacticStyle;
  aggression: AggressionLevel;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  colors: [string, string]; // Primary, Secondary hex
  roster: Player[];
  staff: StaffMember[];
  upgrades: ClubUpgrades;
  tactics: Tactics;
  wins: number;
  losses: number;
  draws: number; // Regulation draws
  otLosses: number; // Overtime/Shootout losses
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  wallet: number; // Currency: Pøkks
}

export interface MatchEvent {
  minute: number;
  description: string;
  type: 'GOAL' | 'PENALTY' | 'INFO' | 'FIGHT' | 'INJURY' | 'FACEOFF' | 'ROUGHING' | 'SHIFT';
  teamId?: string;
  playerId?: string;
  isPowerPlayGoal?: boolean;
  isShorthandedGoal?: boolean;
}

export interface Penalty {
  id: string;
  teamId: string;
  player: string;
  reason: string;
  minutesRemaining: number;
}

export interface PlayerStatUpdate {
    playerId: string;
    goals: number;
    assists: number;
    shots: number;
    pim: number;
    fatigueAdded: number;
    injuryWeeks?: number;
}

export interface MatchResult {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  playerStats: PlayerStatUpdate[]; // New field to pass individual stats back
  aiCommentary?: string;
  isOvertime: boolean;
  isShootout: boolean;
}

export interface Scout {
  id: string;
  name: string;
  region: string;
  costPerWeek: number;
  skill: number; // 1-10
}

export interface ScoutingReport {
  id: string;
  scoutName: string;
  player: Player;
  sourceTeamId?: string; // If undefined, it's a free agent/new find
  description: string;
  date: string;
}

export enum GameView {
  DASHBOARD = 'DASHBOARD',
  ROSTER = 'ROSTER',
  TRAINING = 'TRAINING',
  LEAGUE = 'LEAGUE',
  SCOUTING = 'SCOUTING',
  OFFICE = 'OFFICE',
  LOCKER_ROOM = 'LOCKER_ROOM',
  MATCH = 'MATCH',
  POST_MATCH = 'POST_MATCH'
}

export interface DirtyDeal {
  id: string;
  label: string;
  cost: number;
  description: string;
  minSuccessChance: number; // 0-1
  maxSuccessChance: number; // 0-1
}

// --- NEW SCHEDULE TYPES ---

export type SeasonPhase = 'REGULAR_SEASON' | 'PLAYOFFS' | 'OFFSEASON';

export interface ScheduledMatch {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  result?: {
    homeScore: number;
    awayScore: number;
    isOvertime: boolean;
    isShootout: boolean;
  };
}

export interface PlayoffSeries {
  id: string;
  roundName: string; // "Semi-Final", "Final"
  teamAId: string;
  teamBId: string;
  winnerId?: string;
  matches: ScheduledMatch[]; // Best of 1 for this retro version? Let's do single elimination for high stakes
}

// --- NEW CAREER TYPES ---

export enum GameState {
  ONBOARDING = 'ONBOARDING',
  SEASON = 'SEASON',
  OFFSEASON = 'OFFSEASON'
}

export interface JobOffer {
  id: string;
  teamId: string;
  teamName: string;
  signingBonus: number;
  expectations: string; // e.g. "Top 4 finish"
}
