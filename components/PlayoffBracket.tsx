
import React from 'react';
import { PlayoffSeries, Team } from '../types';
import { Trophy } from 'lucide-react';

interface PlayoffBracketProps {
  series: PlayoffSeries[];
  teams: Team[];
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ series, teams }) => {
  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'TBD';
  
  const semiFinals = series.filter(s => s.roundName === 'Semi-Final');
  const final = series.find(s => s.roundName === 'Final');

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-black border-2 border-green-900">
        <h2 className="text-2xl text-amber-400 font-bold mb-8 uppercase flex items-center gap-2">
            <Trophy className="w-6 h-6"/> Championship Bracket
        </h2>

        <div className="flex gap-12 items-center w-full max-w-4xl">
            {/* SEMIS */}
            <div className="flex flex-col gap-16 flex-1">
                {semiFinals.map((s, i) => (
                    <div key={s.id} className="border-2 border-green-600 bg-green-900/10 p-4 relative">
                        <h3 className="absolute -top-3 left-2 bg-black px-2 text-[10px] text-green-400 uppercase">SEMI FINAL {i+1}</h3>
                        <div className={`flex justify-between items-center mb-2 ${s.winnerId === s.teamAId ? 'text-white font-bold' : 'text-gray-500'}`}>
                            <span>{getTeamName(s.teamAId)}</span>
                            {s.winnerId === s.teamAId && <span className="text-xs text-green-400">WIN</span>}
                        </div>
                        <div className={`flex justify-between items-center ${s.winnerId === s.teamBId ? 'text-white font-bold' : 'text-gray-500'}`}>
                            <span>{getTeamName(s.teamBId)}</span>
                            {s.winnerId === s.teamBId && <span className="text-xs text-green-400">WIN</span>}
                        </div>
                        {/* Connector Line */}
                        <div className={`absolute top-1/2 -right-6 w-6 h-0.5 bg-green-800 transform translate-y-[-50%] ${i === 0 ? 'rotate-45 translate-y-4' : '-rotate-45 -translate-y-4'}`}></div> 
                    </div>
                ))}
            </div>

            {/* FINAL */}
            <div className="flex-1">
                {final ? (
                    <div className="border-4 border-amber-500 bg-amber-900/10 p-6 relative">
                        <h3 className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black px-2 text-sm text-amber-400 uppercase font-bold">GRAND FINAL</h3>
                        <div className="text-center space-y-4">
                            <div className={`text-xl ${final.winnerId === final.teamAId ? 'text-amber-300 font-bold text-glow' : 'text-gray-400'}`}>
                                {getTeamName(final.teamAId)}
                            </div>
                            <div className="text-xs text-gray-600">VS</div>
                            <div className={`text-xl ${final.winnerId === final.teamBId ? 'text-amber-300 font-bold text-glow' : 'text-gray-400'}`}>
                                {getTeamName(final.teamBId)}
                            </div>
                        </div>
                        {final.winnerId && (
                            <div className="mt-4 text-center border-t border-amber-700 pt-2">
                                <div className="text-[10px] text-amber-600 uppercase">CHAMPION</div>
                                <div className="text-2xl font-bold text-white animate-bounce mt-1">
                                    {getTeamName(final.winnerId)}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-700 p-8 text-center opacity-30">
                        AWAITING FINALISTS
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
