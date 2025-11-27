/**
 * Game Constants
 * All game-related constants including scouts, drills, deals, penalties, and tactics
 */

import { Scout, DirtyDeal, TacticStyle, AggressionLevel, TrainingFocus } from '../types';

// Default user team ID
export const USER_TEAM_ID = 'valerenga';

// Scouting regions
export const REGIONS = [
  'Oslo Area',
  'Inlandet (Hamar/Lillehammer)',
  'West Coast',
  'Ostfold',
  'Northern Norway'
];

// Available scouts for hiring
export const AVAILABLE_SCOUTS: Scout[] = [
  { id: 's1', name: 'Bjørn "The Nose" Hansen', skill: 3, region: REGIONS[0], costPerWeek: 2 },
  { id: 's2', name: 'Kari "Eagle Eye" Johansen', skill: 5, region: REGIONS[1], costPerWeek: 3 },
  { id: 's3', name: 'Leif "The Wanderer" Olsen', skill: 7, region: REGIONS[2], costPerWeek: 4 },
  { id: 's4', name: 'Astrid "Icepick" Andersen', skill: 9, region: REGIONS[3], costPerWeek: 5 },
  { id: 's5', name: 'Tor "Gambler" Kristiansen', skill: 1, region: REGIONS[4], costPerWeek: 1 }
];

// Scout mishaps (random events when scouting)
export const SCOUT_MISHAPS = [
  "Scout got lost in the woods and missed the game",
  "Scout watched the wrong rink (bantam game instead of U18)",
  "Scout's notes fell in a puddle and are illegible",
  "Scout accidentally scouted a zamboni driver",
  "Scout was distracted by the kiosk hot dogs"
];

// Training drills
export const DRILLS = [
  { id: TrainingFocus.TECHNICAL, label: 'TECHNICAL', desc: 'Drills puck control & shooting.', icon: '🏒', boosts: 'SKILL', cost: 'STAMINA', tpCost: 2 },
  { id: TrainingFocus.PHYSICAL, label: 'PHYSICAL', desc: 'Suicide sprints & weights.', icon: '🏋️', boosts: 'STAMINA', cost: 'MORALE', tpCost: 2 },
  { id: TrainingFocus.TACTICAL, label: 'TACTICAL', desc: 'Film study & tactical drills.', icon: '🧠', boosts: 'POTENTIAL', cost: 'FOCUS', tpCost: 3 },
  { id: TrainingFocus.REST, label: 'REST', desc: 'Massage and video analysis.', icon: '🛌', boosts: 'MORALE', cost: 'NONE', tpCost: 0 },
  { id: TrainingFocus.GENERAL, label: 'BALANCED', desc: 'Standard team practice.', icon: '📋', boosts: 'MIXED', cost: 'LOW', tpCost: 1 }
];

// Dirty deals (high-risk scouting)
export const DIRTY_DEALS: DirtyDeal[] = [
  {
    id: 'dd1',
    label: 'Warehouse Wonderkid',
    description: 'Shady fixer claims he has a 90+ OVR prospect hidden away. Might be legit, might be a bust.',
    cost: 8,
    risk: 0.6,
    reward: 'elite',
    minSuccessChance: 5,
    maxSuccessChance: 9
  },
  {
    id: 'dd2',
    label: 'Refugee Roulette',
    description: 'New immigrant player, untested but raw talent. High ceiling, unknown floor.',
    cost: 4,
    risk: 0.4,
    reward: 'good',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd3',
    label: 'Bribed Scout Report',
    description: 'Steal a rival scout\'s top prospect list. Illegal? Maybe. Effective? Definitely.',
    cost: 6,
    risk: 0.5,
    reward: 'good',
    minSuccessChance: 1,
    maxSuccessChance: 5
  },
  {
    id: 'dd4',
    label: 'Late Bloomer Lottery',
    description: 'Older player (19) with chip on shoulder. Might dominate or disappear.',
    cost: 3,
    risk: 0.3,
    reward: 'average',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd5',
    label: 'Black Market Finn',
    description: 'Finnish prospect with "paperwork issues". No questions asked.',
    cost: 10,
    risk: 0.7,
    reward: 'elite',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd6',
    label: 'Injured Diamond',
    description: 'Star prospect recovering from injury. Could be steal of the century or career-ender.',
    cost: 5,
    risk: 0.5,
    reward: 'elite',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd7',
    label: 'Enforcer Exchange',
    description: 'Tough guy from rival team wants out. All muscle, questionable skill.',
    cost: 2,
    risk: 0.2,
    reward: 'enforcer',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd8',
    label: 'Swedish Shadow',
    description: 'Swedish import with attitude problem. Talented but volatile.',
    cost: 7,
    risk: 0.6,
    reward: 'good',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd9',
    label: 'Goalie Gambit',
    description: 'Unproven goalie with size advantage. Coin flip between starter and bust.',
    cost: 4,
    risk: 0.5,
    reward: 'goalie',
    minSuccessChance: 2,
    maxSuccessChance: 5
  },
  {
    id: 'dd10',
    label: 'Coach\'s Nephew',
    description: 'Nepotism special. Family connections, questionable talent.',
    cost: 1,
    risk: 0.8,
    reward: 'average',
    minSuccessChance: 2,
    maxSuccessChance: 5
  }
];

// Penalty reasons for in-game events
export const PENALTY_REASONS = [
  'Hooking',
  'Tripping',
  'Slashing',
  'Roughing',
  'Interference',
  'High Sticking',
  'Too Many Men'
];

// Tactical styles
export const TACTICAL_STYLES = [
  { id: TacticStyle.BALANCED, label: 'Balanced', desc: 'Standard playstyle.' },
  { id: TacticStyle.DUMP_AND_CHASE, label: 'Dump & Chase', desc: 'Safe, low risk.' },
  { id: TacticStyle.SKILL_CYCLE, label: 'Skill Cycle', desc: 'Possession based.' },
  { id: TacticStyle.COUNTER_ATTACK, label: 'Counter Attack', desc: 'Exploit turnovers.' },
  { id: TacticStyle.TRAP, label: 'Trap', desc: 'Defensive lockdown.' }
];

// Aggression levels
export const AGGRESSION_LEVELS = [
  { id: AggressionLevel.LOW, label: 'Disciplined', desc: 'Avoid penalties.' },
  { id: AggressionLevel.MEDIUM, label: 'Normal', desc: 'Standard checking.' },
  { id: AggressionLevel.HIGH, label: 'Physical', desc: 'Finish checks.' },
  { id: AggressionLevel.ENFORCER, label: 'Enforcer', desc: 'Intimidate opponents.' }
];
