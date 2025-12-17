import React from 'react';
import {
    X,
    Gamepad2,
    Ticket,
    Wallet,
    Gift,
    Trophy,
    ChevronDown
} from 'lucide-react';
import { Customer } from '../types';

interface AccordionItemProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border border-slate-800 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors text-left"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <span className="text-slate-500">{icon}</span>
                    {title}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-3 bg-slate-900/50 border-t border-slate-800 animate-slide-in-top">
                    {children}
                </div>
            )}
        </div>
    );
};

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

                {/* Accordion Sections */}
                <div className="space-y-2">
                    <AccordionItem title="Transactions" icon={<Wallet className="w-4 h-4" />}>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded">
                                    <span className="text-gray-300">Deposit (BTC)</span>
                                    <span className="text-green-400 font-mono">+$500.00</span>
                                </div>
                            ))}
                            <a href="#" target="_blank" className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-2">View All &gt;</a>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Bonuses" icon={<Gift className="w-4 h-4" />}>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded border-l-2 border-green-500">
                                <span className="text-gray-300">Welcome Bonus</span>
                                <span className="text-green-400">Active</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded border-l-2 border-gray-600">
                                <span className="text-gray-500">Reload Bonus</span>
                                <span className="text-gray-500">Expired</span>
                            </div>
                            <a href="#" target="_blank" className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-2">View All &gt;</a>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Casino Games" icon={<Gamepad2 className="w-4 h-4" />}>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded">
                                    <span className="text-gray-300">Sweet Bonanza</span>
                                    <span className="text-gray-500">x45 spins</span>
                                </div>
                            ))}
                            <a href="#" target="_blank" className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-2">View All &gt;</a>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Sports Bets" icon={<Trophy className="w-4 h-4" />}>
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-800/50 rounded">
                                    <span className="text-gray-300">Man City vs Arsenal</span>
                                    <span className="text-gray-500">Pending</span>
                                </div>
                            ))}
                            <a href="#" target="_blank" className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-2">View All &gt;</a>
                        </div>
                    </AccordionItem>
                </div>
            </div>
        </div>
    );
};
