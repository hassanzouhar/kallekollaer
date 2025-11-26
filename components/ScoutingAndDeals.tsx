import React, { useState } from 'react';
import { Scout, ScoutingReport, DirtyDeal, Team } from '../types';
import { RetroButton } from './RetroButton';
import { AVAILABLE_SCOUTS, DIRTY_DEALS } from '../constants';
import { ScanSearch, Briefcase, Beer, Gamepad2, Car, Heart, Gavel } from 'lucide-react';

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

  const getIcon = (id: string) => {
    switch(id) {
        case 'soda': return <Beer className="w-4 h-4"/>;
        case 'game': return <Gamepad2 className="w-4 h-4"/>;
        case 'dad': return <Briefcase className="w-4 h-4"/>; 
        case 'car': return <Car className="w-4 h-4"/>;
        case 'mom': return <Heart className="w-4 h-4"/>;
        default: return <Gavel className="w-4 h-4"/>;
    }
  };

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
      <div className="bg-black border-2 border-green-800 flex flex-col min-h-0">
          <div className="bg-green-900/40 p-2 text-center font-bold border-b border-green-700 flex justify-between items-center">
              <span>INCOMING LEADS</span>
              <span className="text-xs bg-green-900 px-2 rounded">{reports.length}</span>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-3 custom-scrollbar">
              {reports.length === 0 && (
                  <div className="text-center opacity-40 mt-10">
                      <ScanSearch className="w-12 h-12 mx-auto mb-2"/>
                      <p>Awaiting reports...</p>
                      <p className="text-xs">Hire scouts and wait for weekly updates.</p>
                  </div>
              )}
              {[...reports].reverse().map(report => (
                  <div 
                    key={report.id} 
                    onClick={() => {
                        if (report.player) {
                            setSelectedReport(report);
                            setDealFeedback("");
                        }
                    }}
                    className={`border p-2 cursor-pointer transition-colors text-xs md:text-sm relative
                        ${selectedReport?.id === report.id ? 'bg-green-900/40 border-green-400' : 'border-green-900 hover:bg-green-900/10'}
                        ${!report.player ? 'border-red-900/50 opacity-70' : ''}
                    `}
                  >
                      <div className="flex justify-between opacity-50 text-[10px] mb-1">
                          <span>{report.date}</span>
                          <span>SCOUT: {report.scoutName}</span>
                      </div>
                      
                      {report.player ? (
                          <>
                            <div className="font-bold text-green-300 flex justify-between">
                                <span>{report.player.name}</span>
                                <span className="text-white bg-green-800 px-1">{report.player.position}</span>
                            </div>
                            <div className="my-1 opacity-80 italic">"{report.description}"</div>
                            <div className="flex justify-between items-end mt-2 text-[10px] uppercase">
                                <span>Est. Skill: {report.player.skill}</span>
                                {report.sourceTeamId ? (
                                    <span className="text-red-400 font-bold">RIVAL: {teams.find(t => t.id === report.sourceTeamId)?.name}</span>
                                ) : (
                                    <span className="text-cyan-400 font-bold">FREE AGENT</span>
                                )}
                            </div>
                          </>
                      ) : (
                          <div className="text-red-400 italic">MISHAP: {report.description}</div>
                      )}
                  </div>
              ))}
          </div>
      </div>

      {/* RIGHT: DEAL DESK */}
      <div className="bg-black border-2 border-green-800 flex flex-col p-4 relative">
          <div className="absolute top-0 right-0 bg-green-900 text-[10px] px-2">BACKROOM</div>
          <h2 className="text-xl font-bold uppercase text-center border-b-2 border-green-700 pb-2 mb-4">NEGOTIATION</h2>
          
          {selectedReport ? (
              <div className="flex-1 flex flex-col">
                  <div className="bg-green-900/20 p-3 border border-green-600 mb-4">
                      <div className="text-xs opacity-60 uppercase mb-1">Target Asset</div>
                      <div className="text-xl font-bold text-white">{selectedReport.player.name}</div>
                      <div className="flex gap-4 text-xs mt-1">
                          <span>AGE: {selectedReport.player.age}</span>
                          <span>POS: {selectedReport.player.position}</span>
                          <span>POT: {'*'.repeat(Math.ceil(selectedReport.player.potential/20))}</span>
                      </div>
                      {selectedReport.sourceTeamId && (
                           <div className="mt-2 text-xs text-red-300 border-t border-red-900 pt-1">
                               ⚠ CONTRACTED TO: {teams.find(t => t.id === selectedReport.sourceTeamId)?.name}
                               <br/>
                               (Higher difficulty to sign)
                           </div>
                      )}
                  </div>

                  <div className="text-xs uppercase mb-2 font-bold opacity-70">Select Approach:</div>
                  <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
                      {DIRTY_DEALS.map(deal => (
                          <button
                            type="button"
                            key={deal.id}
                            onClick={() => handleAttemptDeal(deal)}
                            disabled={wallet < deal.cost}
                            className={`w-full text-left p-2 border transition-all flex justify-between items-center group
                                ${wallet < deal.cost ? 'border-gray-800 opacity-40 cursor-not-allowed' : 'border-green-700 hover:bg-green-900/40 hover:border-green-400'}
                            `}
                          >
                              <div className="flex items-center gap-2">
                                  {getIcon(deal.id)}
                                  <div>
                                      <div className="font-bold text-sm">{deal.label}</div>
                                      <div className="text-[10px] opacity-60 hidden group-hover:block">{deal.description}</div>
                                  </div>
                              </div>
                              <div className="font-bold text-amber-400 text-sm whitespace-nowrap">{deal.cost} P</div>
                          </button>
                      ))}
                  </div>
              </div>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center">
                  <Briefcase className="w-16 h-16 mb-4"/>
                  <p>SELECT A REPORT FROM THE FEED TO OPEN NEGOTIATIONS.</p>
              </div>
          )}

          {/* Feedback Area */}
          <div className="mt-4 min-h-[60px] border border-green-600 bg-black p-2 text-xs font-mono text-green-300">
             <span className="opacity-50 mr-2">LOG:</span>
             {dealFeedback || "Waiting for user input..."}
          </div>
      </div>
    </div>
  );
};