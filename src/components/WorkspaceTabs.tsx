import React from 'react';
import { X, LayoutDashboard, MessageSquare } from 'lucide-react';
import { Ticket } from '../types';

interface WorkspaceTabsProps {
    activeTabId: string;
    openChats: Ticket[];
    onTabChange: (tabId: string) => void;
    onCloseTab: (chatId: string) => void;
}

const WorkspaceTabs: React.FC<WorkspaceTabsProps> = ({
    activeTabId,
    openChats,
    onTabChange,
    onCloseTab
}) => {
    return (
        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-800 bg-slate-900 overflow-x-auto no-scrollbar">
            {/* Dashboard Tab */}
            <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg text-sm font-medium transition-colors border-t border-x border-transparent relative top-[1px] ${activeTabId === 'dashboard'
                        ? 'bg-[#0f172a] text-blue-400 border-slate-800 border-b-[#0f172a]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                    }`}
            >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </button>

            <div className="w-px h-6 bg-slate-800 mx-2 self-center"></div>

            {/* Chat Tabs */}
            {openChats.map((chat) => (
                <div
                    key={chat.id}
                    className={`group flex items-center gap-2 pl-3 pr-2 py-3 rounded-t-lg text-sm font-medium transition-colors border-t border-x border-transparent relative top-[1px] min-w-[150px] max-w-[200px] cursor-pointer ${activeTabId === chat.id
                            ? 'bg-[#0f172a] text-white border-slate-800 border-b-[#0f172a]'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                        }`}
                    onClick={() => onTabChange(chat.id)}
                >
                    <MessageSquare className={`w-4 h-4 ${activeTabId === chat.id ? 'text-green-400' : 'text-gray-500'}`} />
                    <span className="truncate flex-1">{chat.customer.name}</span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCloseTab(chat.id);
                        }}
                        className={`p-0.5 rounded-full hover:bg-slate-700 hover:text-red-400 transition-colors ${activeTabId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default WorkspaceTabs;
