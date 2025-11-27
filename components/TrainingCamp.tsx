import React from 'react';
import { Team, Player, TrainingFocus, Position } from '../types';
import { DRILLS } from '../constants';
import { RetroButton } from './RetroButton';

interface TrainingCampProps {
  team: Team;
  onUpdatePlayerFocus: (playerId: string, focus: TrainingFocus) => void;
  onBulkUpdate: (focus: TrainingFocus) => void;
}

export const TrainingCamp: React.FC<TrainingCampProps> = ({ team, onUpdatePlayerFocus, onBulkUpdate }) => {

  const getFocusStyle = (focus: TrainingFocus) => {
    switch (focus) {
      case TrainingFocus.TECHNICAL: return 'text-cyan-400 border-cyan-800';
      case TrainingFocus.PHYSICAL: return 'text-red-400 border-red-800';
      case TrainingFocus.TACTICAL: return 'text-purple-400 border-purple-800';
      case TrainingFocus.REST: return 'text-green-400 border-green-800';
      default: return 'text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-green-700 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-green-400 uppercase tracking-widest text-glow">Training Camp</h2>
          <p className="text-sm opacity-70">Assign drills to improve player attributes over time.</p>
          <p className="text-xs text-cyan-400 mt-1">⚡ All players regenerate +5 TP next week</p>
        </div>
        <div className="mt-4 md:mt-0 bg-green-900/20 p-2 border border-green-800">
           <div className="text-xs uppercase font-bold mb-2 text-center text-green-300">Bulk Assign Team</div>
           <div className="flex gap-2">
             {DRILLS.map(drill => (
               <button
                  key={drill.id}
                  onClick={() => onBulkUpdate(drill.id)}
                  title={drill.desc}
                  className="px-2 py-1 text-xs border border-green-600 hover:bg-green-700 transition-colors uppercase"
               >
                 {drill.label}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drill Info Panel */}
        <div className="bg-black border-2 border-green-800 p-4 h-fit">
           <h3 className="text-xl font-bold mb-4 uppercase text-center border-b border-green-800 pb-2">Drill Procedures</h3>
           <div className="space-y-4">
             {DRILLS.map(drill => (
               <div key={drill.id} className="flex items-start space-x-3 p-2 hover:bg-green-900/10">
                 <div className="text-2xl">{drill.icon}</div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center">
                     <div className="font-bold text-green-300">{drill.label}</div>
                     <div className="text-xs font-mono bg-green-900/30 px-2 py-0.5 border border-green-700">
                       {drill.tpCost} TP
                     </div>
                   </div>
                   <div className="text-xs opacity-80">{drill.desc}</div>
                   <div className="text-[10px] mt-1 uppercase">
                     <span className="text-green-500">+++ {drill.boosts}</span>
                     <span className="text-red-500 ml-2">--- {drill.cost}</span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-6 p-2 bg-green-900/20 text-xs border border-green-700 italic">
             "Pain is just weakness leaving the body." - Head Coach
           </div>
        </div>

        {/* Roster Assignment */}
        <div className="lg:col-span-2 border-2 border-green-800 bg-black/80 max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-green-900/50 text-green-200 sticky top-0 z-10 uppercase">
              <tr>
                <th className="p-2">Player</th>
                <th className="p-2 text-center">Age</th>
                <th className="p-2 text-center">Pos</th>
                <th className="p-2 text-center">TP</th>
                <th className="p-2 text-center">Stats</th>
                <th className="p-2">Current Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-900/30">
              {team.roster.map(player => {
                const currentDrill = DRILLS.find(d => d.id === player.trainingFocus);
                const tpCost = currentDrill?.tpCost || 0;
                const hasEnoughTP = (player.trainingPoints || 0) >= tpCost;

                return (
                  <tr key={player.id} className="hover:bg-green-900/20 transition-colors group">
                    <td className="p-2 font-bold">{player.name}</td>
                    <td className="p-2 text-center text-xs">
                      {player.age}
                      {player.age <= 16 && <span className="ml-1 text-[10px] text-yellow-500" title="Younger players are more susceptible to burnout">⚠</span>}
                    </td>
                    <td className="p-2 text-center">{player.position}</td>
                    <td className="p-2 text-center">
                      <div className={`font-mono text-xs ${hasEnoughTP ? 'text-green-400' : 'text-red-400'}`}>
                        {player.trainingPoints || 0}/{tpCost}
                      </div>
                    </td>
                    <td className="p-2 text-xs opacity-80 text-center">
                      <div>SKL:{player.skill} STM:{player.stamina} MOR:{player.morale}</div>
                      <div className={`text-[10px] ${player.fatigue > 70 ? 'text-red-400 font-bold' : 'opacity-60'}`}>
                        FAT:{player.fatigue}
                        {player.fatigue > 70 && <span className="ml-1" title="High injury risk (2x chance)">⚠️</span>}
                      </div>
                    </td>
                    <td className="p-2">
                      <select
                        value={player.trainingFocus}
                        onChange={(e) => onUpdatePlayerFocus(player.id, e.target.value as TrainingFocus)}
                        className={`bg-black border p-1 text-xs uppercase w-full outline-none focus:ring-1 focus:ring-green-500 cursor-pointer ${getFocusStyle(player.trainingFocus)} ${!hasEnoughTP ? 'opacity-50' : ''}`}
                      >
                        {DRILLS.map(d => (
                          <option key={d.id} value={d.id}>{d.label} ({d.tpCost}TP)</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};