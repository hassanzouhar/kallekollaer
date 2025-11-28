
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { RetroLayout } from './components/RetroLayout';
import { RetroButton } from './components/RetroButton';
import { RosterView } from './components/RosterView';
import { MatchSimulator } from './components/MatchSimulator';
import { ScoutingAndDeals } from './components/ScoutingAndDeals';
import { TrainingCamp } from './components/TrainingCamp';
import { FrontOffice } from './components/FrontOffice';
import { TacticsBoard } from './components/TacticsBoard';
import { LeagueView } from './components/LeagueView';
import { Onboarding } from './components/Onboarding';
import { ContractDesk } from './components/ContractDesk';
import { INITIAL_TEAMS, SCOUT_MISHAPS, createPlayer, generateSchedule, replenishRosters } from './constants';
import { Team, GameView, MatchResult, Scout, ScoutingReport, Position, TrainingFocus, Player, DirtyDeal, LineAssignment, StaffRole, TacticStyle, AggressionLevel, SeasonPhase, ScheduledMatch, PlayoffSeries, GameState, JobOffer } from './types';
import { getAssistantAdvice } from './services/groqService';
import { saveGame, loadGame, hasSaveGame, SaveGame, exportSaveGame } from './services/saveService';
import { Trophy, Users, Play, BarChart3, ScanSearch, HandCoins, Dumbbell, Building2, ClipboardList, Save, Download } from 'lucide-react';

// Helper: Apply match result to team stats
const applyMatchResult = (
  team: Team,
  myScore: number,
  opScore: number,
  isOt: boolean,
  userTeamId: string
): Team => {
  let pts = 0;
  let w = 0, l = 0, otl = 0, pokks = 0;

  if (myScore > opScore) {
    if (isOt) { pts = 2; w = 1; pokks = 1.5; }
    else { pts = 3; w = 1; pokks = 1.5; }
  } else {
    if (isOt) { pts = 1; otl = 1; pokks = 0.5; }
    else { l = 1; pokks = 0; }
  }

  return {
    ...team,
    wins: team.wins + w,
    losses: team.losses + l,
    otLosses: team.otLosses + otl,
    points: team.points + pts,
    goalsFor: team.goalsFor + myScore,
    goalsAgainst: team.goalsAgainst + opScore,
    wallet: team.id === userTeamId ? team.wallet + pokks : team.wallet
  };
};

// Main App Component
const App = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.ONBOARDING);
  const [view, setView] = useState<GameView>(GameView.DASHBOARD);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  
  // Career State
  const [userTeamId, setUserTeamId] = useState<string>(''); 
  const [dreamTeamId, setDreamTeamId] = useState<string>('');
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [seasonCount, setSeasonCount] = useState(1);

  // Season State
  const [schedule, setSchedule] = useState<ScheduledMatch[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [phase, setPhase] = useState<SeasonPhase>('REGULAR_SEASON');
  const [playoffSeries, setPlayoffSeries] = useState<PlayoffSeries[]>([]);

  const [lastMatchResult, setLastMatchResult] = useState<MatchResult | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [adviceCache, setAdviceCache] = useState<{[key: number]: string}>({});
  
  // Economy & Scouting State
  const [hiredScouts, setHiredScouts] = useState<Scout[]>([]);
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [dugnadCooldown, setDugnadCooldown] = useState(false);
  const [freeAgents, setFreeAgents] = useState<Player[]>([]);

  const [newsFeed, setNewsFeed] = useState<string[]>([]);

  const userTeam = teams.find(t => t.id === userTeamId) || teams[0]; // Safety fallback

  // Helper: Auto-save current game state
  const autoSaveGame = () => {
    const currentState: Omit<SaveGame, 'savedAt' | 'version'> = {
      gameState,
      view,
      userTeamId,
      dreamTeamId,
      seasonCount,
      jobOffers,
      teams,
      schedule,
      currentWeek,
      phase,
      playoffSeries,
      lastMatchResult,
      advice,
      adviceCache,
      hiredScouts,
      scoutingReports,
      dugnadCooldown,
      newsFeed,
      freeAgents
    };
    saveGame(currentState, true);
  };

  // Handler: Load saved game
  const handleContinueSave = () => {
    const savedGame = loadGame(true); // Try autosave first
    if (savedGame) {
      console.log('[App] Loading saved game...');
      setGameState(savedGame.gameState);
      setView(savedGame.view);
      setTeams(savedGame.teams);
      setUserTeamId(savedGame.userTeamId);
      setDreamTeamId(savedGame.dreamTeamId);
      setJobOffers(savedGame.jobOffers);
      setSeasonCount(savedGame.seasonCount);
      setSchedule(savedGame.schedule);
      setCurrentWeek(savedGame.currentWeek);
      setPhase(savedGame.phase);
      setPlayoffSeries(savedGame.playoffSeries);
      setLastMatchResult(savedGame.lastMatchResult);
      setAdvice(savedGame.advice);
      setAdviceCache(savedGame.adviceCache);
      setHiredScouts(savedGame.hiredScouts);
      setScoutingReports(savedGame.scoutingReports);
      setDugnadCooldown(savedGame.dugnadCooldown);
      setNewsFeed(savedGame.newsFeed);
      setFreeAgents(savedGame.freeAgents || []);
    }
  };

  // Init Schedule when season starts (or teams load if already in season)
  useEffect(() => {
      if (gameState === GameState.SEASON && schedule.length === 0 && phase === 'REGULAR_SEASON') {
          setSchedule(generateSchedule(teams));
      }
  }, [gameState, teams, phase]); // Re-run if teams change (new season)

  // Determine Next Opponent based on Schedule
  const currentMatch = schedule.find(m => (m.week === currentWeek || (phase === 'PLAYOFFS' && !m.played)) && (m.homeTeamId === userTeamId || m.awayTeamId === userTeamId));
  const nextOpponentId = currentMatch ? (currentMatch.homeTeamId === userTeamId ? currentMatch.awayTeamId : currentMatch.homeTeamId) : null;
  const nextOpponent = teams.find(t => t.id === nextOpponentId) || teams[0]; // Fallback

  // AI Optimization: Cache advice per week to reduce calls
  useEffect(() => {
    if (gameState === GameState.SEASON && view === GameView.DASHBOARD && phase === 'REGULAR_SEASON') {
        if (adviceCache[currentWeek]) {
            setAdvice(adviceCache[currentWeek]);
        } else {
             getAssistantAdvice(userTeam, nextOpponent).then(text => {
                setAdvice(text);
                setAdviceCache(prev => ({...prev, [currentWeek]: text}));
             });
        }
    }
  }, [gameState, view, userTeam, nextOpponent, currentWeek, adviceCache, phase]);

  const addNews = (msg: string) => {
      setNewsFeed(prev => [msg, ...prev].slice(0, 5));
  };

  // --- CAREER HANDLERS ---

  const handleOnboardingComplete = (starterId: string, dreamId: string) => {
      setUserTeamId(starterId);
      setDreamTeamId(dreamId);
      setGameState(GameState.SEASON);
      setSchedule(generateSchedule(teams));
      setView(GameView.DASHBOARD);

      // Auto-save after career starts
      setTimeout(() => autoSaveGame(), 100);
  };

  const handleSeasonEnd = () => {
      // Generate Offers
      const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
      const userRank = sortedTeams.findIndex(t => t.id === userTeamId);
      const offers: JobOffer[] = [];

      // 1. Better team offer if top half
      if (userRank < 6) {
          const betterTeams = sortedTeams.filter(t => t.id !== userTeamId && t.points > userTeam.points).slice(0, 2);
          betterTeams.forEach(t => {
              offers.push({ id: `job-${t.id}-${Date.now()}`, teamId: t.id, teamName: t.name, signingBonus: 10, expectations: 'Win Title' });
          });
      }
      
      // 2. Dream team offer if WON or Top 3
      if (userRank < 3 && userTeamId !== dreamTeamId) {
          const dreamTeam = teams.find(t => t.id === dreamTeamId);
          if (dreamTeam) {
              offers.push({ id: `dream-${Date.now()}`, teamId: dreamTeam.id, teamName: dreamTeam.name, signingBonus: 25, expectations: 'Dynasty' });
          }
      }

      // 3. Random other offer
      const randomTeam = teams.filter(t => t.id !== userTeamId && !offers.find(o => o.teamId === t.id))[0];
      if (randomTeam) offers.push({ id: `rand-${Date.now()}`, teamId: randomTeam.id, teamName: randomTeam.name, signingBonus: 5, expectations: 'Rebuild' });

      setJobOffers(offers);
      setGameState(GameState.OFFSEASON);
  };

  const startNewSeason = (newTeamId: string, signingBonus: number = 0) => {
      setUserTeamId(newTeamId);

      // Reset Season Data
      setCurrentWeek(1);
      setPhase('REGULAR_SEASON');
      setPlayoffSeries([]);
      setSchedule([]); // Will trigger re-gen
      setAdviceCache({});
      setLastMatchResult(null);
      setSeasonCount(prev => prev + 1);

      // Replenish Rosters (Age up, retire, recruit) and apply bonus
      const refreshedTeams = replenishRosters(teams).map(t =>
        t.id === newTeamId ? { ...t, wallet: t.wallet + signingBonus } : t
      );

      setTeams(refreshedTeams);
      setSchedule(generateSchedule(refreshedTeams));
      setGameState(GameState.SEASON);
      setView(GameView.DASHBOARD);

      // Auto-save after new season starts
      setTimeout(() => autoSaveGame(), 100);
  };

  // --- MATCH LOGIC ---

  const simulateMatchLogic = (home: Team, away: Team): { homeScore: number, awayScore: number, ot: boolean } => {
      const homeSkill = home.roster.reduce((a,b) => a + b.skill, 0) / home.roster.length;
      const awaySkill = away.roster.reduce((a,b) => a + b.skill, 0) / away.roster.length;
      
      const diff = homeSkill - awaySkill;
      let homeScore = Math.floor(Math.random() * 5);
      let awayScore = Math.floor(Math.random() * 5);
      
      if (diff > 5) homeScore += 1;
      if (diff > 10) homeScore += 2;
      if (diff < -5) awayScore += 1;
      if (diff < -10) awayScore += 2;

      if (Math.random() > 0.6) homeScore += 1;

      let ot = false;
      if (homeScore === awayScore) {
          ot = true;
          if (Math.random() > 0.5) homeScore++; else awayScore++;
      }
      
      return { homeScore, awayScore, ot };
  };

  const handleMatchComplete = (result: MatchResult) => {
    setLastMatchResult(result);
    
    // 1. Update User Match in Schedule
    if (currentMatch) {
        setSchedule(prev => prev.map(m => m.id === currentMatch.id ? {
            ...m,
            played: true,
            result: {
                homeScore: result.homeScore,
                awayScore: result.awayScore,
                isOvertime: result.isOvertime,
                isShootout: result.isShootout
            }
        } : m));
    }

    // 2. Update Stats (Only in Regular Season)
    let teamUpdates = [...teams];

    if (phase === 'REGULAR_SEASON') {
        const userHome = result.homeTeamId === userTeamId;
        const userScore = userHome ? result.homeScore : result.awayScore;
        const oppScore = userHome ? result.awayScore : result.homeScore;
        const isOt = result.isOvertime || result.isShootout;

        teamUpdates = teamUpdates.map(t => {
            if (t.id === userTeamId) return applyMatchResult(t, userScore, oppScore, isOt, userTeamId);
            if (t.id === nextOpponentId) return applyMatchResult(t, oppScore, userScore, isOt, userTeamId);
            return t;
        });
    }

    // 3. Simulate Other Matches (Only in Regular Season for now)
    if (phase === 'REGULAR_SEASON') {
        const otherMatches = schedule.filter(m => m.week === currentWeek && !m.played && m.id !== currentMatch?.id);
        const simulatedResults: ScheduledMatch[] = [];

        otherMatches.forEach(match => {
            const home = teams.find(t => t.id === match.homeTeamId)!;
            const away = teams.find(t => t.id === match.awayTeamId)!;
            const sim = simulateMatchLogic(home, away);

            simulatedResults.push({
                ...match,
                played: true,
                result: { homeScore: sim.homeScore, awayScore: sim.awayScore, isOvertime: sim.ot, isShootout: false }
            });

            teamUpdates = teamUpdates.map(t => {
                if (t.id === match.homeTeamId) return applyMatchResult(t, sim.homeScore, sim.awayScore, sim.ot, userTeamId);
                if (t.id === match.awayTeamId) return applyMatchResult(t, sim.awayScore, sim.homeScore, sim.ot, userTeamId);
                return t;
            });
        });

        setSchedule(prev => prev.map(m => {
            const sim = simulatedResults.find(s => s.id === m.id);
            return sim ? sim : m;
        }));
    }

    // 4. Playoff Progression Logic
    if (phase === 'PLAYOFFS') {
        const updatedSeries = playoffSeries.map(s => {
             // Check if this result belongs to this series
             const isMatchInSeries = s.matches.some(m => m.homeTeamId === result.homeTeamId && m.awayTeamId === result.awayTeamId) || 
                                     (s.teamAId === result.homeTeamId && s.teamBId === result.awayTeamId) ||
                                     (s.teamAId === result.awayTeamId && s.teamBId === result.homeTeamId);
             
             if (isMatchInSeries) {
                 const winnerId = result.homeScore > result.awayScore ? result.homeTeamId : result.awayTeamId;
                 return { ...s, winnerId };
             }
             return s;
        });
        setPlayoffSeries(updatedSeries);

        // Check if all Semis are done
        const semis = updatedSeries.filter(s => s.roundName === 'Semi-Final');
        const final = updatedSeries.find(s => s.roundName === 'Final');

        if (semis.length === 2 && semis.every(s => s.winnerId) && !final) {
             // Generate Final Match
             const winnerA = semis[0].winnerId!;
             const winnerB = semis[1].winnerId!;
             const finalMatch: ScheduledMatch = {
                 id: `final-${Date.now()}`,
                 week: 24,
                 homeTeamId: winnerA,
                 awayTeamId: winnerB,
                 played: false
             };
             setSchedule(prev => [...prev, finalMatch]);
             setPlayoffSeries(prev => [...prev, {
                 id: 'final',
                 roundName: 'Final',
                 teamAId: winnerA,
                 teamBId: winnerB,
                 matches: [finalMatch]
             }]);
             setCurrentWeek(24);
        } else if (final && final.winnerId) {
             // Season Over - Award Championship
             const championTeam = teamUpdates.find(t => t.id === final.winnerId);
             if (championTeam) {
                 championTeam.championships = (championTeam.championships || 0) + 1;
                 setTeams([...teamUpdates]);
             }
             setTimeout(() => {
                 alert(`SEASON OVER! CHAMPION: ${championTeam?.name}${championTeam?.championships && championTeam.championships > 1 ? ` (${championTeam.championships}x CHAMPION!)` : ''}`);
                 handleSeasonEnd();
             }, 2000);
        }
        
        // Auto-Simulate other playoff matches if they exist and user isn't in them
        // For simplicity, we assume user plays their match, and we auto-sim the other semi-final immediately if it exists
        if (!final) {
             const otherSemi = semis.find(s => s.teamAId !== userTeamId && s.teamBId !== userTeamId);
             if (otherSemi && !otherSemi.winnerId) {
                 const home = teams.find(t => t.id === otherSemi.teamAId)!;
                 const away = teams.find(t => t.id === otherSemi.teamBId)!;
                 const sim = simulateMatchLogic(home, away);
                 const simWinner = sim.homeScore > sim.awayScore ? home.id : away.id;
                 
                 setPlayoffSeries(prev => prev.map(s => s.id === otherSemi.id ? { ...s, winnerId: simWinner } : s));
                 // Note: We aren't displaying the non-user match in schedule for simplicity in this view, relying on Bracket View
             }
        }
    }

    // 5. Player Stat Updates (Applies to all phases)
    teamUpdates = teamUpdates.map(team => {
        const rosterUpdates = team.roster.map(player => {
            const updates = result.playerStats.find(u => u.playerId === player.id);
            if (updates) {
                return {
                    ...player,
                    goals: player.goals + updates.goals,
                    assists: player.assists + updates.assists,
                    shots: player.shots + updates.shots,
                    pim: player.pim + updates.pim,
                    careerGoals: (player.careerGoals || 0) + updates.goals,
                    careerAssists: (player.careerAssists || 0) + updates.assists,
                    careerGames: (player.careerGames || 0) + 1,
                    fatigue: Math.min(100, player.fatigue + updates.fatigueAdded),
                    isInjured: !!updates.injuryWeeks || player.isInjured,
                    injuryWeeksLeft: updates.injuryWeeks ? player.injuryWeeksLeft + updates.injuryWeeks : player.injuryWeeksLeft
                };
            }
            return player;
        });
        return { ...team, roster: rosterUpdates };
    });

    setTeams(teamUpdates);

    // 6. Advance Week (Regular Season)
    if (phase === 'REGULAR_SEASON') {
        if (currentWeek >= 22) {
            setPhase('PLAYOFFS');
            setupPlayoffs(teamUpdates);
            alert("REGULAR SEASON COMPLETE! PLAYOFFS BEGIN.");
            setView(GameView.LEAGUE);
        } else {
            setCurrentWeek(prev => prev + 1);
            processWeeklyEvents(teamUpdates);
            setDugnadCooldown(false);
            setView(GameView.DASHBOARD);
        }
    } else {
        // Playoffs: Stay on Match View or go to Dashboard
         setView(GameView.DASHBOARD);
    }

    // Auto-save after match complete
    setTimeout(() => autoSaveGame(), 100);
  };

  const setupPlayoffs = (currentTeams: Team[]) => {
      const sorted = [...currentTeams].sort((a, b) => b.points - a.points).slice(0, 4);
      
      // 1 vs 4
      const semi1Match: ScheduledMatch = {
          id: `sf1-${Date.now()}`,
          week: 23,
          homeTeamId: sorted[0].id,
          awayTeamId: sorted[3].id,
          played: false
      };
      
      // 2 vs 3
      const semi2Match: ScheduledMatch = {
          id: `sf2-${Date.now()}`,
          week: 23,
          homeTeamId: sorted[1].id,
          awayTeamId: sorted[2].id,
          played: false
      };

      setSchedule([semi1Match, semi2Match]);
      setCurrentWeek(23);

      setPlayoffSeries([
          { id: 'sf1', roundName: 'Semi-Final', teamAId: sorted[0].id, teamBId: sorted[3].id, matches: [semi1Match] },
          { id: 'sf2', roundName: 'Semi-Final', teamAId: sorted[1].id, teamBId: sorted[2].id, matches: [semi2Match] }
      ]);
  };

  const processWeeklyEvents = (currentTeams: Team[]) => {
    let updates = [...currentTeams];

    const wages = hiredScouts.reduce((acc, s) => acc + s.costPerWeek, 0);
    const facilityRent = 2; // Weekly facility maintenance cost
    updates = updates.map(t => t.id === userTeamId ? { ...t, wallet: Math.max(0, t.wallet - wages - facilityRent) } : t);

    const asstCoach = userTeam.staff?.find(s => s.role === StaffRole.ASSISTANT);
    const trainingBonusChance = asstCoach ? (asstCoach.level * 0.02) : 0;
    const swagBonus = userTeam.upgrades ? (userTeam.upgrades.swagLevel * 2) : 0;

    updates = updates.map(t => {
        if (t.id !== userTeamId) return t;
        const newRoster = t.roster.map(p => {
            let { skill, stamina, morale, fatigue, isInjured, injuryWeeksLeft, trainingFocus, potential, trainingPoints, age } = p;

            // Age factor: younger players (15-16) are more susceptible to burnout
            // Older players (17-18) handle training better
            const ageFactor = age <= 16 ? 1.5 : 1.0;

            if (isInjured) {
                injuryWeeksLeft = Math.max(0, injuryWeeksLeft - 1);
                if (injuryWeeksLeft === 0) isInjured = false;
                fatigue = Math.max(0, fatigue - 30);
            } else {
                fatigue = Math.max(0, fatigue - 15);

                // Get TP cost for current training focus
                const tpCost = {
                    [TrainingFocus.TECHNICAL]: 2,
                    [TrainingFocus.PHYSICAL]: 2,
                    [TrainingFocus.TACTICAL]: 3,
                    [TrainingFocus.REST]: 0,
                    [TrainingFocus.GENERAL]: 1
                }[trainingFocus] || 0;

                // Check if player has enough TP
                if (trainingPoints >= tpCost) {
                    trainingPoints -= tpCost;

                    switch (trainingFocus) {
                        case TrainingFocus.TECHNICAL:
                            if (skill < potential && Math.random() < (0.2 + trainingBonusChance)) skill++;
                            fatigue = Math.min(100, fatigue + Math.ceil(5 * ageFactor));
                            break;
                        case TrainingFocus.PHYSICAL:
                            if (stamina < 100 && Math.random() < (0.4 + trainingBonusChance)) stamina += 2;
                            fatigue = Math.min(100, fatigue + Math.ceil(10 * ageFactor));
                            morale = Math.max(0, morale - Math.ceil(3 * ageFactor)); // Physical training can hurt morale
                            break;
                        case TrainingFocus.TACTICAL:
                            // Tactical training: small chance to boost potential, helps with vision/intelligence
                            if (potential < 100 && Math.random() < (0.05 + trainingBonusChance)) potential++;
                            if (skill < potential && Math.random() < (0.15 + trainingBonusChance)) skill++;
                            // Younger players struggle more with focus-intensive tactical training
                            const burnoutChance = age <= 16 ? 0.15 : 0.05;
                            if (Math.random() < burnoutChance) {
                                morale = Math.max(0, morale - Math.ceil(8 * ageFactor));
                                fatigue = Math.min(100, fatigue + Math.ceil(8 * ageFactor));
                            } else {
                                fatigue = Math.min(100, fatigue + Math.ceil(6 * ageFactor));
                            }
                            break;
                        case TrainingFocus.REST:
                            morale = Math.min(100, morale + 5 + swagBonus);
                            stamina = Math.min(100, stamina + 5);
                            fatigue = Math.max(0, fatigue - 30);
                            break;
                        default: // GENERAL
                            if (Math.random() < (0.1 + trainingBonusChance) && skill < potential) skill++;
                            fatigue = Math.min(100, fatigue + Math.ceil(2 * ageFactor));
                    }
                } else {
                    // Not enough TP: player "slacks off" or just does light training
                    morale = Math.max(0, morale - Math.ceil(5 * ageFactor));
                    fatigue = Math.max(0, fatigue - 10);
                }
            }

            // Regenerate TP at end of week (5 TP for balanced training economy)
            trainingPoints = 5;

            return { ...p, skill, stamina, morale, fatigue, isInjured, injuryWeeksLeft, potential, trainingPoints };
        });

        // Player morale events (10% chance per week)
        if (Math.random() < 0.1 && newRoster.length > 0) {
          const benchPlayers = newRoster.filter(p => p.line === 'BENCH' && !p.isInjured);
          const topPlayers = newRoster.filter(p => (p.line === 'L1' || p.line === 'G1') && p.goals >= 5);

          if (benchPlayers.length > 0 && Math.random() < 0.5) {
            const unhappyPlayer = benchPlayers[Math.floor(Math.random() * benchPlayers.length)];
            unhappyPlayer.morale = Math.max(20, unhappyPlayer.morale - 15);
            addNews(`${unhappyPlayer.name} wants more ice time (morale -15)`);
          } else if (topPlayers.length > 0) {
            const hotPlayer = topPlayers[Math.floor(Math.random() * topPlayers.length)];
            hotPlayer.morale = Math.min(100, hotPlayer.morale + 10);
            addNews(`${hotPlayer.name} is loving the season! (morale +10)`);
          }
        }

        return { ...t, roster: newRoster };
    });

    const newReports: ScoutingReport[] = [];
    hiredScouts.forEach(scout => {
        const mishapChance = Math.max(0, 0.2 - (scout.skill * 0.02)); // 20% base, reduced by 2% per skill level
        if (Math.random() < mishapChance) {
             newReports.push({ id: Date.now()+'', scoutName: scout.name, date: `Week ${currentWeek}`, description: SCOUT_MISHAPS[Math.floor(Math.random() * SCOUT_MISHAPS.length)], player: null as any });
        } else {
             // Scout skill affects player quality (skill range and potential)
             const randomPosition = [Position.FORWARD, Position.CENTER, Position.DEFENDER][Math.floor(Math.random() * 3)];
             const isWonderkid = Math.random() < (scout.skill / 50); // Higher skill = more wonderkids
             const p = createPlayer(randomPosition, 'scout', 99, isWonderkid, scout.skill);
             newReports.push({ id: Date.now()+'', scoutName: scout.name, date: `Week ${currentWeek}`, description: "Found player", player: p });
        }
    });
    setScoutingReports(prev => [...prev, ...newReports]);

    // Mid-season random events (every 4-6 weeks)
    if (currentWeek % 5 === 0 && Math.random() < 0.6) {
      const events = [
        {
          type: 'hot_streak',
          apply: () => {
            addNews(`HOT STREAK! Team morale boosted after week ${currentWeek} success!`);
            updates = updates.map(t => t.id === userTeamId ? {
              ...t,
              roster: t.roster.map(p => ({ ...p, morale: Math.min(100, p.morale + 15) }))
            } : t);
          }
        },
        {
          type: 'sponsor_bonus',
          apply: () => {
            const sorted = [...updates].sort((a, b) => b.points - a.points);
            const userRank = sorted.findIndex(t => t.id === userTeamId);
            if (userRank < 6) {
              addNews(`SPONSOR BONUS! Local business donated 5 PØKKS for top-6 performance!`);
              updates = updates.map(t => t.id === userTeamId ? { ...t, wallet: t.wallet + 5 } : t);
            }
          }
        },
        {
          type: 'equipment_malfunction',
          apply: () => {
            addNews(`EQUIPMENT ISSUE! Jersey shipment delayed - temporary morale hit.`);
            updates = updates.map(t => t.id === userTeamId ? {
              ...t,
              roster: t.roster.map(p => ({ ...p, morale: Math.max(20, p.morale - 10) }))
            } : t);
          }
        }
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      randomEvent.apply();
    }

    setTeams(updates);
  };

  // --- UI HANDLERS ---
  
  const handleHireScout = (scout: Scout) => { if (userTeam.wallet >= scout.costPerWeek) setHiredScouts(prev => [...prev, scout]); };
  const handleFireScout = (id: string) => setHiredScouts(prev => prev.filter(s => s.id !== id));
  const handleSignPlayer = (report: ScoutingReport, deal: DirtyDeal) => {
      if (userTeam.wallet >= deal.cost) {
          setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, wallet: t.wallet - deal.cost, roster: [...t.roster, report.player] } : t));
          setScoutingReports(prev => prev.filter(r => r.id !== report.id));
          alert("Signed!");
      }
  };
  const handleUpdatePlayerFocus = (pid: string, f: TrainingFocus) => {
      setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, roster: t.roster.map(p => p.id === pid ? { ...p, trainingFocus: f } : p) } : t));
  };
  const handleBulkUpdateFocus = (f: TrainingFocus) => {
      setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, roster: t.roster.map(p => ({ ...p, trainingFocus: f })) } : t));
  };
  const handleUpdateLineAssignment = (pid: string, l: LineAssignment) => {
      setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, roster: t.roster.map(p => p.id === pid ? { ...p, line: l } : p) } : t));
  };
  const handleReleasePlayer = (pid: string) => {
      const player = userTeam.roster.find(p => p.id === pid);
      if (player) {
          // Remove player from team roster
          setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, roster: t.roster.filter(p => p.id !== pid) } : t));
          // Add to free agents list
          setFreeAgents(prev => [...prev, player]);
          addNews(`${player.name} released to free agency`);
      }
  };
  const handleUpdateTactics = (s: TacticStyle, a: AggressionLevel) => {
      setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, tactics: { style: s, aggression: a } } : t));
  };
  const handleUpgradeStaff = (id: string, cost: number) => {
       setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, wallet: t.wallet - cost, staff: t.staff.map(s => s.id === id ? { ...s, level: s.level + 1 } : s) } : t));
  };
  const handleBuyUpgrade = (type: 'equipment'|'swag', cost: number) => {
       setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, wallet: t.wallet - cost, upgrades: { ...t.upgrades, [type === 'equipment' ? 'equipmentLevel' : 'swagLevel']: (type === 'equipment' ? t.upgrades.equipmentLevel : t.upgrades.swagLevel) + 1 } } : t));
  };
  const handleDugnad = () => {
      if (!dugnadCooldown) {
          setTeams(prev => prev.map(t => t.id === userTeamId ? { ...t, wallet: t.wallet + 2 } : t));
          setDugnadCooldown(true);
          alert("Dugnad done. +2 Pøkks");
      }
  };

  const handleManualSave = () => {
      autoSaveGame();
      alert("Game saved successfully!");
  };

  const handleExportSave = () => {
      exportSaveGame();
  };

  // --- RENDER ---

  if (gameState === GameState.ONBOARDING) {
      return (
          <RetroLayout>
              <Onboarding
                  teams={teams}
                  onComplete={handleOnboardingComplete}
                  onContinue={handleContinueSave}
              />
              <Analytics />
          </RetroLayout>
      );
  }

  if (gameState === GameState.OFFSEASON) {
      return (
          <RetroLayout title={`OFF-SEASON (YEAR ${seasonCount})`}>
              <ContractDesk 
                  currentTeam={userTeam}
                  jobOffers={jobOffers}
                  graduatingPlayersCount={userTeam.roster.filter(p => p.age >= 18).length}
                  onRenew={() => startNewSeason(userTeamId, 0)}
                  onAcceptOffer={(offer) => startNewSeason(offer.teamId, offer.signingBonus)}
              />
              <Analytics />
          </RetroLayout>
      );
  }

  return (
    <RetroLayout title={view === GameView.DASHBOARD ? undefined : (view === GameView.LOCKER_ROOM ? "LOCKER ROOM" : view)} wallet={userTeam.wallet}>
      {/* Navigation Bar */}
      <nav className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b-2 border-green-800 pb-3 sm:pb-4">
        <RetroButton onClick={() => setView(GameView.DASHBOARD)} className={view === GameView.DASHBOARD ? 'bg-green-700 text-black' : ''}><BarChart3 className="inline mr-1 sm:mr-2 w-4 h-4"/>Dash</RetroButton>
        <RetroButton onClick={() => setView(GameView.ROSTER)} className={view === GameView.ROSTER ? 'bg-green-700 text-black' : ''}><Users className="inline mr-1 sm:mr-2 w-4 h-4"/>Roster</RetroButton>
        <RetroButton onClick={() => setView(GameView.TRAINING)} className={view === GameView.TRAINING ? 'bg-green-700 text-black' : ''}><Dumbbell className="inline mr-1 sm:mr-2 w-4 h-4"/>Train</RetroButton>
        <RetroButton onClick={() => setView(GameView.SCOUTING)} className={view === GameView.SCOUTING ? 'bg-green-700 text-black' : ''}><ScanSearch className="inline mr-1 sm:mr-2 w-4 h-4"/>Scouts</RetroButton>
        <RetroButton onClick={() => setView(GameView.OFFICE)} className={view === GameView.OFFICE ? 'bg-green-700 text-black' : ''}><Building2 className="inline mr-1 sm:mr-2 w-4 h-4"/>Office</RetroButton>
        <RetroButton onClick={() => setView(GameView.LEAGUE)} className={view === GameView.LEAGUE ? 'bg-green-700 text-black' : ''}><Trophy className="inline mr-1 sm:mr-2 w-4 h-4"/>League</RetroButton>
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2 justify-between sm:justify-end">
             <RetroButton onClick={handleManualSave} className="text-xs py-1 px-2">
               <Save className="inline mr-1 w-3 h-3"/><span className="hidden sm:inline"> Save</span>
             </RetroButton>
             <RetroButton onClick={handleExportSave} className="text-xs py-1 px-2">
               <Download className="inline mr-1 w-3 h-3"/><span className="hidden sm:inline"> Export</span>
             </RetroButton>
             <div className="bg-green-900/50 px-2 py-2 border border-green-600 text-xs text-center whitespace-nowrap">
               <div>{phase === 'REGULAR_SEASON' ? `WEEK ${currentWeek}` : 'PLAYOFFS'}</div>
             </div>
        </div>
      </nav>

      {/* Main Views */}
      {view === GameView.DASHBOARD && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {userTeam.championships && userTeam.championships > 0 && (
              <div className="bg-black border-2 border-amber-600 p-3 text-center">
                <div className="text-xs uppercase opacity-70 mb-1">Trophy Cabinet</div>
                <div className="text-3xl">🏆</div>
                <div className="text-amber-400 font-bold text-xl">{userTeam.championships}x CHAMPION</div>
              </div>
            )}
            <div className="bg-black border-2 border-green-700 p-4">
              <h3 className="text-xl font-bold mb-4 border-b border-green-800">NEXT MATCHUP (Week {currentWeek})</h3>
              <div className="flex justify-between items-center text-center">
                 <div>
                   <div className="text-4xl font-bold text-green-300">HOME</div>
                   <div className="text-sm mt-1">{nextOpponentId === userTeamId ? userTeam.name : nextOpponent.name}</div>
                 </div>
                 <div className="text-2xl font-bold">VS</div>
                 <div>
                   <div className="text-4xl font-bold text-red-400">AWAY</div>
                   <div className="text-sm mt-1">{nextOpponentId === userTeamId ? nextOpponent.name : userTeam.name}</div>
                 </div>
              </div>
              <RetroButton 
                variant="primary" 
                className="w-full mt-6"
                onClick={() => setView(GameView.LOCKER_ROOM)}
              >
                <ClipboardList className="inline mr-2 mb-1 w-5 h-5"/> ENTER LOCKER ROOM
              </RetroButton>
            </div>
          </div>
          {/* ... AI & News ... */}
          <div className="space-y-6">
             <div className="bg-black border-2 border-green-700 p-4">
               <h3 className="text-xl font-bold mb-2 border-b border-green-800">ASSISTANT COACH</h3>
               <p className="italic text-green-400 text-lg">"{advice || 'Get ready.'}"</p>
             </div>
             <div className="bg-black border-2 border-green-700 p-4 h-48 overflow-y-auto">
               <h3 className="text-xl font-bold mb-2 border-b border-green-800">NEWS TELEX</h3>
               {lastMatchResult ? (
                 <div className="text-sm space-y-2">
                   <p className="text-green-300 uppercase font-bold">LAST: {lastMatchResult.homeScore} - {lastMatchResult.awayScore}</p>
                   <p>{lastMatchResult.aiCommentary}</p>
                 </div>
               ) : <p className="opacity-50">Season Starting.</p>}
             </div>
          </div>
        </div>
      )}

      {view === GameView.LOCKER_ROOM && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-0">
              <TacticsBoard team={userTeam} onUpdateTactics={handleUpdateTactics} />
              <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="bg-black border-2 border-green-700 p-3 sm:p-4">
                      <h2 className="text-lg sm:text-xl font-bold border-b border-green-700 pb-2 mb-3 sm:mb-4 uppercase">Opponent Intel</h2>
                      <div className="text-center">
                          <div className="text-3xl sm:text-4xl font-bold text-red-500">{nextOpponent.name}</div>
                          <div className="text-xs sm:text-sm opacity-70 mt-1">from {nextOpponent.city}</div>
                      </div>
                  </div>
                  <div className="bg-black border-2 border-green-700 p-3 sm:p-4 flex-1 flex flex-col min-h-0">
                      <div className="mt-auto pt-4 space-y-2">
                          <RetroButton onClick={() => setView(GameView.ROSTER)} className="w-full text-xs sm:text-sm">ADJUST LINES</RetroButton>
                          <RetroButton onClick={() => setView(GameView.MATCH)} variant="primary" className="w-full py-3 sm:py-4 text-lg sm:text-xl animate-pulse"><Play className="inline mr-2 w-5 h-5 sm:w-6 sm:h-6"/> START MATCH</RetroButton>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {view === GameView.ROSTER && <RosterView team={userTeam} onUpdateLineAssignment={handleUpdateLineAssignment} onReleasePlayer={handleReleasePlayer} />}
      {view === GameView.TRAINING && <TrainingCamp team={userTeam} onUpdatePlayerFocus={handleUpdatePlayerFocus} onBulkUpdate={handleBulkUpdateFocus} />}
      {view === GameView.SCOUTING && <ScoutingAndDeals wallet={userTeam.wallet} hiredScouts={hiredScouts} reports={scoutingReports} teams={teams} onHire={handleHireScout} onFire={handleFireScout} onSignPlayer={handleSignPlayer} />}
      {view === GameView.OFFICE && <FrontOffice team={userTeam} onUpgradeStaff={handleUpgradeStaff} onBuyUpgrade={handleBuyUpgrade} onDugnad={handleDugnad} dugnadCooldown={dugnadCooldown} />}
      {view === GameView.LEAGUE && <LeagueView teams={teams} schedule={schedule} currentWeek={currentWeek} phase={phase} playoffSeries={playoffSeries} />}
      {view === GameView.MATCH && <MatchSimulator homeTeam={nextOpponentId === userTeamId ? userTeam : nextOpponent} awayTeam={nextOpponentId === userTeamId ? nextOpponent : userTeam} onMatchComplete={handleMatchComplete} />}
      <Analytics />
    </RetroLayout>
  );
};

export default App;
