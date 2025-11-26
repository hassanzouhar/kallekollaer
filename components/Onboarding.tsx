
import React, { useState } from 'react';
import { Team } from '../types';
import { RetroButton } from './RetroButton';
import { Shield, Star, Briefcase, CheckCircle } from 'lucide-react';
import { CHARACTER_IMAGES, getCRTImageStyle } from '../utils/imageHelpers';

interface OnboardingProps {
  teams: Team[];
  onComplete: (starterTeamId: string, dreamTeamId: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ teams, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dreamTeamId, setDreamTeamId] = useState<string | null>(null);
  const [selectedStarterId, setSelectedStarterId] = useState<string | null>(null);

  // Step 1: Choose Favorite
  // Step 2: Choose Starter (Low Tier)
  // Step 3: Confirm

  // Filter lower tier teams for starter options (e.g. bottom 50% by default points if we had them, or random)
  // For now, lets just pick 3 random teams excluding the dream team
  const [offerTeams] = useState<Team[]>(() => {
      const shuffled = [...teams].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
  });

  const handleSelectDream = (id: string) => {
      setDreamTeamId(id);
      setStep(2);
  };

  const handleSelectStarter = (id: string) => {
      setSelectedStarterId(id);
      setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-4xl mx-auto">

      <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 font-vt323 mb-2 text-glow">MANAGER PROFILE</h1>
          <p className="text-xl opacity-70 uppercase tracking-widest">Initialize Career Protocol</p>

          {/* Welcome Character */}
          <div className="mt-6 flex items-center justify-center gap-4 bg-black/50 border border-green-800 p-4 rounded">
            <img
              src={CHARACTER_IMAGES.fan}
              alt="Welcome"
              className="w-16 h-16 border-2 border-green-600"
              style={getCRTImageStyle()}
            />
            <div className="text-left text-sm italic text-green-300">
              "Welcome to Norwegian youth hockey!<br/>Let's build your coaching career."
            </div>
          </div>
      </div>

      {step === 1 && (
          <div className="w-full animate-in fade-in duration-500">
              <h2 className="text-2xl text-center mb-6 border-b border-green-800 pb-2 flex items-center justify-center gap-2">
                  <Star className="text-amber-400"/> SELECT DREAM CLUB <Star className="text-amber-400"/>
              </h2>
              <p className="text-center mb-6 text-sm opacity-60">This is your ultimate goal. The board will watch your career with interest.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                  {teams.map(t => (
                      <button
                          key={t.id}
                          onClick={() => handleSelectDream(t.id)}
                          className="border-2 border-green-900 hover:border-green-400 hover:bg-green-900/20 p-4 flex flex-col items-center gap-2 transition-all group"
                      >
                          <Shield className="w-10 h-10 text-green-700 group-hover:text-green-400"/>
                          <span className="font-bold text-lg text-center leading-none">{t.name}</span>
                          <span className="text-xs opacity-50 uppercase">{t.city}</span>
                      </button>
                  ))}
              </div>
          </div>
      )}

      {step === 2 && (
          <div className="w-full max-w-2xl animate-in slide-in-from-right duration-500">
              <h2 className="text-2xl text-center mb-6 border-b border-green-800 pb-2 flex items-center justify-center gap-2">
                  <Briefcase className="text-cyan-400"/> JOB OFFERS (SEASON 1)
              </h2>
              <p className="text-center mb-6 text-sm opacity-60">
                  Your reputation is low. Only these clubs are willing to take a risk on a rookie manager.
                  <br/>Win games to earn a contract with {teams.find(t => t.id === dreamTeamId)?.name}.
              </p>

              <div className="space-y-4">
                  {offerTeams.map(t => (
                      <div key={t.id} className="border border-green-700 bg-black p-4 flex justify-between items-center hover:border-green-400 transition-colors">
                          <div>
                              <div className="text-xl font-bold text-green-300">{t.name}</div>
                              <div className="text-xs opacity-70">BUDGET: Low | EXPECTATION: Develop Youth</div>
                          </div>
                          <RetroButton onClick={() => handleSelectStarter(t.id)}>ACCEPT OFFER</RetroButton>
                      </div>
                  ))}
              </div>
              <div className="mt-8 text-center">
                  <button onClick={() => setStep(1)} className="text-xs text-red-400 hover:underline">BACK</button>
              </div>
          </div>
      )}

      {step === 3 && selectedStarterId && (
          <div className="text-center w-full max-w-lg animate-in zoom-in duration-300 border-4 border-green-600 p-8 bg-black">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
              <h2 className="text-3xl font-bold mb-4 text-white">CONTRACT SIGNED</h2>
              <div className="text-lg mb-6">
                  You are now the Head Coach of <br/>
                  <span className="text-2xl text-green-400 font-bold">{teams.find(t => t.id === selectedStarterId)?.name}</span>
              </div>

              {/* Board Representative */}
              <div className="bg-green-900/20 p-4 border border-green-800 mb-6 flex items-center gap-4">
                  <img
                    src={CHARACTER_IMAGES.sponsor}
                    alt="Board Rep"
                    className="w-20 h-20 border-2 border-green-600 flex-shrink-0"
                    style={getCRTImageStyle()}
                  />
                  <div className="text-sm italic text-left text-green-200">
                      "Welcome aboard. The board expects you to work hard. Don't let us down."
                  </div>
              </div>

              <RetroButton
                variant="primary"
                className="w-full py-4 text-xl"
                onClick={() => onComplete(selectedStarterId, dreamTeamId!)}
              >
                  BEGIN CAREER
              </RetroButton>
          </div>
      )}

    </div>
  );
};
