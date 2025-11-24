import React from 'react';
import { Team, JobOffer } from '../types';
import { RetroButton } from './RetroButton';
import { Building2, Trophy, UserMinus, Briefcase } from 'lucide-react';

interface ContractDeskProps {
  currentTeam: Team;
  jobOffers: JobOffer[];
  graduatingPlayersCount: number;
  onRenew: () => void;
  onAcceptOffer: (offer: JobOffer) => void;
}

export const ContractDesk: React.FC<ContractDeskProps> = ({
  currentTeam,
  jobOffers,
  graduatingPlayersCount,
  onRenew,
  onAcceptOffer
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 h-full flex flex-col">
        <div className="text-center mb-8 border-b-4 border-green-600 pb-4">
            <h1 className="text-4xl font-bold text-green-400 mb-2">OFF-SEASON HEADQUARTERS</h1>
            <p className="text-lg opacity-70">Season Complete. Review your status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto">
            
            {/* CURRENT STATUS */}
            <div className="border-2 border-green-800 bg-black p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 border-b border-green-800 pb-2 flex items-center gap-2">
                    <Building2 className="text-green-500"/> CURRENT CLUB
                </h2>
                
                <div className="mb-6">
                    <div className="text-3xl font-bold text-white">{currentTeam.name}</div>
                    <div className="text-sm opacity-60">SEASON PERFORMANCE</div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                        <div className="bg-green-900/20 border border-green-800 p-2">
                            <div className="text-2xl font-bold text-green-400">{currentTeam.wins}</div>
                            <div className="text-[10px]">WINS</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-800 p-2">
                            <div className="text-2xl font-bold text-amber-400">{currentTeam.points}</div>
                            <div className="text-[10px]">POINTS</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-800 p-2">
                            <div className="text-2xl font-bold text-white">{currentTeam.goalsFor}</div>
                            <div className="text-[10px]">GOALS</div>
                        </div>
                    </div>
                </div>

                <div className="bg-red-900/20 border border-red-800 p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                        <UserMinus className="w-5 h-5"/> SQUAD TURNOVER
                    </div>
                    <p className="text-sm">
                        <span className="font-bold text-white">{graduatingPlayersCount} players</span> have aged out of U18 (19+) and will leave the club. 
                        Rookies will be promoted to fill their spots.
                    </p>
                </div>

                <div className="mt-auto">
                    <RetroButton onClick={onRenew} className="w-full py-4" variant="default">
                        RENEW CONTRACT (STAY)
                    </RetroButton>
                    <p className="text-center text-xs mt-2 opacity-50">Continue building your legacy here.</p>
                </div>
            </div>

            {/* JOB MARKET */}
            <div className="border-2 border-green-800 bg-black p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 border-b border-green-800 pb-2 flex items-center gap-2">
                    <Briefcase className="text-amber-500"/> JOB OFFERS
                </h2>

                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
                    {jobOffers.length === 0 ? (
                        <div className="text-center opacity-50 mt-10 italic">
                            No other clubs are interested in your services right now.
                        </div>
                    ) : (
                        jobOffers.map(offer => (
                            <div key={offer.id} className="border border-green-600 bg-green-900/10 p-4 hover:bg-green-900/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xl font-bold text-green-300">{offer.teamName}</div>
                                    <div className="text-amber-400 font-bold">+{offer.signingBonus} P</div>
                                </div>
                                <div className="text-xs mb-3 space-y-1 opacity-80">
                                    <div>EXPECTATION: {offer.expectations}</div>
                                </div>
                                <RetroButton 
                                    onClick={() => onAcceptOffer(offer)} 
                                    variant="primary" 
                                    className="w-full text-sm py-2"
                                >
                                    ACCEPT OFFER
                                </RetroButton>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};