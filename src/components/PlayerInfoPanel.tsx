import React from 'react';
import {
    X,
    Gamepad2,
    Ticket
} from 'lucide-react';
import { Customer } from '../types';

interface PlayerInfoPanelProps {
    customer: Customer;
    onClose: () => void;
    isstatic?: boolean;
}

export const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({ customer, onClose, isstatic }) => {
    return (
        <div className={`border-gray-800 bg-slate-900 h-full flex flex-col animate-slide-in ${isstatic ? 'w-full text-sm' : 'w-80 border-l fixed right-0 top-16 bottom-0 z-20 shadow-2xl'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
                <h3 className="font-semibold text-white">Player Intelligence</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Profile */}
            <div className="p-6 text-center border-b border-gray-800">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-3 relative">
                    <span className="text-2xl font-bold text-gray-400">{customer.avatar}</span>
                    <img
                        src={`https://flagcdn.com/w40/${customer.country.toLowerCase()}.png`}
                        alt={customer.country}
                        className="absolute bottom-0 right-0 w-6 h-4 rounded-sm border border-slate-900 shadow-sm"
                    />
                </div>
                <h2 className="text-lg font-bold text-white">{customer.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">{customer.email}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Balance</div>
                        <div className="font-mono font-bold text-green-400">
                            ${customer.balance.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">VIP Level</div>
                        <div className={`font-bold ${customer.vipLevel === 'Diamond' ? 'text-cyan-400' : 'text-yellow-500'}`}>
                            {customer.vipLevel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 text-left tracking-wider">Last Activity</h4>
                    <div className="space-y-4">
                        <div className="flex gap-3 text-sm group">
                            <div className="p-2 rounded bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                <Gamepad2 className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-gray-300">Played <span className="text-white font-medium">{customer.lastGame}</span></div>
                                <div className="text-gray-500 text-xs mt-0.5">2 minutes ago</div>
                            </div>
                        </div>
                        {customer.hasDepositIssue && (
                            <div className="flex gap-3 text-sm group">
                                <div className="p-2 rounded bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                                    <Ticket className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-red-300 font-medium">Failed Deposit Attempt</div>
                                    <div className="text-gray-500 text-xs mt-0.5">10 minutes ago</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 text-left tracking-wider">Recent History</h4>
                    {/* Placeholder for ticket history */}
                    <div className="py-8 bg-slate-800/30 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Ticket className="w-8 h-8 opacity-20" />
                        <span className="text-xs">No recent tickets found</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
