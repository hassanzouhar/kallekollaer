import React from 'react';
import { Team } from '../types';

interface StandingsProps {
  teams: Team[];
}

export const Standings: React.FC<StandingsProps> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-4 uppercase text-center bg-green-800 text-black font-bold py-1">League Table</h2>
      <div className="border-4 border-green-800 p-1">
        <table className="w-full text-left font-mono">
          <thead className="bg-green-900 text-green-100 uppercase">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Team</th>
              <th className="p-2 text-center">P</th>
              <th className="p-2 text-center">W</th>
              <th className="p-2 text-center">L</th>
              <th className="p-2 text-center">D</th>
              <th className="p-2 text-center">GF</th>
              <th className="p-2 text-center">GA</th>
              <th className="p-2 text-center">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-800">
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className={`${index % 2 === 0 ? 'bg-black' : 'bg-green-900/10'} hover:bg-green-800/40`}>
                <td className="p-2 font-bold">{index + 1}</td>
                <td className="p-2">{team.name}</td>
                <td className="p-2 text-center">{team.wins + team.losses + team.draws}</td>
                <td className="p-2 text-center text-green-400">{team.wins}</td>
                <td className="p-2 text-center text-red-400">{team.losses}</td>
                <td className="p-2 text-center text-yellow-400">{team.draws}</td>
                <td className="p-2 text-center opacity-70">{team.goalsFor}</td>
                <td className="p-2 text-center opacity-70">{team.goalsAgainst}</td>
                <td className="p-2 text-center font-bold text-xl">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
