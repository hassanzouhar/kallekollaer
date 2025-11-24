
import React, { useState, useEffect } from 'react';
import { Team, ScheduledMatch, SeasonPhase, PlayoffSeries } from '../types';
import { Standings } from './Standings';
import { PlayoffBracket } from './PlayoffBracket';

interface LeagueViewProps {
  teams: Team[];
  schedule: ScheduledMatch[];
  currentWeek: number;
  phase: SeasonPhase;
  playoffSeries: PlayoffSeries[];
}

export const LeagueView: React.FC<LeagueViewProps> = ({ teams, schedule, currentWeek, phase, playoffSeries }) => {
  const [tab, setTab] = useState<'standings' | 'schedule' | 'playoffs'>(phase === 'PLAYOFFS' ? 'playoffs' : 'standings');

  // Auto-switch to Playoffs if phase changes while mounted
  useEffect(() => {
    if (phase === 'PLAYOFFS') {
        setTab('playoffs');
    }
  }, [phase]);

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'Unknown';

  const renderSchedule = () => (
    <div className="space-y-4 h-full overflow-y-auto custom-scrollbar pb-4">
        {Array.from({ length: 22 }).map((_, i) => {
            const week = i + 1;
            const weekMatches = schedule.filter(m => m.week === week);
            const isPast = week < currentWeek;
            const isCurrent = week === currentWeek;

            return (
                <div key={week} className={`border-2 p-2 ${isCurrent ? 'border-green-500 bg-green-900/20' : 'border-green-900 bg-black'}`}>
                    <h3 className="text-center text-xs font-bold border-b border-green-800 pb-1 mb-2 text-green-400">
                        WEEK {week} {isCurrent && "(CURRENT)"}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        {weekMatches.map(m => (
                            <div key={m.id} className="flex justify-between items-center p-1 hover:bg-green-900/10">
                                <div className={`flex-1 text-right ${m.result && m.result.homeScore > m.result.awayScore ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    {getTeamName(m.homeTeamId)}
                                </div>
                                <div className="mx-3 font-mono font-bold text-center w-16 bg-black border border-green-900">
                                    {m.played && m.result ? (
                                        <span className="text-amber-400">
                                            {m.result.homeScore} - {m.result.awayScore}
                                            {m.result.isOvertime ? ' (OT)' : ''}
                                            {m.result.isShootout ? ' (SO)' : ''}
                                        </span>
                                    ) : (
                                        <span className="text-gray-600">- v -</span>
                                    )}
                                </div>
                                <div className={`flex-1 text-left ${m.result && m.result.awayScore > m.result.homeScore ? 'text-white font-bold' : 'text-gray-400'}`}>
                                    {getTeamName(m.awayTeamId)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-4">
            <button 
                onClick={() => setTab('standings')}
                className={`flex-1 py-2 border-2 font-bold uppercase ${tab === 'standings' ? 'bg-green-600 text-black border-green-400' : 'border-green-800 text-green-600'}`}
            >
                Standings
            </button>
            <button 
                onClick={() => setTab('schedule')}
                className={`flex-1 py-2 border-2 font-bold uppercase ${tab === 'schedule' ? 'bg-green-600 text-black border-green-400' : 'border-green-800 text-green-600'}`}
            >
                Schedule
            </button>
            <button 
                onClick={() => setTab('playoffs')}
                disabled={phase === 'REGULAR_SEASON' && currentWeek < 18} // Enable preview late season
                className={`flex-1 py-2 border-2 font-bold uppercase ${tab === 'playoffs' ? 'bg-green-600 text-black border-green-400' : 'border-green-800 text-green-600 disabled:opacity-30'}`}
            >
                Playoffs
            </button>
        </div>

        <div className="flex-1 overflow-hidden">
            {tab === 'standings' && <Standings teams={teams} />}
            {tab === 'schedule' && renderSchedule()}
            {tab === 'playoffs' && (
                phase === 'REGULAR_SEASON' 
                ? <div className="flex items-center justify-center h-full text-center opacity-50">PLAYOFF BRACKET WILL APPEAR AFTER WEEK 22</div>
                : <PlayoffBracket series={playoffSeries} teams={teams} />
            )}
        </div>
    </div>
  );
};
