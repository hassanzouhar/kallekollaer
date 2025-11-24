
import { Team, Position, Player, Scout, TrainingFocus, StaffRole, TacticStyle, AggressionLevel, PlayerPersonality } from './types';

// Helper to generate random Norwegian-ish stats and names
const firstNames = ["Lars", "Ole", "Magnus", "Henrik", "Kristian", "Anders", "Jonas", "Håkon", "Eirik", "Fredrik", "Tor", "Bjørn", "Espen", "Geir", "Jens", "Kjetil", "Simen", "Sindre"];
const lastNames = ["Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen", "Karlsen", "Johnsen", "Solberg", "Berg", "Haugen", "Hagen"];

const generatePlayer = (position: Position, idPrefix: string, index: number, isWonderkid = false): Player => {
  const baseSkill = isWonderkid ? 60 : Math.floor(Math.random() * 40) + 30;
  const potential = isWonderkid ? Math.floor(Math.random() * 15) + 85 : baseSkill + Math.floor(Math.random() * 30);
  
  const aggression = Math.floor(Math.random() * 80) + 10;
  const vision = Math.floor(Math.random() * 60) + (baseSkill * 0.5);
  const puckHandling = Math.floor(Math.random() * 60) + (baseSkill * 0.5);
  const stamina = Math.floor(Math.random() * 30) + 60;

  // Simple personality logic
  let personality = PlayerPersonality.NONE;
  if (aggression > 75) personality = PlayerPersonality.ENFORCER;
  else if (vision > 70) personality = PlayerPersonality.PLAYMAKER;
  else if (baseSkill > 75) personality = PlayerPersonality.SNIPER;
  else if (stamina > 80) personality = PlayerPersonality.GRINDER;

  return {
    id: `${idPrefix}-p-${index}-${Date.now()}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    position,
    skill: baseSkill, 
    potential: Math.min(potential, 100),
    age: Math.floor(Math.random() * 3) + 16, // 16-18
    stamina,
    fatigue: 0,
    morale: 80,
    line: 'BENCH', // Default
    
    // New Detailed Attributes
    aggression,
    vision,
    puckHandling,
    personality,

    // Career/Season Stats
    goals: 0,
    assists: 0,
    shots: 0,
    pim: 0,
    
    // Management
    trainingFocus: TrainingFocus.GENERAL,
    isInjured: false,
    injuryWeeksLeft: 0
  };
};

export const createPlayer = generatePlayer; // Export for scouting

const createRoster = (teamId: string): Player[] => {
  const roster: Player[] = [];
  
  // 2 Goalies
  const g1 = generatePlayer(Position.GOALIE, teamId, 1); g1.line = 'G1';
  const g2 = generatePlayer(Position.GOALIE, teamId, 2); g2.line = 'G2';
  roster.push(g1, g2);

  // Defenders (6)
  const defenders = [];
  for(let i=0; i<6; i++) defenders.push(generatePlayer(Position.DEFENDER, teamId, i+3));
  // Sort by skill to assign lines
  defenders.sort((a,b) => b.skill - a.skill);
  defenders[0].line = 'L1'; defenders[1].line = 'L1';
  defenders[2].line = 'L2'; defenders[3].line = 'L2';
  defenders[4].line = 'L3'; defenders[5].line = 'L3';
  roster.push(...defenders);

  // Forwards/Centers (9)
  const attackers = [];
  for(let i=0; i<4; i++) attackers.push(generatePlayer(Position.CENTER, teamId, i+9));
  for(let i=0; i<5; i++) attackers.push(generatePlayer(Position.FORWARD, teamId, i+13));
  
  attackers.sort((a,b) => b.skill - a.skill);
  
  // Assign L1 (3), L2 (3), L3 (3)
  for(let i=0; i<attackers.length; i++) {
      if (i < 3) attackers[i].line = 'L1';
      else if (i < 6) attackers[i].line = 'L2';
      else if (i < 9) attackers[i].line = 'L3';
      else attackers[i].line = 'BENCH';
  }

  roster.push(...attackers);
  return roster;
};

const getDefaultTeamProps = (id: string) => ({
    staff: [
        { id: `coach-${id}`, name: 'Coach', role: StaffRole.HEAD_COACH, level: 1, specialty: 'General' },
        { id: `asst-${id}`, name: 'Asst', role: StaffRole.ASSISTANT, level: 1, specialty: 'Training' },
        { id: `fixer-${id}`, name: 'Fixer', role: StaffRole.FIXER, level: 1, specialty: 'Deals' }
    ],
    upgrades: { equipmentLevel: 0, swagLevel: 0, facilityLevel: 0 },
    tactics: { style: TacticStyle.BALANCED, aggression: AggressionLevel.MEDIUM }
});

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'valerenga',
    name: 'Vålerenga U18',
    city: 'Oslo',
    colors: ['#0000FF', '#FF0000'],
    roster: createRoster('valerenga'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('valerenga')
  },
  {
    id: 'storhamar',
    name: 'Storhamar U18',
    city: 'Hamar',
    colors: ['#FFFF00', '#0000FF'],
    roster: createRoster('storhamar'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('storhamar')
  },
  {
    id: 'oilers',
    name: 'Stavanger Oilers U18',
    city: 'Stavanger',
    colors: ['#000000', '#FFFFFF'],
    roster: createRoster('oilers'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('oilers')
  },
  {
    id: 'frisk',
    name: 'Frisk Asker U18',
    city: 'Asker',
    colors: ['#FFA500', '#000000'],
    roster: createRoster('frisk'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('frisk')
  },
  {
    id: 'lillehammer',
    name: 'Lillehammer U18',
    city: 'Lillehammer',
    colors: ['#FF0000', '#0000FF'],
    roster: createRoster('lillehammer'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('lillehammer')
  },
  {
    id: 'stjernen',
    name: 'Stjernen U18',
    city: 'Fredrikstad',
    colors: ['#FF0000', '#FFFFFF'],
    roster: createRoster('stjernen'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('stjernen')
  },
   {
    id: 'manglerud',
    name: 'Manglerud Star U18',
    city: 'Oslo',
    colors: ['#00FF00', '#000000'],
    roster: createRoster('manglerud'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('manglerud')
  },
   {
    id: 'lorenskog',
    name: 'Lørenskog U18',
    city: 'Lørenskog',
    colors: ['#FF0000', '#0000FF'],
    roster: createRoster('lorenskog'),
    wins: 0, losses: 0, draws: 0, otLosses: 0, points: 0, goalsFor: 0, goalsAgainst: 0,
    wallet: 10,
    ...getDefaultTeamProps('lorenskog')
  }
];

export const USER_TEAM_ID = 'valerenga';

export const REGIONS = ['Oslo Area', 'Inlandet (Hamar/Lillehammer)', 'West Coast', 'Ostfold', 'Northern Norway'];

export const AVAILABLE_SCOUTS: Scout[] = [
  { id: 's1', name: 'Jens Strakkølle', region: 'Oslo Area', costPerWeek: 1, skill: 3 },
  { id: 's2', name: 'Oddvar "The Eye" O', region: 'Inlandet', costPerWeek: 3, skill: 7 },
  { id: 's3', name: 'Kjell B. Kjell', region: 'West Coast', costPerWeek: 2, skill: 5 },
  { id: 's4', name: 'Rolf Rølp', region: 'Ostfold', costPerWeek: 1, skill: 2 },
  { id: 's5', name: 'Elite Einar', region: 'Any', costPerWeek: 5, skill: 9 },
];

export const SCOUT_MISHAPS = [
  "went to the pub instead of the rink and spent all his Pøkks.",
  "fell asleep on the bus and ended up in Sweden.",
  "forgot his glasses and scouted the Zamboni driver by mistake.",
  "got into an argument about waffle recipes and was banned from the arena.",
  "spent the travel budget on pølse i vaffel."
];

export const DRILLS = [
  { id: TrainingFocus.TECHNICAL, label: 'TECHNICAL', desc: 'Drills puck control & shooting.', icon: '🏒', boosts: 'SKILL', cost: 'STAMINA' },
  { id: TrainingFocus.PHYSICAL, label: 'PHYSICAL', desc: 'Suicide sprints & weights.', icon: '🏋️', boosts: 'STAMINA', cost: 'MORALE' },
  { id: TrainingFocus.REST, label: 'REST', desc: 'Massage and video analysis.', icon: '🛌', boosts: 'MORALE', cost: 'NONE' },
  { id: TrainingFocus.GENERAL, label: 'BALANCED', desc: 'Standard team practice.', icon: '📋', boosts: 'MIXED', cost: 'LOW' }
];
