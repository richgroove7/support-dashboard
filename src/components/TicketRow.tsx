import React from 'react';
import {
    MessageSquare,
    Ticket as TicketIcon,
    AlertCircle,
    Clock,
    MoreHorizontal,
    DollarSign
} from 'lucide-react';
import { Ticket } from '../types';

interface TicketRowProps {
    ticket: Ticket;
    isActiveSession?: boolean;
    isHovered?: boolean;
    onClick: (ticket: Ticket) => void;
    onChatClick: (e: React.MouseEvent) => void;
}

const TicketRow: React.FC<TicketRowProps> = ({ ticket, isActiveSession, isHovered, onClick, onChatClick }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400';
            case 'high': return 'text-orange-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    const getVipBadgeColor = (level: string) => {
        switch (level) {
            case 'Diamond': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
            case 'Platinum': return 'bg-slate-300/20 text-slate-200 border-slate-400/30';
            case 'Gold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'Silver': return 'bg-slate-400/20 text-slate-300 border-slate-400/30';
            default: return 'bg-orange-700/20 text-orange-300 border-orange-700/30'; // Bronze
        }
    };

    const getTypeIcon = (type: string) => {
        return type === 'chat' ? (
            <div
                onClick={onChatClick}
                className="cursor-pointer p-1.5 rounded hover:bg-white/10 relative transition-colors"
            >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                {isActiveSession && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-900 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                )}
            </div>
        ) : (
            <TicketIcon className="w-4 h-4 text-purple-400" />
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-500/20 text-blue-400';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-400';
            case 'resolved': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div
            onClick={() => onClick(ticket)}
            className={`group flex items-center gap-4 p-3 border-b border-gray-800 cursor-pointer transition-all text-sm relative ${isActiveSession ? 'bg-blue-900/5' : 'hover:bg-slate-800/50'
                } ${isHovered ? 'bg-slate-800/80 ring-1 ring-inset ring-blue-500/30' : ''}`}
        >
            {/* Active Indicator Bar (Removed per new request, replaced by LED) */}
            {/* Priority & Type */}
            <div className="w-16 flex items-center justify-center gap-2">
                <AlertCircle className={`w-4 h-4 ${getPriorityColor(ticket.priority)}`} />
                {getTypeIcon(ticket.type)}
            </div>

            {/* ID */}
            <div className="w-20 font-mono text-gray-500 text-xs">{ticket.id}</div>

            {/* Customer Info */}
            <div className="w-48 flex items-center gap-3">
                <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                        {ticket.customer.avatar}
                    </div>
                    <img
                        src={`https://flagcdn.com/w20/${ticket.customer.country.toLowerCase()}.png`}
                        alt={ticket.customer.country}
                        className="absolute -bottom-1 -right-1 w-4 h-[10px] rounded-sm border border-slate-900"
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{ticket.customer.name}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded ${getVipBadgeColor(ticket.customer.vipLevel)}`}>
                            {ticket.customer.vipLevel.substring(0, 1)}
                        </span>
                    </div>
                    <div className="text-gray-500 text-xs truncate">{ticket.customer.email}</div>
                </div>
            </div>

            {/* Balance & Issues */}
            <div className="w-32 hidden md:block">
                <div className="flex items-center gap-1 font-mono text-gray-300">
                    <DollarSign className="w-3 h-3 text-gray-500" />
                    {ticket.customer.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                {ticket.customer.hasDepositIssue && (
                    <div className="flex items-center gap-1 text-[10px] text-red-400 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Deposit Issue
                    </div>
                )}
            </div>

            {/* Subject/Title */}
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                    {ticket.title}
                </div>
                <div className="text-gray-500 text-xs truncate pr-4">
                    {ticket.description}
                </div>
            </div>

            {/* Status */}
            <div className="w-24">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                </span>
            </div>

            {/* Waiting Time */}
            <div className="w-24 hidden lg:block flex items-center gap-1.5 text-gray-400 font-mono text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span className={ticket.status === 'open' ? 'text-red-400 font-bold' : ''}>
                    {ticket.waitingTime}
                </span>
            </div>

            {/* Actions */}
            <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TicketRow;
