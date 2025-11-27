
import React, { useState } from 'react';
import { Team, Player, DirtyDeal } from '../types';
import { DIRTY_DEALS } from '../constants';
import { RetroButton } from './RetroButton';
import { Briefcase, Gavel, Heart, Car, Gamepad2, Beer } from 'lucide-react';

interface TransferMarketProps {
  teams: Team[];
  userTeam: Team;
  onPoachPlayer: (player: Player, fromTeamId: string, cost: number) => void;
  onSpend: (amount: number) => void;
}

export const TransferMarket: React.FC<TransferMarketProps> = ({ teams, userTeam, onPoachPlayer, onSpend }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player, teamId: string } | null>(null);
  const [dealFeedback, setDealFeedback] = useState<string>("");

  // Flatten all AI players
  const allOpposingPlayers = teams
    .filter(t => t.id !== userTeam.id)
    .flatMap(t => t.roster.map(p => ({ player: p, teamId: t.id, teamName: t.name })))
    .sort((a, b) => b.player.skill - a.player.skill)
    .slice(0, 50); // Just top 50 to keep it clean

  const getIcon = (id: string) => {
    switch(id) {
        case 'soda': return <Beer className="w-5 h-5"/>;
        case 'game': return <Gamepad2 className="w-5 h-5"/>;
        case 'dad': return <Briefcase className="w-5 h-5"/>; // Grilling is serious business
        case 'car': return <Car className="w-5 h-5"/>;
        case 'mom': return <Heart className="w-5 h-5"/>;
        default: return <Gavel className="w-5 h-5"/>;
    }
  };

  const attemptDeal = (deal: DirtyDeal) => {
    if (!selectedPlayer) return;
    if (userTeam.wallet < deal.cost) {
        setDealFeedback(`INSUFFICIENT FUNDS. YOU NEED ${deal.cost} PØKKS.`);
        return;
    }

    onSpend(deal.cost);

    // Calculate probability
    // Harder to get high skill players
    const difficulty = selectedPlayer.player.skill / 100; 
    const chance = deal.maxSuccessChance - (difficulty * 0.2); // slight penalty for good players
    const roll = Math.random();

    if (roll < chance) {
        setDealFeedback(`SUCCESS! THE DEAL WORKED. ${selectedPlayer.player.name.toUpperCase()} IS YOURS.`);
        onPoachPlayer(selectedPlayer.player, selectedPlayer.teamId, 0); // Cost already handled
        setSelectedPlayer(null);
    } else {
        const excuses = [
            "The dad took the grill but kept the kid.",
            "The mom said she's already dating the coach.",
            "The player prefers Xbox over PlayStation.",
            "They called the police. Run!",
            "The soda was warm. Deal off."
        ];
        setDealFeedback(`FAILED! ${excuses[Math.floor(Math.random() * excuses.length)]}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Player List */}
      <div className="lg:col-span-2 border-2 border-green-800 bg-black flex flex-col h-[600px]">
         <div className="bg-green-900/50 p-2 font-bold text-center border-b border-green-700">
            OPPOSING TALENT (TOP 50)
         </div>
         <div className="overflow-y-auto custom-scrollbar flex-1">
            <table className="w-full text-left text-sm">
                <thead className="bg-green-900/20 text-xs sticky top-0">
                    <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2 text-center">Pos</th>
                        <th className="p-2 text-center">Age</th>
                        <th className="p-2 text-center">Skill</th>
                        <th className="p-2 text-center">Team</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-green-900/30">
                    {allOpposingPlayers.map(({ player, teamId, teamName }) => (
                        <tr key={player.id} className={`hover:bg-green-900/20 ${selectedPlayer?.player.id === player.id ? 'bg-green-900/40' : ''}`}>
                            <td className="p-2 font-bold">{player.name}</td>
                            <td className="p-2 text-center">{player.position}</td>
                            <td className="p-2 text-center">{player.age}</td>
                            <td className="p-2 text-center text-amber-400 font-bold">{player.skill}</td>
                            <td className="p-2 text-center text-xs opacity-70 truncate max-w-[100px]">{teamName}</td>
                            <td className="p-2">
                                <button 
                                    onClick={() => {
                                        setSelectedPlayer({ player, teamId });
                                        setDealFeedback("");
                                    }}
                                    className="border border-green-600 px-2 py-1 text-xs hover:bg-green-700 uppercase"
                                >
                                    Select
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* Deal Desk */}
      <div className="border-2 border-green-800 bg-black/80 p-4 flex flex-col">
         <h2 className="text-xl font-bold uppercase text-center border-b-2 border-green-700 pb-2 mb-4">
            BACKROOM CHANNELS
         </h2>
         
         {selectedPlayer ? (
            <div className="flex-1 flex flex-col">
                <div className="mb-4 bg-green-900/20 p-2 border border-green-600">
                    <div className="text-xs opacity-70">TARGET ACQUISITION:</div>
                    <div className="text-lg font-bold text-green-300">{selectedPlayer.player.name}</div>
                    <div className="text-sm">Current Team: {teams.find(t => t.id === selectedPlayer.teamId)?.name}</div>
                </div>

                <div className="text-xs uppercase mb-2 opacity-60">Select Bribe / Method:</div>
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {DIRTY_DEALS.map(deal => (
                        <button
                            key={deal.id}
                            onClick={() => attemptDeal(deal)}
                            disabled={userTeam.wallet < deal.cost}
                            className={`w-full text-left p-3 border border-green-700 hover:bg-green-900/40 transition-all group relative ${userTeam.wallet < deal.cost ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <div className="font-bold flex items-center gap-2">
                                    {getIcon(deal.id)} {deal.label}
                                </div>
                                <div className="text-amber-400 font-bold">{deal.cost} P</div>
                            </div>
                            <div className="text-xs opacity-70 italic group-hover:opacity-100">
                                {deal.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
         ) : (
            <div className="flex-1 flex items-center justify-center text-center opacity-50 p-4">
                SELECT A PLAYER FROM THE LIST TO INITIATE NEGOTIATIONS
            </div>
         )}

         <div className="mt-4 h-24 border border-green-600 bg-black p-2 text-sm font-mono text-green-400">
            <span className="opacity-50">STATUS: </span>
            {dealFeedback || "WAITING FOR INPUT..."}
         </div>
      </div>
    </div>
  );
};
