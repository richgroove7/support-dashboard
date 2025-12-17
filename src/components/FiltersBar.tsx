import React from 'react';
import {
    Users,
    Crown,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

interface FilterState {
    vipOnly: boolean;
    realtimeOnly: boolean;
    depositIssues: boolean;
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

        </div>
    );
};

export default FiltersBar;
