import React, { useState } from 'react';
import { DirtyDeal, Team, Player, ScoutingReport } from '../types';
import { DIRTY_DEALS } from '../constants';
import { Briefcase, Beer, Gamepad2, Car, Heart, Gavel } from 'lucide-react';

interface DealTarget {
  name: string;
  age: number;
  position: string;
  potential: number;
  sourceTeamId?: string;
  sourceTeamName?: string;
}

interface DealNegotiationDeskProps {
  selectedTarget: DealTarget | null;
  wallet: number;
  teams?: Team[];
  onAttemptDeal: (deal: DirtyDeal) => void;
  dealFeedback: string;
}

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

export const DealNegotiationDesk: React.FC<DealNegotiationDeskProps> = ({ 
  selectedTarget, 
  wallet, 
  teams,
  onAttemptDeal,
  dealFeedback
}) => {
  return (
    <div className="bg-black border-2 border-green-800 flex flex-col p-4 relative h-full">
      <div className="absolute top-0 right-0 bg-green-900 text-[10px] px-2">BACKROOM</div>
      <h2 className="text-xl font-bold uppercase text-center border-b-2 border-green-700 pb-2 mb-4">NEGOTIATION</h2>
      
      {selectedTarget ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-green-900/20 p-3 border border-green-600 mb-4">
            <div className="text-xs opacity-60 uppercase mb-1">Target Asset</div>
            <div className="text-xl font-bold text-white">{selectedTarget.name}</div>
            <div className="flex gap-4 text-xs mt-1">
              <span>AGE: {selectedTarget.age}</span>
              <span>POS: {selectedTarget.position}</span>
              <span>POT: {'*'.repeat(Math.ceil(selectedTarget.potential/20))}</span>
            </div>
            {selectedTarget.sourceTeamId && selectedTarget.sourceTeamName && (
              <div className="mt-2 text-xs text-red-300 border-t border-red-900 pt-1">
                ⚠ CONTRACTED TO: {selectedTarget.sourceTeamName}
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
                onClick={() => onAttemptDeal(deal)}
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
          <p>SELECT A TARGET TO OPEN NEGOTIATIONS.</p>
        </div>
      )}

      {/* Feedback Area */}
      <div className="mt-4 min-h-[60px] border border-green-600 bg-black p-2 text-xs font-mono text-green-300">
        <span className="opacity-50 mr-2">LOG:</span>
        {dealFeedback || "Waiting for user input..."}
      </div>
    </div>
  );
};
