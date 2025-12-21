import React from 'react';
import {
    Users,
    Crown,
    AlertCircle,
    CheckCircle2,
    UserPlus,
    Globe,
    Filter
} from 'lucide-react';

interface FilterState {
    vipOnly: boolean;
    realtimeOnly: boolean;
    depositIssues: boolean;
    signupsOnly: boolean;
    trafficSource: string;
    playerStatus: string;
    status: string;
}

interface FiltersBarProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
    counts: {
        all: number;
        vip: number;
        issues: number;
        online: number;
        resolved: number;
        signups: number;
    };
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onFilterChange, counts }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {/* Realtime Players */}
            <button
                onClick={() => onFilterChange('realtimeOnly', !filters.realtimeOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${filters.realtimeOnly
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
                    }`}
            >
                <Users className="w-3.5 h-3.5" />
                Realtime
                <span className="bg-slate-900/50 px-1.5 rounded text-[10px] ml-1">{counts.online}</span>
            </button>

            {/* VIP Toggle */}
            <button
                onClick={() => onFilterChange('vipOnly', !filters.vipOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${filters.vipOnly
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
                    }`}
            >
                <Crown className="w-3.5 h-3.5" />
                VIP
                <span className="bg-slate-900/50 px-1.5 rounded text-[10px] ml-1">{counts.vip}</span>
            </button>

            {/* Deposit Issues */}
            <button
                onClick={() => onFilterChange('depositIssues', !filters.depositIssues)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${filters.depositIssues
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
                    }`}
            >
                <AlertCircle className="w-3.5 h-3.5" />
                Issues
                <span className="bg-slate-900/50 px-1.5 rounded text-[10px] ml-1">{counts.issues}</span>
            </button>

            {/* Signups Only */}
            <button
                onClick={() => onFilterChange('signupsOnly', !filters.signupsOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${filters.signupsOnly
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
                    }`}
            >
                <UserPlus className="w-3.5 h-3.5" />
                Signups
                <span className="bg-slate-900/50 px-1.5 rounded text-[10px] ml-1">{counts.signups}</span>
            </button>

            {/* Resolved Tab */}
            <button
                onClick={() => onFilterChange('status', filters.status === 'resolved' ? 'all' : 'resolved')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${filters.status === 'resolved'
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'
                    }`}
            >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recently Resolved
                <span className="bg-slate-900/50 px-1.5 rounded text-[10px] ml-1">{counts.resolved}</span>
            </button>

            <div className="w-px h-6 bg-gray-700 mx-2 hidden sm:block"></div>

            {/* Player Status Filter */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 focus-within:border-blue-500/50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-blue-400" />
                <select
                    value={filters.playerStatus}
                    onChange={(e) => onFilterChange('playerStatus', e.target.value)}
                    className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer pr-1 appearance-none hover:text-white"
                >
                    <option value="all" className="bg-slate-900">All Statuses</option>
                    <option value="active" className="bg-slate-900">Active</option>
                    <option value="vip" className="bg-slate-900">VIP</option>
                    <option value="blocked" className="bg-slate-900">Blocked</option>
                    <option value="bonus_abuser" className="bg-slate-900">Bonus Abuser</option>
                    <option value="self_excluded" className="bg-slate-900">Self Excluded</option>
                </select>
            </div>

            {/* Traffic Source Filter */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 focus-within:border-blue-500/50 transition-colors">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <select
                    value={filters.trafficSource}
                    onChange={(e) => onFilterChange('trafficSource', e.target.value)}
                    className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer pr-1 appearance-none hover:text-white"
                >
                    <option value="all" className="bg-slate-900">All Sources</option>
                    <option value="Direct" className="bg-slate-900">Direct</option>
                    <option value="Google" className="bg-slate-900">Google</option>
                    <option value="Affiliate" className="bg-slate-900">Affiliate</option>
                    <option value="Facebook" className="bg-slate-900">Facebook</option>
                </select>
            </div>

        </div>
    );
};

export default FiltersBar;
