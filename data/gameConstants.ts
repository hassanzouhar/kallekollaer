/**
 * Game Constants
 * All game-related constants including scouts, drills, deals, penalties, and tactics
 */

import { Scout, DirtyDeal, TacticStyle, AggressionLevel } from '../types';

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
  { id: 's1', name: 'Bjørn "The Nose" Hansen', skill: 3, region: REGIONS[0], salary: 2 },
  { id: 's2', name: 'Kari "Eagle Eye" Johansen', skill: 5, region: REGIONS[1], salary: 3 },
  { id: 's3', name: 'Leif "The Wanderer" Olsen', skill: 7, region: REGIONS[2], salary: 4 },
  { id: 's4', name: 'Astrid "Icepick" Andersen', skill: 9, region: REGIONS[3], salary: 5 },
  { id: 's5', name: 'Tor "Gambler" Kristiansen', skill: 1, region: REGIONS[4], salary: 1 }
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
  { name: 'Bag Skate Bonanza', cost: 1, effect: 'Stamina +3' },
  { name: 'Slap Shot Clinic', cost: 2, effect: 'Skill +2' },
  { name: 'Grit & Grind Session', cost: 1, effect: 'Aggression +2' },
  { name: 'Passing Precision', cost: 2, effect: 'Vision +2' },
  { name: 'Dangle Drills', cost: 2, effect: 'Puck Handling +2' }
];

// Dirty deals (high-risk scouting)
export const DIRTY_DEALS: DirtyDeal[] = [
  {
    id: 'dd1',
    title: 'Warehouse Wonderkid',
    description: 'Shady fixer claims he has a 90+ OVR prospect hidden away. Might be legit, might be a bust.',
    cost: 8,
    risk: 0.6,
    reward: 'elite'
  },
  {
    id: 'dd2',
    title: 'Refugee Roulette',
    description: 'New immigrant player, untested but raw talent. High ceiling, unknown floor.',
    cost: 4,
    risk: 0.4,
    reward: 'good'
  },
  {
    id: 'dd3',
    title: 'Bribed Scout Report',
    description: 'Steal a rival scout\'s top prospect list. Illegal? Maybe. Effective? Definitely.',
    cost: 6,
    risk: 0.5,
    reward: 'good'
  },
  {
    id: 'dd4',
    title: 'Late Bloomer Lottery',
    description: 'Older player (19) with chip on shoulder. Might dominate or disappear.',
    cost: 3,
    risk: 0.3,
    reward: 'average'
  },
  {
    id: 'dd5',
    title: 'Black Market Finn',
    description: 'Finnish prospect with "paperwork issues". No questions asked.',
    cost: 10,
    risk: 0.7,
    reward: 'elite'
  },
  {
    id: 'dd6',
    title: 'Injured Diamond',
    description: 'Star prospect recovering from injury. Could be steal of the century or career-ender.',
    cost: 5,
    risk: 0.5,
    reward: 'elite'
  },
  {
    id: 'dd7',
    title: 'Enforcer Exchange',
    description: 'Tough guy from rival team wants out. All muscle, questionable skill.',
    cost: 2,
    risk: 0.2,
    reward: 'enforcer'
  },
  {
    id: 'dd8',
    title: 'Swedish Shadow',
    description: 'Swedish import with attitude problem. Talented but volatile.',
    cost: 7,
    risk: 0.6,
    reward: 'good'
  },
  {
    id: 'dd9',
    title: 'Goalie Gambit',
    description: 'Unproven goalie with size advantage. Coin flip between starter and bust.',
    cost: 4,
    risk: 0.5,
    reward: 'goalie'
  },
  {
    id: 'dd10',
    title: 'Coach\'s Nephew',
    description: 'Nepotism special. Family connections, questionable talent.',
    cost: 1,
    risk: 0.8,
    reward: 'average'
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
  { value: TacticStyle.BALANCED, label: 'Balanced', description: 'Equal focus on offense and defense' },
  { value: TacticStyle.DUMP_AND_CHASE, label: 'Dump and Chase', description: 'Physical, forecheck heavy' },
  { value: TacticStyle.SKILL_CYCLE, label: 'Skill Cycle', description: 'Possession-based, technical play' },
  { value: TacticStyle.TRAP, label: 'The Trap', description: 'Defensive shell, counter-attack' },
  { value: TacticStyle.RUN_AND_GUN, label: 'Run and Gun', description: 'All-out offense, high risk/reward' }
];

// Aggression levels
export const AGGRESSION_LEVELS = [
  { value: AggressionLevel.LOW, label: 'Low', description: 'Clean play, avoid penalties' },
  { value: AggressionLevel.MEDIUM, label: 'Medium', description: 'Balanced physicality' },
  { value: AggressionLevel.HIGH, label: 'High', description: 'Physical, intimidating' },
  { value: AggressionLevel.ENFORCER, label: 'Enforcer', description: 'Maximum grit, lots of PIMs' }
];
