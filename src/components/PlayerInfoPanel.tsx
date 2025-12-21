import React from 'react';
import {
    X,
    Gamepad2,
    Ticket,
    Wallet,
    Gift,
    ChevronDown,
    ShieldCheck,
    FileText,
    MessageCircle,
    Save,
    User
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
    onAssignAgent?: (agentName: string | null) => void;
    currentAssigneeName?: string | null;
}

export const PlayerInfoPanel: React.FC<PlayerInfoPanelProps> = ({ customer, onClose, isstatic, onAssignAgent, currentAssigneeName }) => {
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
                <div className="flex flex-col items-center gap-1 mt-1 font-mono text-xs">
                    <span className="text-blue-400">{customer.username}</span>
                    <span className="text-gray-500">ID: {customer.playerId}</span>
                    <span className="text-gray-400">{customer.email}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Balance</div>
                        <div className="flex flex-col">
                            <div className="font-mono font-bold text-green-400">
                                ${customer.balance.toLocaleString()}
                            </div>
                            {customer.pendingWithdrawals > 0 && (
                                <div className="text-[10px] text-orange-400 font-mono">
                                    ${customer.pendingWithdrawals.toLocaleString()} Pend.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-gray-700/50">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Segment</div>
                        <div className={`font-bold ${customer.segment === 'VIP' ? 'text-cyan-400' : 'text-slate-400'}`}>
                            {customer.segment || 'Regular'}
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
                <div className="space-y-2 pb-6">
                    <AccordionItem title="Account Status" icon={<ShieldCheck className="w-4 h-4 text-green-400" />}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Verified</span>
                                <span className={customer.verified ? 'text-green-400' : 'text-red-400'}>{customer.verified ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Fraud Restrictions</span>
                                <span className="text-orange-400">{customer.fraudRestrictions || 'None'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400">Bonus Abuse</span>
                                <span className={customer.bonusAbuse ? 'text-red-400' : 'text-green-400'}>{customer.bonusAbuse ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                                <div className="bg-slate-900/50 p-2 rounded">
                                    <div className="text-[9px] text-gray-500 uppercase">Bonus/Dep %</div>
                                    <div className="text-xs font-mono">{customer.bonusToDepositPercentage}%</div>
                                </div>
                                <div className="bg-slate-900/50 p-2 rounded">
                                    <div className="text-[9px] text-gray-500 uppercase">WD/Dep %</div>
                                    <div className="text-xs font-mono">{customer.withdrawToDepositPercentage}%</div>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

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
                                <div>
                                    <div className="text-gray-300 font-medium">Welcome Bonus</div>
                                    <div className="text-[10px] text-gray-500 font-mono">Value: ${customer.bonusValue || 100}</div>
                                </div>
                                <span className="text-green-400">Active</span>
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

                    <AccordionItem title="Recent Notes" icon={<FileText className="w-4 h-4" />}>
                        <div className="space-y-2">
                            <div className="p-2 bg-slate-800/50 rounded text-xs text-slate-300">
                                <div className="text-gray-500 text-[10px] mb-1">Dec 15, 2024 - Mike C.</div>
                                Player asked for bonus clarification.
                            </div>
                            <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 border border-slate-700 rounded">+ Add Note</button>
                        </div>
                    </AccordionItem>

                    <AccordionItem title="Correspondences" icon={<MessageCircle className="w-4 h-4" />}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="p-2 bg-slate-800/50 rounded text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-blue-400 font-medium">Billing / Refund</span>
                                        <span className="text-gray-500">2 days ago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 border border-slate-700 rounded-lg space-y-3 bg-slate-900/40">
                                <h5 className="text-[10px] font-bold text-gray-500 uppercase">Assignment</h5>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <select
                                            value={currentAssigneeName || 'Unassigned'}
                                            onChange={(e) => onAssignAgent?.(e.target.value === 'Unassigned' ? null : e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white appearance-none pr-8"
                                        >
                                            <option value="Unassigned">Unassigned</option>
                                            <option value="AI Agent">AI Agent</option>
                                            <option value="Mike Chen">Mike Chen</option>
                                            <option value="Emily Watson">Emily Watson</option>
                                            <option value="Alex Morgan">Alex Morgan</option>
                                        </select>
                                        <User className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 border border-slate-700 rounded-lg space-y-3 bg-slate-900/40">
                                <h5 className="text-[10px] font-bold text-gray-500 uppercase">Save New Correspondence</h5>
                                <div className="space-y-2">
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white">
                                        <option>Select Subject...</option>
                                        <option>Billing</option>
                                        <option>Game Issue</option>
                                        <option>Verification</option>
                                        <option>Bonus</option>
                                    </select>
                                    <select className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white">
                                        <option>Select Subtopic...</option>
                                        <option>Deposit Pending</option>
                                        <option>Withdrawal Delayed</option>
                                        <option>Bonus Not Credited</option>
                                    </select>
                                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2">
                                        <Save className="w-3 h-3" /> Save Correspondence
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </div>
            </div>
        </div>
    );
};
