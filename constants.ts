/**
 * Constants Module - Central Export File
 *
 * This file serves as the main entry point for all game constants and utilities.
 * It re-exports functionality from modular files for backward compatibility.
 *
 * New Structure:
 * - data/teams.json - Team data
 * - data/players.json - Player data
 * - data/goalies.json - Goalie data
 * - data/gameConstants.ts - Game constants (scouts, drills, penalties, etc.)
 * - utils/playerGenerator.ts - Player creation and attribute calculation
 * - utils/teamBuilder.ts - Team building and roster management
 * - utils/scheduleGenerator.ts - Match schedule generation
 */

// Re-export player generation utilities
export {
  assignPersonality,
  createPlayer,
  calculateSkaterAttributes,
  calculateGoalieAttributes
} from './utils/playerGenerator';

// Re-export team building utilities
export {
  INITIAL_TEAMS,
  replenishRosters
} from './utils/teamBuilder';

// Re-export schedule generation
export {
  generateSchedule,
  generatePlayoffSchedule
} from './utils/scheduleGenerator';

// Re-export game constants
export {
  USER_TEAM_ID,
  REGIONS,
  AVAILABLE_SCOUTS,
  SCOUT_MISHAPS,
  DRILLS,
  DIRTY_DEALS,
  PENALTY_REASONS,
  TACTICAL_STYLES,
  AGGRESSION_LEVELS
} from './data/gameConstants';

// Direct access to data (if needed)
export { default as teamsData } from './data/teams.json';
export { default as playersData } from './data/players.json';
export { default as goaliesData } from './data/goalies.json';
