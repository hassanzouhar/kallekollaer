import React, { useState } from 'react';
import { Scout, ScoutingReport, DirtyDeal, Team } from '../types';
import { RetroButton } from './RetroButton';
import { AVAILABLE_SCOUTS } from '../constants';
import { DealNegotiationDesk } from './DealNegotiationDesk';
import { ScoutingReportsFeed } from './ScoutingReportsFeed';

interface ScoutingAndDealsProps {
  wallet: number;
  hiredScouts: Scout[];
  reports: ScoutingReport[];
  teams: Team[];
  onHire: (scout: Scout) => void;
  onFire: (scoutId: string) => void;
  onSignPlayer: (report: ScoutingReport, deal: DirtyDeal) => void;
}

export const ScoutingAndDeals: React.FC<ScoutingAndDealsProps> = ({ 
  wallet, 
  hiredScouts, 
  reports, 
  teams,
  onHire, 
  onFire,
  onSignPlayer
}) => {
  const [selectedReport, setSelectedReport] = useState<ScoutingReport | null>(null);
  const [dealFeedback, setDealFeedback] = useState<string>("");

  const isHired = (id: string) => hiredScouts.some(s => s.id === id);

  const handleAttemptDeal = (deal: DirtyDeal) => {
      if (!selectedReport) return;
      if (wallet < deal.cost) {
          setDealFeedback(`INSUFFICIENT PØKKS! NEED ${deal.cost}.`);
          return;
      }

      // Calculate success chance (random between min and max)
      const successChance = deal.minSuccessChance +
          (Math.random() * (deal.maxSuccessChance - deal.minSuccessChance));

      // Apply difficulty modifier if player is contracted to another team
      const difficultyMod = selectedReport.sourceTeamId ? 0.7 : 1.0;
      const finalChance = successChance * difficultyMod;

      // Roll for success
      const roll = Math.random();

      if (roll < finalChance) {
          // Success! Sign player and deduct cost
          onSignPlayer(selectedReport, deal);
          setDealFeedback(`SUCCESS! ${selectedReport.player.name} signed for ${deal.cost} PØKKS. (${Math.round(finalChance * 100)}% success rate)`);
          setSelectedReport(null);
      } else {
          // Failure - player refused. Keep money and report, user can try again with better deal
          setDealFeedback(`DEAL REJECTED! ${selectedReport.player.name} declined ${deal.label}. Try a better offer? (Had ${Math.round(finalChance * 100)}% chance)`);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      
      {/* LEFT: SCOUT MANAGEMENT */}
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="bg-black border-2 border-green-800 p-2 flex-1 flex flex-col min-h-0">
            <h2 className="text-lg font-bold border-b border-green-700 pb-1 mb-2 text-center bg-green-900/20">SCOUT ROSTER</h2>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
                {hiredScouts.length === 0 && <p className="text-xs opacity-50 text-center italic">No scouts hired.</p>}
                {hiredScouts.map(s => (
                    <div key={s.id} className="flex justify-between items-center bg-green-900/10 p-2 border border-green-800 text-xs">
                        <div>
                            <div className="font-bold">{s.name}</div>
                            <div className="opacity-60">{s.region} ({s.costPerWeek}p/w)</div>
                        </div>
                        <button type="button" onClick={() => onFire(s.id)} className="text-red-400 hover:text-red-300 underline">FIRE</button>
                    </div>
                ))}
            </div>
            
            <h2 className="text-lg font-bold border-b border-green-700 pb-1 mt-4 mb-2 text-center bg-green-900/20">HIRE NEW</h2>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
                {AVAILABLE_SCOUTS.map(scout => (
                    <div key={scout.id} className={`border border-green-800 p-2 bg-black text-xs ${isHired(scout.id) ? 'opacity-30' : ''}`}>
                        <div className="flex justify-between mb-1">
                            <span className="font-bold">{scout.name}</span>
                            <span className="text-amber-400">{scout.costPerWeek}P</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="opacity-70">Skl: {scout.skill} | {scout.region}</span>
                             {!isHired(scout.id) && (
                                <button
                                    type="button"
                                    onClick={() => onHire(scout)}
                                    disabled={wallet < scout.costPerWeek}
                                    className={`px-2 py-0.5 border ${wallet >= scout.costPerWeek ? 'border-green-500 hover:bg-green-900' : 'border-red-900 text-red-900'}`}
                                >
                                    HIRE
                                </button>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* CENTER: REPORT FEED */}
      <ScoutingReportsFeed
        reports={reports}
        teams={teams}
        selectedReportId={selectedReport?.id || null}
        onSelectReport={(report) => {
          setSelectedReport(report);
          setDealFeedback("");
        }}
      />

      {/* RIGHT: DEAL DESK */}
      <DealNegotiationDesk
        selectedTarget={selectedReport ? {
          name: selectedReport.player.name,
          age: selectedReport.player.age,
          position: selectedReport.player.position,
          potential: selectedReport.player.potential,
          sourceTeamId: selectedReport.sourceTeamId,
          sourceTeamName: selectedReport.sourceTeamId ? teams.find(t => t.id === selectedReport.sourceTeamId)?.name : undefined
        } : null}
        wallet={wallet}
        teams={teams}
        onAttemptDeal={handleAttemptDeal}
        dealFeedback={dealFeedback}
      />
    </div>
  );
};