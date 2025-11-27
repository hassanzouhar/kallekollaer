import React from 'react';
import { ScoutingReport, Team } from '../types';
import { ScanSearch } from 'lucide-react';

interface ScoutingReportsFeedProps {
  reports: ScoutingReport[];
  teams: Team[];
  selectedReportId: string | null;
  onSelectReport: (report: ScoutingReport) => void;
  emptyMessage?: string;
}

export const ScoutingReportsFeed: React.FC<ScoutingReportsFeedProps> = ({ 
  reports, 
  teams,
  selectedReportId,
  onSelectReport,
  emptyMessage = "Awaiting reports..."
}) => {
  return (
    <div className="bg-black border-2 border-green-800 flex flex-col min-h-0">
      <div className="bg-green-900/40 p-2 text-center font-bold border-b border-green-700 flex justify-between items-center">
        <span>INCOMING LEADS</span>
        <span className="text-xs bg-green-900 px-2 rounded">{reports.length}</span>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-3 custom-scrollbar">
        {reports.length === 0 && (
          <div className="text-center opacity-40 mt-10">
            <ScanSearch className="w-12 h-12 mx-auto mb-2"/>
            <p>{emptyMessage}</p>
            <p className="text-xs">Hire scouts and wait for weekly updates.</p>
          </div>
        )}
        {[...reports].reverse().map(report => (
          <div 
            key={report.id} 
            onClick={() => {
              if (report.player) {
                onSelectReport(report);
              }
            }}
            className={`border p-2 cursor-pointer transition-colors text-xs md:text-sm relative
              ${selectedReportId === report.id ? 'bg-green-900/40 border-green-400' : 'border-green-900 hover:bg-green-900/10'}
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
                <div className="grid grid-cols-2 gap-1 text-[10px] mt-2">
                  <span>Age: {report.player.age}</span>
                  <span>Skill: {report.player.skill}</span>
                  <span>Potential: {report.player.potential}</span>
                  <span className="text-purple-400">{report.player.personality}</span>
                </div>
                <div className="flex justify-between items-end mt-1 text-[10px] uppercase">
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
  );
};
