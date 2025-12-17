export type TicketStatus = 'open' | 'in_progress' | 'resolved';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'ticket' | 'chat';
export type VipLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Customer {
    id: string;
    name: string;
    email: string;
    avatar: string;
    country: string;
    vipLevel: VipLevel;
    balance: number;
    lastGame: string;
    lastActivity: string; // ISO date
    hasDepositIssue: boolean;
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
    created: string;
    updated: string;
    waitingTime: string;
    messages: number;
    tags?: string[];
}
