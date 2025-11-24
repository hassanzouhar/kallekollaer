
import React, { useState, useEffect, useRef } from 'react';
import { Team, MatchResult, MatchEvent, Penalty, PlayerStatUpdate, Player, Position, StaffRole, TacticStyle, AggressionLevel } from '../types';
import { RetroButton } from './RetroButton';
import { generateMatchRecap } from '../services/geminiService';
import { PENALTY_REASONS } from '../constants';

interface MatchSimulatorProps {
  homeTeam: Team;
  awayTeam: Team;
  onMatchComplete: (result: MatchResult) => void;
}

type MatchPhase = 'REGULATION' | 'OVERTIME' | 'SHOOTOUT' | 'FINISHED';

export const MatchSimulator: React.FC<MatchSimulatorProps> = ({ homeTeam, awayTeam, onMatchComplete }) => {
  const [minutes, setMinutes] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [phase, setPhase] = useState<MatchPhase>('REGULATION');
  const [commentary, setCommentary] = useState<string | null>(null);
  
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [playerUpdates, setPlayerUpdates] = useState<PlayerStatUpdate[]>([]);
  const [momentum, setMomentum] = useState(0); 
  const [pendingFaceoff, setPendingFaceoff] = useState<boolean>(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter injured AND benched players to get the true active roster
  // The simulator currently treats the entire active roster as one pool, but respects the Bench status.
  const homeRoster = homeTeam.roster.filter(p => !p.isInjured && p.line !== 'BENCH');
  const awayRoster = awayTeam.roster.filter(p => !p.isInjured && p.line !== 'BENCH');

  // Tactical State (Derived)
  const homeStyle = homeTeam.tactics?.style || TacticStyle.BALANCED;
  const awayStyle = awayTeam.tactics?.style || TacticStyle.BALANCED;
  const homeAggression = homeTeam.tactics?.aggression || AggressionLevel.MEDIUM;
  const awayAggression = awayTeam.tactics?.aggression || AggressionLevel.MEDIUM;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const startMatch = () => {
    if (homeRoster.length < 10 || awayRoster.length < 10) {
        alert("One of the teams has insufficient active players! Check lines.");
        return;
    }
    setIsSimulating(true);
  };

  const getTeamStrength = (teamId: string) => {
      const teamPenalties = penalties.filter(p => p.teamId === teamId);
      const menDown = Math.min(2, teamPenalties.length);
      return 1.0 - (menDown * 0.25);
  };

  const getAggressionMod = (level: AggressionLevel) => {
      switch(level) {
          case AggressionLevel.LOW: return 0.8;
          case AggressionLevel.MEDIUM: return 1.0;
          case AggressionLevel.HIGH: return 1.3;
          case AggressionLevel.ENFORCER: return 1.8;
          default: return 1.0;
      }
  };

  const getEffectiveSkill = (p: Player, team: Team) => {
      let moraleMod = 1.0;
      if (p.morale > 80) moraleMod = 1.05;
      if (p.morale < 40) moraleMod = 0.90;

      const fatigueMod = 1 - (p.fatigue / 200);
      const equipBonus = team.upgrades ? team.upgrades.equipmentLevel : 0;
      const headCoach = team.staff ? team.staff.find(s => s.role === StaffRole.HEAD_COACH) : null;
      const coachBonus = headCoach ? headCoach.level : 0;

      return (p.skill + equipBonus + coachBonus) * moraleMod * fatigueMod;
  };

  const updatePlayerStat = (playerId: string, stat: 'goals' | 'assists' | 'shots' | 'pim' | 'injury', extraFatigue: number = 0) => {
      setPlayerUpdates(prev => {
          const existing = prev.find(p => p.playerId === playerId) || { playerId, goals: 0, assists: 0, shots: 0, pim: 0, fatigueAdded: 2 };
          
          if (stat === 'goals') existing.goals++;
          if (stat === 'assists') existing.assists++;
          if (stat === 'shots') existing.shots++;
          if (stat === 'pim') existing.pim += 2;
          if (stat === 'injury') existing.injuryWeeks = Math.floor(Math.random() * 4) + 1;
          
          existing.fatigueAdded += extraFatigue;

          return [...prev.filter(p => p.playerId !== playerId), existing];
      });
  };

  const getRandomPlayer = (roster: Player[]) => roster[Math.floor(Math.random() * roster.length)];
  const getCenter = (roster: Player[]) => roster.find(p => p.position === Position.CENTER) || getRandomPlayer(roster);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isSimulating && phase !== 'FINISHED') {
      interval = setInterval(() => {
        setMinutes((m) => {
          let nextMinute = m + 1;
          
          // 0. Handle Faceoffs
          if (pendingFaceoff) {
              const homeCenter = getCenter(homeRoster);
              const awayCenter = getCenter(awayRoster);
              
              const hSkill = getEffectiveSkill(homeCenter, homeTeam);
              const aSkill = getEffectiveSkill(awayCenter, awayTeam);

              const homeRoll = hSkill + (homeCenter.aggression * 0.5) + (Math.random() * 50);
              const awayRoll = aSkill + (awayCenter.aggression * 0.5) + (Math.random() * 50);
              
              const winner = homeRoll > awayRoll ? homeTeam : awayTeam;
              
              setEvents(prev => [...prev, {
                  minute: m, 
                  type: 'FACEOFF',
                  description: `FACEOFF: ${winner.name} wins possession.`,
                  teamId: winner.id
              }]);
              
              updatePlayerStat(homeCenter.id, 'shots', 1);
              updatePlayerStat(awayCenter.id, 'shots', 1); 

              setMomentum(prev => Math.max(-5, Math.min(5, prev + (winner.id === homeTeam.id ? 1 : -1))));
              setPendingFaceoff(false);
              return m; 
          }

          // 1. Penalties
          setPenalties(current => {
              const updated = current.map(p => ({...p, minutesRemaining: p.minutesRemaining - 1}));
              return updated.filter(p => p.minutesRemaining > 0);
          });

          // 2. Strength & Offense
          const homeStrengthMod = getTeamStrength(homeTeam.id);
          const awayStrengthMod = getTeamStrength(awayTeam.id);
          
          const homeBaseSkill = homeRoster.reduce((acc, p) => acc + getEffectiveSkill(p, homeTeam), 0) / (homeRoster.length || 1);
          const awayBaseSkill = awayRoster.reduce((acc, p) => acc + getEffectiveSkill(p, awayTeam), 0) / (awayRoster.length || 1);

          const otModifier = phase === 'OVERTIME' ? 1.5 : 1.0;
          
          const homeMomentumMod = 1 + (momentum * 0.02);
          const awayMomentumMod = 1 - (momentum * 0.02);

          let homeTacticalBonus = 1.0;
          let awayTacticalBonus = 1.0;

          if (homeStyle === TacticStyle.COUNTER_ATTACK && (awayAggression === AggressionLevel.HIGH || awayAggression === AggressionLevel.ENFORCER)) homeTacticalBonus += 0.15;
          if (awayStyle === TacticStyle.COUNTER_ATTACK && (homeAggression === AggressionLevel.HIGH || homeAggression === AggressionLevel.ENFORCER)) awayTacticalBonus += 0.15;
          if (homeStyle === TacticStyle.DUMP_AND_CHASE) homeTacticalBonus += 0.05;
          if (awayStyle === TacticStyle.DUMP_AND_CHASE) awayTacticalBonus += 0.05;

          const homeOffense = homeBaseSkill * homeStrengthMod * homeMomentumMod * otModifier * homeTacticalBonus;
          const awayOffense = awayBaseSkill * awayStrengthMod * awayMomentumMod * otModifier * awayTacticalBonus;

          const homeGoalThreshold = 2.5 + (homeOffense - awayOffense) * 0.15;
          const awayGoalThreshold = 2.5 + (awayOffense - homeOffense) * 0.15;

          const roll = Math.random() * 100;
          let goalScored = false;

          // 3. Events
          if (Math.random() < 0.25) {
             const shooter = getRandomPlayer(homeRoster);
             updatePlayerStat(shooter.id, 'shots', 1);
          }
          if (Math.random() < 0.25) {
             const shooter = getRandomPlayer(awayRoster);
             updatePlayerStat(shooter.id, 'shots', 1);
          }

          // Goals
          if (roll < homeGoalThreshold) {
            setHomeScore(s => s + 1);
            const scorer = getRandomPlayer(homeRoster);
            const assist = getRandomPlayer(homeRoster);
            updatePlayerStat(scorer.id, 'goals', 2);
            updatePlayerStat(scorer.id, 'shots', 0); 
            if (scorer.id !== assist.id) updatePlayerStat(assist.id, 'assists', 1);

            const isPP = awayStrengthMod < 1.0;
            setEvents(prev => [...prev, {
              minute: nextMinute,
              type: 'GOAL',
              description: `GOAL! ${scorer.name} (${homeTeam.name})${isPP ? ' (PP)' : ''}`,
              teamId: homeTeam.id,
              playerId: scorer.id
            }]);
            goalScored = true;
            if (isPP) {
                 setPenalties(prev => prev.filter(p => p.teamId === awayTeam.id).slice(1));
            }
            setPendingFaceoff(true); 
            setMomentum(2); 

          } else if (roll > 100 - awayGoalThreshold) {
            setAwayScore(s => s + 1);
            const scorer = getRandomPlayer(awayRoster);
            const assist = getRandomPlayer(awayRoster);
            updatePlayerStat(scorer.id, 'goals', 2);
            updatePlayerStat(scorer.id, 'shots', 0);
            if (scorer.id !== assist.id) updatePlayerStat(assist.id, 'assists', 1);

            const isPP = homeStrengthMod < 1.0;
            setEvents(prev => [...prev, {
              minute: nextMinute,
              type: 'GOAL',
              description: `GOAL! ${scorer.name} (${awayTeam.name})${isPP ? ' (PP)' : ''}`,
              teamId: awayTeam.id,
              playerId: scorer.id
            }]);
            goalScored = true;
             if (isPP) {
                 setPenalties(prev => prev.filter(p => p.teamId === homeTeam.id).slice(1));
            }
            setPendingFaceoff(true);
            setMomentum(-2); 
          } 
          // Roughing
          else if (!goalScored && Math.random() < (0.008 * Math.max(getAggressionMod(homeAggression), getAggressionMod(awayAggression))) && phase !== 'SHOOTOUT') {
              const hPlayer = getRandomPlayer(homeRoster);
              const aPlayer = getRandomPlayer(awayRoster);
              updatePlayerStat(hPlayer.id, 'pim', 3); 
              updatePlayerStat(aPlayer.id, 'pim', 3);
              setPenalties(prev => [
                  ...prev, 
                  { id: Date.now() + 'h', teamId: homeTeam.id, player: hPlayer.name, reason: "Roughing", minutesRemaining: 2 },
                  { id: Date.now() + 'a', teamId: awayTeam.id, player: aPlayer.name, reason: "Roughing", minutesRemaining: 2 }
              ]);
              setEvents(prev => [...prev, {
                  minute: nextMinute,
                  type: 'ROUGHING',
                  description: `FIGHT! ${hPlayer.name} and ${aPlayer.name} drop the gloves!`,
                  teamId: homeTeam.id 
              }]);
          }
          // Penalties
          else if (!goalScored && Math.random() < 0.03 && phase !== 'SHOOTOUT') {
             const penaltyTeam = Math.random() > 0.5 ? homeTeam : awayTeam;
             const penaltyRoster = penaltyTeam.id === homeTeam.id ? homeRoster : awayRoster;
             const penaltyAggression = penaltyTeam.id === homeTeam.id ? homeAggression : awayAggression;
             const player = getRandomPlayer(penaltyRoster);
             const teamAggressionMod = getAggressionMod(penaltyAggression);
             if (Math.random() * 100 < (player.aggression * teamAggressionMod)) {
                 const reason = PENALTY_REASONS[Math.floor(Math.random() * PENALTY_REASONS.length)];
                 updatePlayerStat(player.id, 'pim', 1);
                 setPenalties(prev => [...prev, {
                     id: Date.now().toString(),
                     teamId: penaltyTeam.id,
                     player: player.name,
                     reason,
                     minutesRemaining: 2
                 }]);
                 setEvents(prev => [...prev, {
                     minute: nextMinute,
                     type: 'PENALTY',
                     description: `${player.name} (${penaltyTeam.name}) - 2 min for ${reason}`,
                     teamId: penaltyTeam.id
                 }]);
                 setPendingFaceoff(true);
             }
          }
          // Injuries
          else if (!goalScored && Math.random() < 0.002) {
              const victimTeam = Math.random() > 0.5 ? homeTeam : awayTeam;
              const victimRoster = victimTeam.id === homeTeam.id ? homeRoster : awayRoster;
              const victim = getRandomPlayer(victimRoster);
              updatePlayerStat(victim.id, 'injury', 0);
              setEvents(prev => [...prev, {
                  minute: nextMinute,
                  type: 'INJURY',
                  description: `INJURY! ${victim.name} is helped off the ice.`,
                  teamId: victimTeam.id
              }]);
              setPendingFaceoff(true);
          }

          // 4. Phase Transitions
          if (phase === 'REGULATION' && nextMinute >= 60) {
            if (homeScore === awayScore) {
              setEvents(prev => [...prev, { minute: 60, type: 'INFO', description: "REGULATION ENDED. OVERTIME!" }]);
              setPhase('OVERTIME');
              setPenalties([]); 
              setPendingFaceoff(true);
            } else {
              setPhase('FINISHED');
              setIsSimulating(false);
            }
          } else if (phase === 'OVERTIME' && (goalScored || nextMinute >= 65)) {
             if (goalScored) {
               setPhase('FINISHED');
               setIsSimulating(false);
             } else if (nextMinute >= 65) {
               setEvents(prev => [...prev, { minute: 65, type: 'INFO', description: "OVERTIME ENDED. SHOOTOUT!" }]);
               setPhase('SHOOTOUT');
               setIsSimulating(false);
               setTimeout(runShootout, 1000);
             }
          }

          return nextMinute;
        });
      }, 50); 
    }

    return () => clearInterval(interval);
  }, [isSimulating, phase, homeTeam, awayTeam, homeScore, awayScore, penalties, momentum, pendingFaceoff, homeStyle, awayStyle, homeAggression, awayAggression]);

  const runShootout = () => {
    let hScore = homeScore;
    let aScore = awayScore;
    let rounds = 0;
    while (hScore === aScore && rounds < 10) {
      if (Math.random() > 0.5) hScore++;
      if (Math.random() > 0.5) aScore++;
      rounds++;
    }
    if (hScore === aScore) hScore++; 
    const winner = hScore > aScore ? homeTeam.name : awayTeam.name;
    setHomeScore(hScore);
    setAwayScore(aScore);
    setEvents(prev => [...prev, {
      minute: 65,
      type: 'GOAL',
      description: `SHOOTOUT WINNER: ${winner}`,
      teamId: hScore > aScore ? homeTeam.id : awayTeam.id
    }]);
    setPhase('FINISHED');
  };

  const handleFinish = () => {
    onMatchComplete({
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore,
      awayScore,
      events,
      playerStats: playerUpdates,
      aiCommentary: commentary || undefined,
      isOvertime: minutes > 60 && minutes <= 65,
      isShootout: minutes > 65
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Scoreboard */}
      <div className="border-b-2 border-green-800 bg-black p-4 mb-4 flex justify-between items-center text-center shrink-0">
        <div className="w-1/3">
          <div className="text-lg md:text-2xl font-bold leading-none text-white">{homeTeam.name}</div>
          <div className="text-xs opacity-60 mt-1">HOME</div>
          <div className="text-xs text-red-400 mt-1 h-4 font-bold">
             {penalties.filter(p => p.teamId === homeTeam.id).length > 0 && "POWER PLAY OPP"}
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="text-4xl md:text-5xl font-bold font-mono bg-green-900/10 px-4 border border-green-800/50 text-green-400 rounded">
            {homeScore} - {awayScore}
          </div>
          <div className="mt-2 text-lg text-yellow-500">
             {phase === 'FINISHED' ? 'FINAL' : phase === 'REGULATION' ? `P${Math.floor(minutes / 20) + 1} - ${minutes}'` : phase}
          </div>
          {/* Momentum Meter */}
          <div className="w-24 h-1 bg-gray-800 mt-2 relative rounded overflow-hidden">
             <div className="absolute top-0 bottom-0 w-1 bg-white transition-all duration-300" style={{ left: `${50 + (momentum * 10)}%` }}></div>
          </div>
        </div>
        <div className="w-1/3">
          <div className="text-lg md:text-2xl font-bold leading-none text-white">{awayTeam.name}</div>
          <div className="text-xs opacity-60 mt-1">AWAY</div>
          <div className="text-xs text-red-400 mt-1 h-4 font-bold">
             {penalties.filter(p => p.teamId === awayTeam.id).length > 0 && "POWER PLAY OPP"}
          </div>
        </div>
      </div>

      {/* Match Log - Responsive Height */}
      <div className="border border-green-900/30 bg-[#080808] p-2 overflow-hidden flex flex-col relative rounded min-h-[200px] max-h-[60vh]">
        <div className="absolute top-0 right-0 p-1 bg-green-900/20 text-[10px] text-green-600 z-10">LIVE FEED</div>
        <div ref={scrollRef} className="overflow-y-auto space-y-1 h-full font-mono text-sm px-2 pb-4">
          {events.length === 0 && <p className="opacity-30 text-center mt-10">WAITING FOR PUCK DROP...</p>}
          {events.map((e, idx) => (
            <div key={idx} className={`flex gap-3 py-1 border-b border-green-900/10 ${
                e.type === 'GOAL' ? 'text-green-300 font-bold bg-green-900/10' : 
                e.type === 'PENALTY' ? 'text-red-400' : 
                e.type === 'ROUGHING' ? 'text-yellow-600 font-bold' :
                e.type === 'FACEOFF' ? 'text-cyan-600 opacity-70 text-xs' :
                e.type === 'INJURY' ? 'text-red-600 font-bold bg-red-900/10' :
                'text-green-600'
            }`}>
              <span className="w-8 text-right opacity-50 text-xs pt-0.5">{e.minute}'</span>
              <span>{e.description}</span>
            </div>
          ))}
          {phase === 'FINISHED' && (
             <div className="text-center py-4 text-green-500 border-t border-green-900 mt-4">
                *** MATCH FINISHED ***
             </div>
          )}
        </div>
      </div>

      <div className="mt-4 shrink-0">
        {!isSimulating && phase !== 'FINISHED' && (
          <RetroButton onClick={startMatch} variant="primary" className="w-full py-4 text-lg">
            DROP THE PUCK
          </RetroButton>
        )}
        
        {phase === 'FINISHED' && (
          <div className="space-y-4">
             <div className="bg-green-900/10 border border-green-800 p-4 rounded">
               <h3 className="uppercase font-bold border-b border-green-800 mb-2 text-sm text-green-400">Post-Game Report</h3>
               <p className="italic leading-relaxed text-sm opacity-80">
                 {commentary ? commentary : <span className="animate-pulse">Incoming telex...</span>}
               </p>
             </div>
             <RetroButton onClick={handleFinish} className="w-full">
               RETURN TO LOCKER ROOM
             </RetroButton>
          </div>
        )}
      </div>
    </div>
  );
};
