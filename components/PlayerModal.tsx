import React from 'react';
import { Player } from '../types';
import { X, TrendingUp, Zap, Brain, Shield, Hand } from 'lucide-react';
import { getPlayerImage, getCRTImageStyle } from '../utils/imageHelpers';

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  // Calculate derived grades
  const getGrade = (val: number) => {
      if (val > 85) return 'A';
      if (val > 70) return 'B';
      if (val > 50) return 'C';
      if (val > 30) return 'D';
      return 'F';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-black border-4 border-green-600 w-full max-w-2xl shadow-[0_0_50px_rgba(0,255,0,0.2)] relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-green-900/80 text-white p-2 flex justify-between items-center border-b-2 border-green-500">
            <h2 className="text-xl font-bold font-mono uppercase tracking-widest">BIOS: {player.name}</h2>
            <button onClick={onClose} className="hover:bg-red-600 p-1 transition-colors"><X className="w-6 h-6"/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
            {/* Top ID Block */}
            <div className="flex gap-6 mb-8">
                <div className="w-32 h-32 border-2 border-green-500 bg-black flex items-center justify-center overflow-hidden relative group">
                    <img
                        src={getPlayerImage(player.id, player.position)}
                        alt={player.name}
                        className="w-full h-full object-cover"
                        style={getCRTImageStyle()}
                    />
                    <div className="absolute inset-0 bg-green-500/10 mix-blend-color"></div>
                    <div className="absolute bottom-0 right-0 bg-black/80 text-green-400 px-2 py-1 text-xs font-bold border-t border-l border-green-500">
                        {player.position}
                    </div>
                </div>
                <div className="flex-1 font-mono text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="opacity-50 block">ID CODE</span>
                            <span className="text-green-300">{player.id.substring(0,12)}...</span>
                        </div>
                        <div>
                            <span className="opacity-50 block">AGE / LINE</span>
                            <span className="text-white">{player.age} YRS / {player.line}</span>
                        </div>
                        <div>
                            <span className="opacity-50 block">CONTRACT STATUS</span>
                            <span className="text-green-300">ACTIVE</span>
                        </div>
                        <div>
                            <span className="opacity-50 block">HEALTH</span>
                            {player.isInjured ? (
                                <span className="text-red-500 font-bold animate-pulse">INJURED ({player.injuryWeeksLeft} WKS)</span>
                            ) : (
                                <span className="text-green-500">FIT TO PLAY</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Core Metrics */}
                <div className="border border-green-800 p-4 relative">
                    <div className="absolute -top-3 left-4 bg-black px-2 text-green-500 font-bold text-xs uppercase">Core Metrics</div>
                    <div className="space-y-4 mt-2">
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>OVERALL SKILL</span>
                                <span className="font-bold text-xl text-white">{player.skill}</span>
                            </div>
                            <div className="h-2 bg-green-900/30"><div className="h-full bg-green-500" style={{width: `${player.skill}%`}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>POTENTIAL</span>
                                <span className="font-bold text-xl text-amber-400">{player.potential}</span>
                            </div>
                            <div className="h-2 bg-green-900/30"><div className="h-full bg-amber-500" style={{width: `${player.potential}%`}}></div></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="text-center bg-green-900/10 p-2 border border-green-900">
                                <span className="block text-[10px] opacity-60">MORALE</span>
                                <span className={`font-bold text-lg ${player.morale > 80 ? 'text-green-400' : 'text-white'}`}>{player.morale}</span>
                            </div>
                            <div className="text-center bg-green-900/10 p-2 border border-green-900">
                                <span className="block text-[10px] opacity-60">FATIGUE</span>
                                <span className={`font-bold text-lg ${player.fatigue > 40 ? 'text-red-500' : 'text-blue-400'}`}>{player.fatigue}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Attributes */}
                <div className="border border-green-800 p-4 relative">
                    <div className="absolute -top-3 left-4 bg-black px-2 text-green-500 font-bold text-xs uppercase">Attribute Analysis</div>
                    <ul className="space-y-3 mt-2 text-sm">
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 opacity-80"><Shield className="w-4 h-4"/> Aggression</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-green-900"><div className="h-full bg-red-500" style={{width: `${player.aggression}%`}}></div></div>
                                <span className="w-6 text-right font-bold">{getGrade(player.aggression)}</span>
                            </div>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 opacity-80"><Brain className="w-4 h-4"/> Vision (IQ)</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-green-900"><div className="h-full bg-cyan-500" style={{width: `${player.vision}%`}}></div></div>
                                <span className="w-6 text-right font-bold">{getGrade(player.vision)}</span>
                            </div>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2 opacity-80"><Hand className="w-4 h-4"/> Puck Handling</span>
                            <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-green-900"><div className="h-full bg-purple-500" style={{width: `${player.puckHandling}%`}}></div></div>
                                <span className="w-6 text-right font-bold">{getGrade(player.puckHandling)}</span>
                            </div>
                        </li>
                        <li className="flex justify-between items-center mt-4 pt-4 border-t border-green-900">
                            <span className="flex items-center gap-2 opacity-80"><Zap className="w-4 h-4"/> Current Form</span>
                            <span className="text-green-300 uppercase font-bold tracking-wider">
                                {player.morale > 80 ? 'EXCELLENT' : player.morale < 40 ? 'POOR' : 'AVERAGE'}
                            </span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Season Stats Footer */}
            <div className="mt-8 border-t-2 border-green-800 pt-4">
                <h3 className="text-xs font-bold uppercase mb-4 text-green-600">Season Statistics</h3>
                <div className="grid grid-cols-4 text-center gap-px bg-green-900 border border-green-900">
                    <div className="bg-black p-3">
                        <span className="block text-xs opacity-50">GOALS</span>
                        <span className="text-2xl font-bold text-white">{player.goals}</span>
                    </div>
                    <div className="bg-black p-3">
                        <span className="block text-xs opacity-50">ASSISTS</span>
                        <span className="text-2xl font-bold text-white">{player.assists}</span>
                    </div>
                    <div className="bg-black p-3">
                        <span className="block text-xs opacity-50">SHOTS</span>
                        <span className="text-2xl font-bold text-white">{player.shots}</span>
                    </div>
                    <div className="bg-black p-3">
                        <span className="block text-xs opacity-50">PIM</span>
                        <span className="text-2xl font-bold text-red-400">{player.pim}</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};