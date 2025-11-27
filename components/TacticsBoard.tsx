import React from 'react';
import { Team, TacticStyle, AggressionLevel } from '../types';
import { TACTICAL_STYLES, AGGRESSION_LEVELS } from '../constants';
import { Shield, Sword, Zap, Activity } from 'lucide-react';

interface TacticsBoardProps {
  team: Team;
  onUpdateTactics: (style: TacticStyle, aggression: AggressionLevel) => void;
}

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ team, onUpdateTactics }) => {
  
  const currentStyle = team.tactics?.style || TacticStyle.BALANCED;
  const currentAggression = team.tactics?.aggression || AggressionLevel.MEDIUM;

  const handleStyleChange = (style: TacticStyle) => {
    onUpdateTactics(style, currentAggression);
  };

  const handleAggressionChange = (aggression: AggressionLevel) => {
    onUpdateTactics(currentStyle, aggression);
  };

  return (
    <div className="bg-black border-2 border-green-800 p-4 h-full">
      <h2 className="text-xl font-bold uppercase border-b-2 border-green-700 pb-2 mb-6 text-center text-green-300 tracking-widest">
        Tactical Mainframe
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* OFFENSIVE STYLE */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Sword className="w-5 h-5" />
            <h3 className="text-lg font-bold uppercase">Playstyle Strategy</h3>
          </div>
          <div className="space-y-2">
            {TACTICAL_STYLES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleStyleChange(t.id)}
                className={`w-full text-left p-3 border-2 transition-all relative group
                  ${currentStyle === t.id 
                    ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300' 
                    : 'border-green-900 hover:border-green-600 text-gray-400'}
                `}
              >
                <div className="font-bold text-sm uppercase">{t.label}</div>
                <div className="text-[10px] opacity-70 mt-1">{t.desc}</div>
                {currentStyle === t.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* DEFENSIVE AGGRESSION */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-red-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-bold uppercase">Physicality</h3>
          </div>
          <div className="space-y-4">
            {AGGRESSION_LEVELS.map((a) => (
              <button
                key={a.id}
                onClick={() => handleAggressionChange(a.id)}
                className={`w-full p-3 border-2 transition-all relative flex justify-between items-center
                  ${currentAggression === a.id 
                    ? 'border-red-500 bg-red-900/30 text-red-300' 
                    : 'border-green-900 hover:border-green-600 text-gray-400'}
                `}
              >
                <div className="text-left">
                    <div className="font-bold text-sm uppercase">{a.label}</div>
                    <div className="text-[10px] opacity-70 mt-1">{a.desc}</div>
                </div>
                {currentAggression === a.id && (
                   <Activity className="w-5 h-5 animate-pulse text-red-500"/>
                )}
              </button>
            ))}
          </div>

          {/* SUMMARY BOX */}
          <div className="mt-8 border border-green-600 bg-green-900/10 p-3">
             <h4 className="text-xs font-bold uppercase mb-2 text-green-400 flex items-center gap-2">
                <Zap className="w-3 h-3"/> Predicted Impact
             </h4>
             <ul className="text-[10px] space-y-1 font-mono opacity-80">
                <li>
                    GOAL CHANCE: 
                    {currentStyle === TacticStyle.DUMP_AND_CHASE || currentStyle === TacticStyle.COUNTER_ATTACK ? ' MODERATE' : ' HIGH'}
                </li>
                <li>
                    FATIGUE RATE: 
                    {currentStyle === TacticStyle.DUMP_AND_CHASE || currentAggression === AggressionLevel.HIGH ? ' HIGH' : ' NORMAL'}
                </li>
                <li>
                    PENALTY RISK:
                    {currentAggression === AggressionLevel.ENFORCER ? ' CRITICAL' : currentAggression === AggressionLevel.HIGH ? ' HIGH' : ' LOW'}
                </li>
             </ul>
             <div className="mt-3 pt-3 border-t border-green-800 text-[10px] opacity-70">
               <div className="font-bold text-green-400 mb-1">LINE TACTICS:</div>
               <div>• L1-L2: Offensive lines (most ice time)</div>
               <div>• L3-L4: Defensive/checking lines</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};