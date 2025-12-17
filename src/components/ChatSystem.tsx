import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Ticket } from '../types';
import ChatWindow from './ChatWindow';

interface ChatSystemProps {
    activeChats: Ticket[];
    onCloseChat: (chatId: string) => void;
    onChatFocus: (chat: Ticket) => void;
    onConvertToTicket: (chatId: string) => void;
}

export interface ChatSystemRef {
    organizeWindows: () => void;
    restoreWindow: (id: string) => void;
    hideAllWindows: () => void;
}

interface WindowState {
    id: string;
    x: number;
    y: number;
    minimized: boolean;
    zIndex: number;
    visible: boolean;
}

const ChatSystem = forwardRef<ChatSystemRef, ChatSystemProps>(({
    activeChats,
    onCloseChat,
    onChatFocus,
    onConvertToTicket
}, ref) => {
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [topZIndex, setTopZIndex] = useState(100);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        organizeWindows: () => {
            const width = window.innerWidth - 64; // Subtract sidebar width (approx)
            const cardWidth = 384;
            const cardHeight = 500;
            const gap = 20;
            const startX = 20;
            const startY = 80;

            const cols = Math.floor((width - 40) / (cardWidth + gap));

            setWindows(prev => {
                const newWindows = { ...prev };
                let visibleIndex = 0;

                activeChats.forEach((chat) => {
                    // Only organize visible windows
                    // If a window is untracked (e.g. new), it will be added in useEffect
                    // But if it exists and is hidden, we skip organizing it
                    if (newWindows[chat.id] && !newWindows[chat.id].visible) return;

                    // If minimized, we generally don't move it in grid organize, 
                    // or maybe we do want to restore it? 
                    // Let's assume organize restores minimized windows too for cleaner grid

                    const row = Math.floor(visibleIndex / cols);
                    const col = visibleIndex % cols;

                    // Init if missing (though useEffect handles this, safety check)
                    const current = newWindows[chat.id] || {
                        id: chat.id,
                        x: 0,
                        y: 0,
                        minimized: false,
                        visible: true,
                        zIndex: topZIndex
                    };

                    newWindows[chat.id] = {
                        ...current,
                        x: startX + (col * (cardWidth + gap)),
                        y: startY + (row * (cardHeight + gap)),
                        minimized: false, // Restore if minimized
                        visible: true // Ensure visible
                    };
                    visibleIndex++;
                });
                return newWindows;
            });
        },
        restoreWindow: (id: string) => {
            handleFocus(id);
        },
        hideAllWindows: () => {
            setWindows(prev => {
                const newWindows = { ...prev };
                Object.keys(newWindows).forEach(key => {
                    newWindows[key] = { ...newWindows[key], visible: false };
                });
                return newWindows;
            });
        }
    }));

    // Initialize new chats
    useEffect(() => {
        activeChats.forEach((chat, index) => {
            setWindows(prev => {
                if (prev[chat.id]) return prev; // Already exists

                const maxX = window.innerWidth - 450;
                const maxY = window.innerHeight - 550;
                // Simple cascade
                const startX = Math.min(maxX, window.innerWidth / 2 - 200 + (index * 30));
                const startY = Math.min(maxY, window.innerHeight / 2 - 250 + (index * 30));

                return {
                    ...prev,
                    [chat.id]: {
                        id: chat.id,
                        x: startX > 0 ? startX : 50,
                        y: startY > 0 ? startY : 50,
                        minimized: false,
                        zIndex: topZIndex + 1,
                        visible: true
                    }
                };
            });
            if (!windows[chat.id]) {
                setTopZIndex(prev => prev + 1);
                setFocusedId(chat.id);
            }
        });
    }, [activeChats]);

    const handleFocus = (id: string) => {
        setFocusedId(id);
        const chat = activeChats.find(c => c.id === id);
        if (chat) onChatFocus(chat);

        setWindows(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                zIndex: topZIndex + 1,
                minimized: false,
                visible: true // Make visible on focus/restore
            }
        }));
        setTopZIndex(prev => prev + 1);
    };

    const handleMinimize = (id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], minimized: true }
        }));
    };

    const handleHideWindow = (id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], visible: false }
        }));
    };

    const handlePositionChange = (id: string, x: number, y: number) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], x, y }
        }));
    };

    // Filter to only render visible windows
    // We check `windows[c.id]` first to ensure init has happened
    const activeWindows = activeChats.filter(c => windows[c.id] && windows[c.id].visible && !windows[c.id].minimized);
    const minimizedWindows = activeChats.filter(c => windows[c.id] && windows[c.id].visible && windows[c.id].minimized);

    if (activeChats.length === 0) return null;

    return (
        <>
            {activeWindows.map(chat => (
                <ChatWindow
                    key={chat.id}
                    chat={chat}
                    isActive={focusedId === chat.id}
                    isMinimized={false}
                    zIndex={windows[chat.id].zIndex}
                    initialPosition={windows[chat.id] || { x: 0, y: 0 }}
                    onFocus={() => handleFocus(chat.id)}
                    onMinimize={() => handleMinimize(chat.id)}
                    onClose={() => handleHideWindow(chat.id)} // Specific "Hide" action
                    onEndSession={() => onCloseChat(chat.id)} // Specific "End" action
                    onConvertToTicket={() => onConvertToTicket(chat.id)}
                    onPositionChange={(x, y) => handlePositionChange(chat.id, x, y)}
                />
            ))}

            {/* Dock Area for Minimized Windows */}
            <div className="fixed bottom-3 right-4 z-[9999] flex flex-col-reverse items-end gap-2 pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto items-end">
                    {minimizedWindows.map(chat => (
                        <ChatWindow
                            key={chat.id}
                            chat={chat}
                            isActive={false}
                            isMinimized={true}
                            zIndex={9999}
                            initialPosition={{ x: 0, y: 0 }}
                            onFocus={() => handleFocus(chat.id)}
                            onMinimize={() => { }}
                            onClose={() => handleHideWindow(chat.id)} // Minimized X also hides
                            onEndSession={() => onCloseChat(chat.id)}
                            onConvertToTicket={() => { }}
                            onPositionChange={() => { }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
});

export default ChatSystem;
