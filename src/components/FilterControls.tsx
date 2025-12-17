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

interface FilterControlsProps {
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

const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFilterChange, counts }) => {

    // Helper to check 'resolved' since it's a string value in state, not just boolean
    const isResolvedActive = filters.status === 'resolved';

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-800/40 border border-gray-700/50 rounded-xl mb-4">

            {/* Realtime Players */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.realtimeOnly
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                    }`}>
                    {filters.realtimeOnly && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.realtimeOnly}
                    onChange={() => onFilterChange('realtimeOnly', !filters.realtimeOnly)}
                />
                <div className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white">
                    <Users className="w-4 h-4 text-green-400" />
                    Realtime
                    <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded textxs text-gray-400 font-mono">
                        {counts.online}
                    </span>
                </div>
            </label>

            <div className="w-px h-6 bg-gray-700/50"></div>

            {/* VIP Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.vipOnly
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                    }`}>
                    {filters.vipOnly && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.vipOnly}
                    onChange={() => onFilterChange('vipOnly', !filters.vipOnly)}
                />
                <div className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white">
                    <Crown className="w-4 h-4 text-yellow-400" />
                    VIP
                    <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded textxs text-gray-400 font-mono">
                        {counts.vip}
                    </span>
                </div>
            </label>

            <div className="w-px h-6 bg-gray-700/50"></div>

            {/* Deposit Issues */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.depositIssues
                        ? 'bg-red-500 border-red-500'
                        : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                    }`}>
                    {filters.depositIssues && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.depositIssues}
                    onChange={() => onFilterChange('depositIssues', !filters.depositIssues)}
                />
                <div className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    Issues
                    <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded textxs text-gray-400 font-mono">
                        {counts.issues}
                    </span>
                </div>
            </label>

            <div className="w-px h-6 bg-gray-700/50"></div>

            {/* Resolved - Treating as a toggle for "Show Resolved" instead of changing 'status' to 'resolved' exclusively? 
               User asked for Checkboxes. Previously it was a status filter. 
               Let's keep the logic: If checked, it filters to status='resolved'. If unchecked, it's 'all' (excluding resolved effectively unless status is handled elsewhere).
               For now, mimicking previous toggle behavior but with checkbox UI.
            */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isResolvedActive
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                    }`}>
                    {isResolvedActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                    type="checkbox"
                    className="hidden"
                    checked={isResolvedActive}
                    onChange={() => onFilterChange('status', isResolvedActive ? 'all' : 'resolved')}
                />
                <div className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    Resolved
                    <span className="bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded textxs text-gray-400 font-mono">
                        {counts.resolved}
                    </span>
                </div>
            </label>

        </div>
    );
};

export default FilterControls;
