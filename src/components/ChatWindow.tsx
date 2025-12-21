import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Minimize2,
    Maximize2,
    Send,
    RefreshCw,
    History,
    GripHorizontal,
    Trash2,
    Smile,
    MessageSquareQuote,
    UserPlus
} from 'lucide-react';
import { Ticket as TicketModel } from '../types';

interface ChatWindowProps {
    chat: TicketModel;
    isMinimized: boolean;
    isActive: boolean;
    zIndex: number;
    onMinimize: () => void;
    onClose: () => void;
    onEndSession?: () => void;
    onFocus: () => void;
    onConvertToTicket: () => void;
    onPositionChange: (x: number, y: number) => void;
    initialPosition: { x: number; y: number };
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    chat,
    isMinimized,
    isActive,
    zIndex,
    onMinimize,
    onClose,
    onEndSession,
    onFocus,
    onPositionChange,
    initialPosition
}) => {
    // Window Management State
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState({ width: 384, height: 500 });
    const [isMaximized, setIsMaximized] = useState(false);

    // Dragging
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });

    // Resizing
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });

    const windowRef = useRef<HTMLDivElement>(null);

    // Chat Logic State
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'me' | 'customer'; time: string }[]>([
        { id: '1', text: chat.description, sender: 'customer', time: chat.created.split('T')[1].substring(0, 5) }
    ]);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);

    const shortcuts = [
        "Hello! How can I help you today?",
        "I'm checking your account details now.",
        "Could you please provide the transaction ID?",
        "Your withdrawal is being processed.",
        "Is there anything else I can assist you with?"
    ];

    const emojis = ["😊", "👍", "👋", "💰", "🎰", "🎉", "🙏", "⏳"];
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Update position from props if not dragging
    useEffect(() => {
        if (!isDragging && !isMaximized) {
            setPosition(prev => {
                const buffer = 5;
                if (Math.abs(prev.x - initialPosition.x) > buffer || Math.abs(prev.y - initialPosition.y) > buffer) {
                    return initialPosition;
                }
                return prev;
            });
        }
    }, [initialPosition, isDragging, isMaximized]);

    // --- Drag Logic ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMinimized || isMaximized) return;
        e.preventDefault();
        onFocus();
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    // --- Resize Logic ---
    const handleResizeStart = (e: React.MouseEvent) => {
        if (isMinimized || isMaximized) return;
        e.preventDefault();
        e.stopPropagation();
        onFocus();
        setIsResizing(true);
        resizeStartPos.current = { x: e.clientX, y: e.clientY };
        resizeStartSize.current = { width: size.width, height: size.height };
    };

    // --- Global Mouse Move/Up ---
    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = e.clientX - dragStartPos.current.x;
                const newY = e.clientY - dragStartPos.current.y;
                const maxY = window.innerHeight - 50;
                setPosition({ x: newX, y: Math.max(0, Math.min(newY, maxY)) });
            }
            else if (isResizing) {
                const deltaX = e.clientX - resizeStartPos.current.x;
                const deltaY = e.clientY - resizeStartPos.current.y;
                setSize({
                    width: Math.max(300, resizeStartSize.current.width + deltaX),
                    height: Math.max(200, resizeStartSize.current.height + deltaY)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            if (isDragging) {
                onPositionChange(position.x, position.y);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, position, onPositionChange]);

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
        onFocus();
    };

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
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Thanks for checking! I'll wait.",
                sender: 'customer',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 3000);
    };

    // Minimized View
    if (isMinimized) {
        return (
            <div className="relative group animate-fade-in pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); onFocus(); /* Restore */ }}
                    className="h-9 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 text-xs font-medium transition-all shadow-lg"
                    style={{ width: '160px' }}
                >
                    {isResolved ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0"></div>
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse"></div>
                    )}
                    <span className="truncate text-gray-300 group-hover:text-white flex-1 text-left">{chat.customer.name}</span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span onClick={(e) => { e.stopPropagation(); onFocus(); }} className="p-0.5 hover:text-blue-400"><Maximize2 className="w-3 h-3" /></span>
                        <span onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-0.5 hover:text-red-400"><X className="w-3 h-3" /></span>
                    </div>
                </button>
            </div>
        );
    }

    // Styles for Maximize vs Windowed
    const activeStyle: React.CSSProperties = isMaximized
        ? {
            position: 'fixed',
            top: 0,
            left: 20,
            right: 0,
            bottom: 0,
            width: 'calc(100% - 40px)',
            height: 'auto',
            zIndex: zIndex + 100
        }
        : {
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
            zIndex: zIndex,
            opacity: isDragging ? 0.9 : 1
        };

    const shadowClass = isActive ? 'shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_20px_25px_-5px_rgba(0,0,0,0.5)]' : 'shadow-xl';

    return (
        <div
            ref={windowRef}
            className={`bg-slate-900 border border-slate-700 rounded-xl flex flex-col transition-all duration-200 ${shadowClass}`}
            style={activeStyle}
            onMouseDown={() => !isActive && onFocus()}
        >
            {/* Shortcuts Panel - Left Sidebar */}
            {showShortcuts && (
                <div className="absolute right-full mr-2 top-0 bottom-0 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 animate-slide-in-right z-50">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                        <MessageSquareQuote className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white">Shortcuts</span>
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-[calc(100%-40px)]">
                        {shortcuts.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => { setMessage(prev => prev + s); setShowShortcuts(false); }}
                                className="w-full text-left p-2 bg-slate-800/50 hover:bg-slate-700 rounded text-[11px] text-gray-300 transition-colors border border-transparent hover:border-blue-500/30"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Header */}
            <div
                className={`h-10 rounded-t-xl flex items-center justify-between px-3 border-b border-slate-700 flex-shrink-0 select-none ${isActive ? 'bg-slate-800' : 'bg-slate-800/50'
                    } ${!isMaximized ? 'cursor-move' : ''}`}
                onMouseDown={handleMouseDown}
                onDoubleClick={toggleMaximize}
            >
                <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
                    <GripHorizontal className="w-4 h-4 text-gray-600 mr-1" />
                    <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-gray-500' : 'bg-green-500'}`}></div>
                    <span className="font-semibold text-xs truncate text-white max-w-[150px]">{chat.title}</span>
                    <span className="text-xs text-gray-500 truncate">- {chat.customer.name}</span>
                </div>
                <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
                    {onEndSession && (
                        <button
                            onClick={onEndSession}
                            className="p-1 mx-1 hover:bg-slate-700 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="End Session"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <div className="w-px h-3 bg-gray-700 mx-1"></div>
                    <button
                        onClick={() => setShowShortcuts(!showShortcuts)}
                        className={`p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-blue-400 transition-colors ${showShortcuts ? 'text-blue-400' : ''}`}
                        title="Shortcuts"
                    >
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                    </button>
                    <button
                        className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-green-400 transition-colors"
                        title="Assign to Agent"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-gray-700 mx-1"></div>
                    <button onClick={onMinimize} className="p-1 hover:bg-slate-700 rounded text-gray-400 transition-colors">
                        <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={toggleMaximize} className={`p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-blue-400 transition-colors ${isMaximized ? 'text-blue-400' : ''}`}>
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-colors">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F172A] cursor-default relative"
            >
                <div className="flex justify-center my-2">
                    <span className="text-[10px] text-gray-500 bg-slate-800/80 px-2 py-1 rounded-full border border-slate-700 font-mono">
                        {chat.created.split('T')[1].substring(0, 5)}
                    </span>
                </div>

                {isResolved && (
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-gray-400">
                            <History className="w-3 h-3" /> Viewing past history
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs text-gray-300 font-bold border border-slate-600">
                            {msg.sender === 'me' ? 'Me' : chat.customer.avatar}
                        </div>
                        <div className={`max-w-[85%] ${msg.sender === 'me' ? 'items-end' : ''}`}>
                            <div className={`p-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.sender === 'me'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                            <div className={`text-[10px] text-gray-500 mt-1 px-1 ${msg.sender === 'me' ? 'text-right' : ''}`}>
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs text-gray-300 font-bold border border-slate-600">
                            {chat.customer.avatar}
                        </div>
                        <div className="bg-slate-800 p-2.5 rounded-2xl rounded-tl-none border border-slate-700">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 cursor-default rounded-b-xl relative">
                {isResolved ? (
                    <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 text-xs font-medium rounded-lg transition-all">
                        <RefreshCw className="w-3 h-3" /> Reopen Chat
                    </button>
                ) : (
                    <div className="relative">
                        {showEmojis && (
                            <div className="absolute bottom-full mb-2 left-0 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-2xl flex gap-1 z-50">
                                {emojis.map((e, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setMessage(prev => prev + e); setShowEmojis(false); }}
                                        className="p-1 hover:bg-slate-700 rounded text-lg"
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        )}
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type message..."
                            className="w-full bg-slate-800 text-white rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700 placeholder-gray-600"
                        />
                        <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <button
                                onClick={() => setShowEmojis(!showEmojis)}
                                className="p-1 text-gray-500 hover:text-yellow-400 transition-colors"
                            >
                                <Smile className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button
                                onClick={handleSendMessage}
                                className="p-1 text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Resize Handle */}
                {!isMaximized && (
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 opacity-0 hover:opacity-100 transition-opacity"
                        onMouseDown={handleResizeStart}
                    >
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-br-sm"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
