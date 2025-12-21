export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'ticket' | 'chat';
export type VipLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Customer {
    id: string;
    playerId: string;
    username: string;
    name: string;
    email: string;
    avatar: string;
    country: string;
    vipLevel: VipLevel;
    segment: string;
    balance: number;
    pendingWithdrawals: number;
    bonusValue: number;
    lastGame: string;
    lastActivity: string; // ISO date
    hasDepositIssue: boolean;
    approvedDepositsCount: number;
    verified: boolean;
    fraudRestrictions: string;
    bonusAbuse: boolean;
    bonusToDepositPercentage: number;
    withdrawToDepositPercentage: number;
    trafficSource: string;
}

export interface Ticket {
    id: string;
    type: TicketType;
    title: string;
    description: string;
    status: TicketStatus;
    priority: Priority;
    category: string;
    customer: Customer;
    assignee: {
        name: string;
        avatar: string;
    } | null;
    assignedToAgentId: string | null;
    typingStatus?: 'user' | 'agent' | 'ai' | null;
    created: string;
    updated: string;
    waitingTime: string;
    messages: number;
    tags?: string[];
}
