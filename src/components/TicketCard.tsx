import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved';
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    customer: {
        name: string;
        email: string;
        avatar: string;
    };
    assignee: {
        name: string;
        avatar: string;
    } | null;
    created: string;
    updated: string;
    messages: number;
}

interface TicketCardProps {
    ticket: Ticket;
    onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
    const getStatusBadge = (status: string) => {
        const badges = {
            open: 'badge-open',
            in_progress: 'badge-in-progress',
            resolved: 'badge-resolved',
        };
        return badges[status as keyof typeof badges] || 'badge-open';
    };

    const getPriorityBadge = (priority: string) => {
        const badges = {
            critical: 'priority-critical',
            high: 'priority-high',
            medium: 'priority-medium',
            low: 'priority-low',
        };
        return badges[priority as keyof typeof badges] || 'priority-low';
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className="glass rounded-xl p-5 card-hover cursor-pointer animate-slide-in"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                        <span className={`badge ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                        {ticket.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{ticket.description}</p>
                </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
                    {/* Customer Avatar */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold">
                            {ticket.customer.avatar}
                        </div>
                        <span className="text-sm text-gray-300">{ticket.customer.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Messages */}
                    <div className="flex items-center gap-1 text-gray-400">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">{ticket.messages}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{formatTime(ticket.updated)}</span>
                    </div>

                    {/* Status */}
                    <span className={`badge ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Assignee */}
            {ticket.assignee && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-xs font-semibold">
                        {ticket.assignee.avatar}
                    </div>
                    <span className="text-xs text-gray-400">Assigned to {ticket.assignee.name}</span>
                </div>
            )}
        </div>
    );
};

export default TicketCard;
