import React from 'react';
import { Scout, ScoutingReport } from '../types';
import { RetroButton } from './RetroButton';
import { AVAILABLE_SCOUTS } from '../constants';
import { ScanSearch, UserMinus, UserPlus } from 'lucide-react';

interface ScoutingOfficeProps {
  wallet: number;
  hiredScouts: Scout[];
  reports: ScoutingReport[];
  onHire: (scout: Scout) => void;
  onFire: (scoutId: string) => void;
}

export const ScoutingOffice: React.FC<ScoutingOfficeProps> = ({ 
  wallet, 
  hiredScouts, 
  reports, 
  onHire, 
  onFire 
}) => {
  const isHired = (id: string) => hiredScouts.some(s => s.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Hiring Desk */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b-2 border-green-700 pb-2 mb-4">AVAILABLE SCOUTS</h2>
        <div className="space-y-4">
          {AVAILABLE_SCOUTS.map(scout => (
            <div key={scout.id} className={`border border-green-800 p-3 bg-black ${isHired(scout.id) ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-lg">{scout.name}</div>
                  <div className="text-xs opacity-70">REGION: {scout.region}</div>
                </div>
                <div className="text-amber-400 font-bold">{scout.costPerWeek} P/WK</div>
              </div>
              <div className="flex justify-between items-center">
                 <div className="text-sm">SKILL: {'I'.repeat(scout.skill)}</div>
                 {isHired(scout.id) ? (
                   <span className="text-green-500 font-bold border border-green-500 px-2 py-1 text-xs">ON PAYROLL</span>
                 ) : (
                   <RetroButton 
                     onClick={() => onHire(scout)} 
                     disabled={wallet < scout.costPerWeek}
                     className="px-3 py-1 text-xs"
                     variant={wallet >= scout.costPerWeek ? 'default' : 'danger'}
                   >
                     HIRE
                   </RetroButton>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports & Active Staff */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold border-b-2 border-green-700 pb-2 mb-4">ACTIVE STAFF</h2>
          {hiredScouts.length === 0 ? (
            <p className="opacity-50 italic">No scouts hired. You are blind out there.</p>
          ) : (
            <ul className="space-y-2">
              {hiredScouts.map(s => (
                <li key={s.id} className="flex justify-between items-center bg-green-900/20 p-2 border border-green-800">
                   <div>
                     <span className="font-bold">{s.name}</span>
                     <span className="block text-xs opacity-60">Searching in {s.region}</span>
                   </div>
                   <button 
                     onClick={() => onFire(s.id)}
                     className="text-red-400 hover:text-red-200 text-xs underline"
                   >
                     FIRE
                   </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <h2 className="text-xl font-bold border-b-2 border-green-700 pb-2 mb-4">INCOMING REPORTS</h2>
          <div className="bg-black border-2 border-green-800 p-2 overflow-y-auto h-80 space-y-3 font-mono text-sm">
            {reports.length === 0 && <p className="opacity-50 text-center mt-10">NO REPORTS YET. WAIT FOR NEXT WEEK.</p>}
            {[...reports].reverse().map(report => (
              <div key={report.id} className="border-b border-green-900 pb-2 mb-2">
                 <div className="flex justify-between text-green-300 text-xs mb-1">
                   <span>FROM: {report.scoutName.toUpperCase()}</span>
                   <span>{report.date}</span>
                 </div>
                 {report.player ? (
                   <div>
                     <div className="font-bold text-lg text-white">{report.player.name} ({report.player.age}yo {report.player.position})</div>
                     <p className="opacity-80 italic">"{report.description}"</p>
                     <div className="mt-1 text-amber-400">
                       EST. SKILL: {report.player.skill} | POTENTIAL: {'*'.repeat(Math.ceil(report.player.potential / 20))}
                     </div>
                   </div>
                 ) : (
                   <div className="text-red-400 font-bold">
                     ⚠ MISHAP: {report.description}
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
