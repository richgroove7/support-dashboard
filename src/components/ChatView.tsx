import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    RefreshCw,
    History,
    User,
    Calendar,
    Tag,
    Shield,
    Crown
} from 'lucide-react';
import { Ticket as TicketModel } from '../types';

interface ChatViewProps {
    chat: TicketModel;
    onCloseTab: () => void;
    onConvertToTicket: () => void;
    docked?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({
    chat,
    onCloseTab,
    onConvertToTicket,
    docked
}) => {
    // Chat Logic State
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'me' | 'customer'; time: string }[]>([
        { id: '1', text: chat.description, sender: 'customer', time: chat.created.split('T')[1].substring(0, 5) }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const isResolved = chat.status === 'resolved';

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: message,
            sender: 'me' as const,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simulate customer reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "That sounds great, thank you for the help!",
                sender: 'customer',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 2500);
    };

    return (
        <div className="flex h-full bg-[#0f172a] overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800">
                {/* ... existing Main Chat Area content ... */}
                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0f172a]"
                >
                    <div className="flex justify-center my-4">
                        <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-mono">
                            Session Started • {chat.created.replace('T', ' ').substring(0, 16)}
                        </span>
                    </div>

                    {isResolved && (
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300">
                                <History className="w-4 h-4" /> This session is from the archive
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border ${msg.sender === 'me'
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                                : 'bg-slate-700 border-slate-600 text-gray-300'
                                }`}>
                                {msg.sender === 'me' ? 'AM' : chat.customer.avatar}
                            </div>
                            <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end flex flex-col' : ''}`}>
                                <div className={`flex items-baseline gap-2 mb-1 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-sm font-medium text-slate-300">
                                        {msg.sender === 'me' ? 'Alex Morgan' : chat.customer.name}
                                    </span>
                                    <span className="text-xs text-slate-500">{msg.time}</span>
                                </div>
                                <div className={`p-4 rounded-2xl text-[15px] shadow-md leading-relaxed ${msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-sm font-bold text-gray-300">
                                {chat.customer.avatar}
                            </div>
                            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    {isResolved ? (
                        <button className="w-full max-w-md mx-auto flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 font-medium rounded-xl transition-all">
                            <RefreshCw className="w-4 h-4" /> Reopen This Ticket
                        </button>
                    ) : (
                        <div className="max-w-4xl mx-auto relative">
                            <input
                                type="text"
                                value={message}
                                autoFocus
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message to reply..."
                                className="w-full bg-slate-800 text-white rounded-xl pl-5 pr-12 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-slate-700 placeholder-slate-500 shadow-xl"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side Panel - Context */}
            {!docked && (
                <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto hidden xl:block">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl mx-auto mb-4 border-4 border-slate-800">
                            {chat.customer.avatar}
                        </div>
                        <h2 className="text-xl font-bold">{chat.customer.name}</h2>
                        <p className="text-sm text-slate-400 mt-1">{chat.customer.email}</p>
                        <div className="flex justify-center gap-2 mt-3">
                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded border border-yellow-500/20 font-medium flex items-center gap-1">
                                <Crown className="w-3 h-3" /> {chat.customer.vipLevel}
                            </span>
                            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700 font-medium">
                                {chat.customer.country}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Customer Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <User className="w-4 h-4 text-slate-500" /> ID
                                    </div>
                                    <span className="font-mono text-xs text-slate-400">{chat.customer.id}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Shield className="w-4 h-4 text-slate-500" /> Balance
                                    </div>
                                    <span className="font-mono text-sm text-green-400 font-bold">${chat.customer.balance.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Calendar className="w-4 h-4 text-slate-500" /> Joined
                                    </div>
                                    <span className="text-sm text-slate-400">Dec 2024</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ticket Info</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">Subject</div>
                                    <div className="text-sm font-medium">{chat.title}</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-3 bg-slate-800/50 rounded-lg text-center">
                                        <div className="text-xs text-slate-500 mb-1">Priority</div>
                                        <div className={`text-sm font-bold capitalize ${chat.priority === 'critical' ? 'text-red-400' : 'text-blue-400'
                                            }`}>{chat.priority}</div>
                                    </div>
                                    <div className="flex-1 p-3 bg-slate-800/50 rounded-lg text-center">
                                        <div className="text-xs text-slate-500 mb-1">Wait Time</div>
                                        <div className="text-sm font-mono text-slate-300">{chat.waitingTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onConvertToTicket}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Tag className="w-4 h-4" /> Convert to Ticket
                        </button>

                        <button
                            onClick={onCloseTab}
                            className="w-full py-2.5 bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-900/30 rounded-lg text-sm text-gray-400 hover:text-red-400 font-medium transition-colors"
                        >
                            Close Tab
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatView;
