
import React from 'react';
import { Team, StaffMember, StaffRole } from '../types';
import { RetroButton } from './RetroButton';
import { Briefcase, Dumbbell, Gem, GraduationCap, Shirt, Wrench, HandCoins } from 'lucide-react';
import { CHARACTER_IMAGES, getCRTImageStyle } from '../utils/imageHelpers';

interface FrontOfficeProps {
  team: Team;
  onUpgradeStaff: (staffId: string, cost: number) => void;
  onBuyUpgrade: (type: 'equipment' | 'swag', cost: number) => void;
  onDugnad: () => void;
  dugnadCooldown: boolean;
}

const STAFF_UPGRADE_COST_BASE = 5;
const EQUIPMENT_COST_BASE = 15;
const SWAG_COST_BASE = 12;

export const FrontOffice: React.FC<FrontOfficeProps> = ({ team, onUpgradeStaff, onBuyUpgrade, onDugnad, dugnadCooldown }) => {

  const getRoleIcon = (role: StaffRole) => {
    switch(role) {
      case StaffRole.HEAD_COACH: return <Briefcase className="w-6 h-6 text-amber-400"/>;
      case StaffRole.ASSISTANT: return <Dumbbell className="w-6 h-6 text-cyan-400"/>;
      case StaffRole.FIXER: return <Wrench className="w-6 h-6 text-red-400"/>;
    }
  };

  const getRoleDescription = (role: StaffRole) => {
    switch(role) {
      case StaffRole.HEAD_COACH: return "Improves overall team skill during matches.";
      case StaffRole.ASSISTANT: return "Boosts player training effectiveness.";
      case StaffRole.FIXER: return "Increases Dugnad income & Deal success.";
    }
  };

  const getUpgradeCost = (currentLevel: number, base: number) => {
      return base * (currentLevel + 1);
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b-2 border-green-700 pb-2">
        <div>
            <h2 className="text-3xl font-bold uppercase text-green-400 text-glow">Front Office</h2>
            <p className="text-sm opacity-70">Manage staff, upgrade facilities, and buy team gear.</p>
        </div>
        <div className="text-xl font-bold text-amber-400 bg-black px-4 py-1 border border-green-600">
            Lagkassa: {team.wallet} P
        </div>
      </div>

      {/* FUNDRAISING */}
      <div className="bg-black border-2 border-green-800 p-4 flex gap-4 items-center">
        {/* Hockey Mom Image */}
        <img
          src={CHARACTER_IMAGES.fan}
          alt="Community Support"
          className="w-20 h-20 border-2 border-green-600 flex-shrink-0"
          style={getCRTImageStyle()}
        />
        <div className="flex-1">
            <h3 className="text-xl font-bold uppercase text-green-300">Community Dugnad</h3>
            <p className="text-sm opacity-60">Organize waffle sales and lotteries to raise funds.</p>
        </div>
        <RetroButton
            onClick={onDugnad}
            disabled={dugnadCooldown}
            className={dugnadCooldown ? 'opacity-50 cursor-not-allowed' : ''}
        >
            <HandCoins className="inline mr-2 w-4 h-4" />
            {dugnadCooldown ? "COOLDOWN" : "RUN DUGNAD (+2 P)"}
        </RetroButton>
      </div>

      {/* STAFF SECTION */}
      <div>
        <h3 className="text-xl font-bold mb-4 bg-green-900/30 p-2 border-l-4 border-green-500 uppercase">Coaching Staff</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {team.staff.map(staff => {
                const cost = getUpgradeCost(staff.level, STAFF_UPGRADE_COST_BASE);
                return (
                    <div key={staff.id} className="border-2 border-green-800 bg-black p-4 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 bg-green-900/50 text-xs font-bold">LVL {staff.level}</div>
                        <div className="flex items-center gap-3 mb-2">
                            {getRoleIcon(staff.role)}
                            <div>
                                <div className="font-bold text-lg leading-none">{staff.name}</div>
                                <div className="text-xs opacity-70 uppercase">{staff.role.replace('_', ' ')}</div>
                            </div>
                        </div>
                        <p className="text-xs opacity-60 italic mb-4 min-h-[32px]">
                            {getRoleDescription(staff.role)}
                        </p>
                        <div className="mt-auto">
                            <div className="text-[10px] uppercase mb-1 text-center opacity-80">Skill Upgrade Course</div>
                            <RetroButton 
                                onClick={() => onUpgradeStaff(staff.id, cost)}
                                disabled={team.wallet < cost || staff.level >= 10}
                                className="w-full text-sm py-1"
                                variant={team.wallet >= cost ? 'default' : 'danger'}
                            >
                                {staff.level >= 10 ? "MAX LEVEL" : `UPGRADE (${cost} P)`}
                            </RetroButton>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* CLUB UPGRADES SECTION */}
      <div>
        <h3 className="text-xl font-bold mb-4 bg-green-900/30 p-2 border-l-4 border-green-500 uppercase">Club Equipment & Swag</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* EQUIPMENT */}
            <div className="border-2 border-green-800 bg-black p-4 flex gap-4">
                <div className="w-1/3 flex flex-col items-center justify-center border-r border-green-900 pr-4">
                    <Gem className="w-12 h-12 text-cyan-300 mb-2"/>
                    <div className="text-2xl font-bold">{team.upgrades.equipmentLevel}/5</div>
                    <div className="text-[10px] opacity-60">CURRENT LEVEL</div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg uppercase text-cyan-300">Pro Equipment</h4>
                        <p className="text-xs opacity-70">Better sticks and skates directly improve player performance on the ice.</p>
                    </div>
                    <RetroButton 
                        onClick={() => onBuyUpgrade('equipment', getUpgradeCost(team.upgrades.equipmentLevel, EQUIPMENT_COST_BASE))}
                        disabled={team.wallet < getUpgradeCost(team.upgrades.equipmentLevel, EQUIPMENT_COST_BASE) || team.upgrades.equipmentLevel >= 5}
                        className="w-full mt-2 text-sm"
                    >
                        {team.upgrades.equipmentLevel >= 5 ? "MAXED OUT" : `BUY UPGRADE (${getUpgradeCost(team.upgrades.equipmentLevel, EQUIPMENT_COST_BASE)} P)`}
                    </RetroButton>
                </div>
            </div>

            {/* SWAG */}
            <div className="border-2 border-green-800 bg-black p-4 flex gap-4">
                <div className="w-1/3 flex flex-col items-center justify-center border-r border-green-900 pr-4">
                    <Shirt className="w-12 h-12 text-purple-400 mb-2"/>
                    <div className="text-2xl font-bold">{team.upgrades.swagLevel}/5</div>
                    <div className="text-[10px] opacity-60">CURRENT LEVEL</div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg uppercase text-purple-400">Team Swag</h4>
                        <p className="text-xs opacity-70">Cool jackets and merch improve morale recovery and team spirit.</p>
                    </div>
                    <RetroButton 
                        onClick={() => onBuyUpgrade('swag', getUpgradeCost(team.upgrades.swagLevel, SWAG_COST_BASE))}
                        disabled={team.wallet < getUpgradeCost(team.upgrades.swagLevel, SWAG_COST_BASE) || team.upgrades.swagLevel >= 5}
                        className="w-full mt-2 text-sm"
                    >
                        {team.upgrades.swagLevel >= 5 ? "MAXED OUT" : `BUY UPGRADE (${getUpgradeCost(team.upgrades.swagLevel, SWAG_COST_BASE)} P)`}
                    </RetroButton>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
};
