
import React, { useState } from 'react';
import { Team, Player, LineAssignment, Position } from '../types';
import { Info, ArrowLeftRight, ShieldAlert } from 'lucide-react';
import { PlayerModal } from './PlayerModal';

interface RosterViewProps {
  team: Team;
  onUpdateLineAssignment?: (playerId: string, line: LineAssignment) => void;
}

const POSITION_ORDER = {
  [Position.GOALIE]: 0,
  [Position.DEFENDER]: 1,
  [Position.CENTER]: 2,
  [Position.FORWARD]: 3
};

const PlayerCard: React.FC<{ 
    player: Player | undefined; 
    isSelected: boolean; 
    onClick: () => void;
    onInfoClick: (e: React.MouseEvent) => void;
    isEmpty?: boolean;
}> = ({ player, isSelected, onClick, onInfoClick, isEmpty }) => {
    
    if (isEmpty || !player) {
        return (
            <div 
                onClick={onClick}
                className={`
                    border border-dashed border-green-900/40 bg-green-900/5 p-2 flex flex-col items-center justify-center 
                    text-[10px] uppercase text-green-800 cursor-pointer h-[90px] hover:border-green-700 hover:text-green-600 transition-colors rounded
                    ${isSelected ? 'border-green-400 bg-green-900/20' : ''}
                `}
            >
                <span>EMPTY</span>
            </div>
        );
    }

    const isTired = player.fatigue > 30;
    const isInjured = player.isInjured;

    return (
        <div 
            onClick={onClick}
            className={`
                relative border bg-[#080c08] p-2 flex flex-col justify-between cursor-pointer transition-all h-[90px] select-none group rounded
                ${isSelected 
                    ? 'border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)] z-10' 
                    : 'border-green-800/50 hover:border-green-600 hover:bg-green-900/10'}
                ${isInjured ? 'border-red-900/60 opacity-80' : ''}
            `}
        >
            {/* Info Button */}
            <button 
                onClick={onInfoClick}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:text-white text-green-600 z-20 transition-opacity"
            >
                <Info className="w-3 h-3" />
            </button>

            {/* Header */}
            <div className="flex justify-between items-start mb-1">
                <div className={`
                    text-[9px] font-bold px-1 py-0.5 rounded
                    ${player.position === Position.GOALIE ? 'bg-yellow-900/20 text-yellow-600' : 
                      player.position === Position.DEFENDER ? 'bg-blue-900/20 text-blue-400' : 
                      'bg-green-900/20 text-green-500'}
                `}>
                    {player.position}
                </div>
                <div className={`text-lg font-bold leading-none ${player.skill > 80 ? 'text-green-300' : 'text-green-700'}`}>
                    {player.skill}
                </div>
            </div>
            
            {/* Name */}
            <div className="font-bold text-xs truncate uppercase text-green-100 mb-auto pr-3">
                {player.name.split(' ').slice(-1)[0]}
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-end text-[8px] font-mono opacity-70 border-t border-green-900/30 pt-1 mt-1">
                <div className="flex gap-2">
                    <span title="Morale" className={player.morale < 50 ? 'text-red-400' : ''}>M:{player.morale}</span>
                    <span title="Condition" className={isTired ? 'text-red-500' : ''}>C:{100 - player.fatigue}%</span>
                </div>
            </div>

            {/* Injury Overlay */}
            {isInjured && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-red-500 font-bold border border-red-900 rounded z-20 backdrop-blur-[1px]">
                    <ShieldAlert className="w-5 h-5 mb-1"/>
                    <span className="text-[10px]">{player.injuryWeeksLeft}W</span>
                </div>
            )}
            
            {/* Active Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
            )}
        </div>
    );
};

export const RosterView: React.FC<RosterViewProps> = ({ team, onUpdateLineAssignment }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [inspectingPlayer, setInspectingPlayer] = useState<Player | null>(null);

  const handlePlayerClick = (clickedPlayer: Player) => {
      if (!onUpdateLineAssignment) return;

      if (selectedPlayerId) {
          if (selectedPlayerId === clickedPlayer.id) {
              setSelectedPlayerId(null); // Deselect
              return;
          }
          // Swap logic
          const originalPlayer = team.roster.find(p => p.id === selectedPlayerId);
          if (originalPlayer) {
              const targetLine = clickedPlayer.line;
              const originalLine = originalPlayer.line;
              onUpdateLineAssignment(clickedPlayer.id, originalLine);
              onUpdateLineAssignment(originalPlayer.id, targetLine);
              setSelectedPlayerId(null);
          }
      } else {
          setSelectedPlayerId(clickedPlayer.id);
      }
  };

  const handleInfoClick = (e: React.MouseEvent, player: Player) => {
      e.stopPropagation();
      setInspectingPlayer(player);
  };

  const handleEmptySlotClick = (targetLine: LineAssignment) => {
      if (!onUpdateLineAssignment || !selectedPlayerId) return;
      onUpdateLineAssignment(selectedPlayerId, targetLine);
      setSelectedPlayerId(null);
  };

  const handleBenchAreaClick = () => {
       if (!onUpdateLineAssignment || !selectedPlayerId) return;
       const player = team.roster.find(p => p.id === selectedPlayerId);
       if (player && player.line !== 'BENCH') {
           onUpdateLineAssignment(selectedPlayerId, 'BENCH');
           setSelectedPlayerId(null);
       }
  };

  const getSortedLine = (line: LineAssignment) => {
      return team.roster
          .filter(p => p.line === line)
          .sort((a,b) => {
               // Sort by Position Order first
               const posDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
               if (posDiff !== 0) return posDiff;
               // Then by Skill (desc)
               return b.skill - a.skill;
          });
  };

  const renderLine = (title: string, line: LineAssignment, maxSlots: number, colorClass: string = "border-green-900", gridCols: number = 5) => {
      const players = getSortedLine(line);
      const avgSkill = players.length > 0 ? Math.round(players.reduce((a,b) => a + b.skill, 0) / players.length) : 0;
      const slots = [...players, ...Array(Math.max(0, maxSlots - players.length)).fill(null)];

      // Construct grid class based on gridCols. Fallback to style for dynamic cols if needed, but 1, 2, 5 cover our needs.
      let gridClass = "grid-cols-5";
      if (gridCols === 1) gridClass = "grid-cols-1";
      if (gridCols === 2) gridClass = "grid-cols-2";

      return (
          <div className={`mb-3 p-2 bg-[#050505] border rounded-sm ${colorClass}`}>
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-green-900/30">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-green-400">{title}</h3>
                  {avgSkill > 0 && <div className="text-[10px] text-green-700 font-mono bg-green-900/10 px-2 rounded">AVG: {avgSkill}</div>}
              </div>
              <div className={`grid ${gridClass} gap-2`}>
                  {slots.map((p, i) => (
                      <PlayerCard
                          key={p ? p.id : `${line}-empty-${i}`}
                          player={p}
                          isSelected={selectedPlayerId === p?.id}
                          onClick={() => p ? handlePlayerClick(p) : handleEmptySlotClick(line)}
                          onInfoClick={(e) => p && handleInfoClick(e, p)}
                          isEmpty={!p}
                      />
                  ))}
              </div>
          </div>
      );
  };

  const benchPlayers = getSortedLine('BENCH');

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[600px] relative">
      <PlayerModal player={inspectingPlayer} onClose={() => setInspectingPlayer(null)} />

      {/* LINES COLUMN */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Line Combinations</h2>
            <div className="flex items-center gap-2 text-[10px] text-green-500 bg-green-900/10 px-3 py-1 rounded border border-green-900/30">
                 <ArrowLeftRight className="w-3 h-3"/>
                 <span>TAP TO SWAP</span>
            </div>
          </div>

          {renderLine("1ST LINE", 'L1', 5, "border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.05)]", 5)}
          {renderLine("2ND LINE", 'L2', 5, "border-green-600/30", 5)}
          {renderLine("3RD LINE", 'L3', 5, "border-green-700/30", 5)}
          {renderLine("4TH LINE", 'L4', 5, "border-green-800/30 opacity-90", 5)}
          
          <div className="mt-6 flex gap-4">
              <div className="flex-1">
                  {renderLine("STARTER (G1)", 'G1', 1, "border-yellow-600/40", 1)}
              </div>
              <div className="flex-1">
                  {renderLine("BACKUP (G2)", 'G2', 1, "border-yellow-900/30 opacity-80", 1)}
              </div>
          </div>
      </div>

      {/* BENCH COLUMN */}
      <div 
        className="lg:w-72 border-l border-green-900/30 bg-[#080808] flex flex-col"
        onClick={(e) => {
            if (e.target === e.currentTarget) handleBenchAreaClick();
        }}
      >
          <div className="p-3 border-b border-green-900/30 bg-[#0a0a0a] sticky top-0 z-10">
              <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm uppercase text-green-500">RESERVES / BENCH</h3>
                  <span className="text-[10px] bg-green-900/20 px-2 py-0.5 rounded text-green-400">{benchPlayers.length}</span>
              </div>
          </div>
          
          <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-2">
                  {benchPlayers.map(p => (
                      <PlayerCard
                          key={p.id}
                          player={p}
                          isSelected={selectedPlayerId === p.id}
                          onClick={() => handlePlayerClick(p)}
                          onInfoClick={(e) => handleInfoClick(e, p)}
                      />
                  ))}
                  <div 
                    onClick={handleBenchAreaClick}
                    className="col-span-2 border border-dashed border-green-900/20 h-16 flex items-center justify-center text-[10px] text-green-800 hover:border-green-800 hover:text-green-600 cursor-pointer transition-colors rounded uppercase"
                  >
                      Move Selected to Bench
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
