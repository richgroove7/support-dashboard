import { useState, useMemo, useRef } from 'react';
import {
  Search,
  Bell,
  LayoutGrid,
  X,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';
import TicketRow from './components/TicketRow';
import FiltersBar from './components/FiltersBar';
import ChatSystem, { ChatSystemRef } from './components/ChatSystem';
import { PlayerInfoPanel } from './components/PlayerInfoPanel';
import demoData from './data/demoTickets.json';
import ChatView from './components/ChatView';
import { Ticket } from './types';

// Cast demo data to Ticket[] because JSON sorted imports might infer narrower types
const initialTickets = demoData as unknown as Ticket[];

// Generate more mock data
const ticketsData: Ticket[] = [...initialTickets];
for (let i = 0; i < 30; i++) {
  // Pick a template cyclically
  const template = initialTickets[i % initialTickets.length];
  ticketsData.push({
    ...template,
    id: `gen-${i + 100}`,
    title: `${template.title} (Clone ${i})`,
    created: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  });
}

function App() {
  // const { isAuthenticated, isLoading } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);

  const [filterState, setFilterState] = useState({
    vipOnly: false,
    realtimeOnly: false,
    depositIssues: false,
    signupsOnly: false,
    trafficSource: 'all',
    playerStatus: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // State for features
  // Initialize with some "waiting" chats
  const [activeChats, setActiveChats] = useState<Ticket[]>(() => {
    return tickets.filter(t => t.type === 'chat' && t.status !== 'resolved').slice(0, 3);
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const chatSystemRef = useRef<ChatSystemRef>(null);

  // Derived state for panel open
  // const isPlayerPanelOpen = !!selectedTicket;

  // Calculate stats
  const stats = useMemo(() => {
    return {
      all: tickets.length,
      vip: tickets.filter(t => t.customer.vipLevel !== 'Bronze').length,
      issues: tickets.filter(t => t.customer.hasDepositIssue).length,
      online: tickets.filter(t => {
        const lastActive = new Date(t.customer.lastActivity).getTime();
        const now = new Date('2025-12-16T23:00:00Z').getTime(); // Simul mock time
        return (now - lastActive) < 15 * 60 * 1000; // Active in last 15m
      }).length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      signups: tickets.filter(t => {
        const created = new Date(t.created).getTime();
        const now = new Date('2025-12-16T23:00:00Z').getTime();
        return (now - created) < 24 * 60 * 60 * 1000; // Signed up in last 24h
      }).length
    };
  }, [tickets]);

  // Dock mode state
  const [isDockMode, setIsDockMode] = useState(false);

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // 1. Search
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Status
      if (filterState.status !== 'all' && ticket.status !== filterState.status) return false;

      // 3. VIP Filter
      if (filterState.vipOnly && ticket.customer.vipLevel === 'Bronze') return false;

      // 4. Deposit Issues
      if (filterState.depositIssues && !ticket.customer.hasDepositIssue) return false;

      // 5. Realtime/Online (Mock logic based on lastActivity)
      if (filterState.realtimeOnly) {
        const lastActive = new Date(ticket.customer.lastActivity).getTime();
        const now = new Date('2025-12-16T23:00:00Z').getTime();
        if ((now - lastActive) > 15 * 60 * 1000) return false;
      }

      // 6. Signups Only
      if (filterState.signupsOnly) {
        const created = new Date(ticket.created).getTime();
        const now = new Date('2025-12-16T23:00:00Z').getTime();
        if ((now - created) > 24 * 60 * 60 * 1000) return false;
      }

      // 7. Traffic Source
      if (filterState.trafficSource !== 'all' && ticket.customer.trafficSource !== filterState.trafficSource) {
        return false;
      }

      // 8. Player Status
      if (filterState.playerStatus !== 'all') {
        const level = ticket.customer.vipLevel;
        switch (filterState.playerStatus) {
          case 'vip': if (level === 'Bronze') return false; break;
          case 'blocked': if (ticket.customer.fraudRestrictions !== 'Blocked') return false; break;
          case 'bonus_abuser': if (!ticket.customer.bonusAbuse) return false; break;
          case 'self_excluded': if (ticket.customer.fraudRestrictions !== 'Self Excluded') return false; break;
          case 'active': if (ticket.status === 'resolved') return false; break;
        }
      }

      return true;
    }).sort((a, b) => {
      // 1. Prioritize Open tickets waiting >= 3 minutes
      const aWaitMins = parseInt(a.waitingTime.split(':')[0]) || 0;
      const bWaitMins = parseInt(b.waitingTime.split(':')[0]) || 0;
      const aIsOverdue = a.status === 'open' && aWaitMins >= 3;
      const bIsOverdue = b.status === 'open' && bWaitMins >= 3;

      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;

      // 2. Sort by priority first if critical
      if (a.priority === 'critical' && b.priority !== 'critical') return -1;
      if (b.priority === 'critical' && a.priority !== 'critical') return 1;
      // Then by updated time desc
      return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    });
  }, [tickets, filterState, searchQuery]);

  const handleTicketClick = (ticket: Ticket) => {
    // Only set selected ticket for info panel, don't open chat
    setSelectedTicket(ticket);
  };

  const handleChatIconClick = (e: React.MouseEvent, ticket: Ticket) => {
    e.stopPropagation(); // Prevent row click
    if (ticket.type === 'chat') {
      const isActive = activeChats.find(c => c.id === ticket.id);
      if (!isActive) {
        setActiveChats(prev => [...prev, ticket]);
      } else {
        // If already active, likely we want to restore its window
        chatSystemRef.current?.restoreWindow(ticket.id);
      }
      // Also show info
      setSelectedTicket(ticket);
    }
  };

  const handleAssignAgent = (ticketId: string, agentName: string | null) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignee: agentName ? { name: agentName, avatar: agentName.substring(0, 2).toUpperCase() } : null,
          assignedToAgentId: agentName ? `agent-${agentName.length}` : null // Mock agent ID
        };
      }
      return t;
    }));

    // Update active chat if it exists
    setActiveChats(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignee: agentName ? { name: agentName, avatar: agentName.substring(0, 2).toUpperCase() } : null,
          assignedToAgentId: agentName ? `agent-${agentName.length}` : null
        };
      }
      return t;
    }));

    // Update selected ticket if it matches
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? {
        ...prev,
        assignee: agentName ? { name: agentName, avatar: agentName.substring(0, 2).toUpperCase() } : null,
        assignedToAgentId: agentName ? `agent-${agentName.length}` : null
      } : null);
    }
  };

  const handleCloseAll = () => {
    // Only hide windows, do not remove from active session bar
    if (chatSystemRef.current && chatSystemRef.current.hideAllWindows) {
      chatSystemRef.current.hideAllWindows();
    } else if (chatSystemRef.current) {
      // Fallback if method missing for some reason (shouldn't happen)
      // console.warn("hideAllWindows not found");
    }
  };

  const handleOrganizeGrid = () => {
    if (chatSystemRef.current) {
      chatSystemRef.current.organizeWindows();
    }
  };

  // Handler for when the user clicks the CHIP or ROW -> We want to restore/open the window
  const handleRestoreChat = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // Only float if NOT in dock mode
    if (!isDockMode) {
      chatSystemRef.current?.restoreWindow(ticket.id);
    }
  };

  const handleWindowFocus = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleEndSession = (chatId: string) => {
    setActiveChats(prev => prev.filter(c => c.id !== chatId));
  };

  const handleConvertToTicket = (chatId: string) => {
    console.log("Converting chat to ticket:", chatId);
    // Logic to convert would go here
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Sound play failed:", e));
  };

  const handleNewMessage = (chatId: string) => {
    if (selectedTicket?.id === chatId) return; // Don't mark as unread if open

    setUnreadMessages(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1
    }));
    playNotificationSound();
  };

  const handleSimulateMessage = () => {
    if (activeChats.length === 0) return;
    const randomChat = activeChats[Math.floor(Math.random() * activeChats.length)];
    handleNewMessage(randomChat.id);
  };

  // Logic for List Column Width
  // Default: Full width (flex-1)
  // If Info Open (Standard): 75% -> w-3/4
  // If Dock Open (Docked): 50% -> w-1/2
  // We use explicit width classes to ensure the split is correct.
  const getListColumnClass = () => {
    if (selectedTicket) {
      if (isDockMode) return 'w-1/2'; // Dock mode = 50%
      return 'w-3/4'; // Standard mode with info = 75%
    }
    return 'w-full'; // No info selected
  };

  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden">
      {/* Header - Fixed Height, Flex None */}
      <header className="h-16 flex-none border-b border-gray-800 bg-slate-900/50 backdrop-blur-xl z-20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets, players, or issues..."
              className="w-full bg-slate-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all font-sans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Controls */}
          {activeChats.length > 0 && (
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4 ml-2">
              <button
                onClick={() => setIsDockMode(!isDockMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 ${isDockMode ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-slate-800 text-gray-400 border-slate-700'} hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors border`}
              >
                <span className="hidden sm:inline">Dock Chats</span>
              </button>
              <button
                onClick={handleOrganizeGrid}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg text-xs font-medium transition-colors border border-slate-700"
                title="Organize Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={handleSimulateMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 text-amber-400 border-amber-500/50 hover:bg-amber-600/30 rounded-lg text-xs font-medium transition-colors border"
                title="Simulate Event"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulate</span>
              </button>
              <button
                onClick={handleCloseAll}
                className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              >
                Close All
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${soundEnabled ? 'text-blue-400' : 'text-gray-500'}`}
            title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Alex Morgan</p>
              <p className="text-xs text-gray-400">Support Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm border-2 border-slate-800 shadow-lg">
              AM
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body - Flex 1, Overflow Hidden */}
      <main className="flex-1 flex overflow-hidden w-full relative">

        {/* Left Column (List) */}
        <div className={`${getListColumnClass()} flex flex-col border-r border-gray-800 transition-all duration-300 bg-[#0f172a]`}>
          {/* Header / Filters Area - Non-scrolling */}
          <div className="flex-none p-6 pb-2 space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <FiltersBar
                  filters={filterState}
                  onFilterChange={(key, value) => setFilterState(prev => ({ ...prev, [key]: value }))}
                  counts={stats}
                />
              </div>

              {/* Active Chats Bar */}
              {activeChats.length > 0 && (
                <div className="flex flex-col gap-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                  <span className="text-xs font-semibold text-gray-400 px-1 uppercase tracking-wider">
                    Active Sessions ({activeChats.length})
                  </span>

                  {/* Wrapper for chips */}
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    {activeChats.map(chat => (
                      <div
                        key={chat.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredChatId(chat.id)}
                        onMouseLeave={() => setHoveredChatId(null)}
                      >
                        {/* Chip */}
                        <button
                          onClick={() => {
                            handleRestoreChat(chat);
                            setUnreadMessages(prev => ({ ...prev, [chat.id]: 0 }));
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 border hover:border-blue-500 rounded text-xs transition-all group-hover:shadow-md relative overflow-hidden ${selectedTicket?.id === chat.id
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : unreadMessages[chat.id] > 0
                              ? 'bg-blue-900/40 border-blue-400 text-blue-100 animate-pulse'
                              : 'bg-slate-800 border-slate-600 text-gray-300 hover:text-white'
                            }`}
                        >
                          {unreadMessages[chat.id] > 0 && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 animate-ping"></div>
                          )}
                          <div className={`w-1.5 h-1.5 rounded-full ${chat.status === 'resolved' ? 'bg-gray-500' : unreadMessages[chat.id] > 0 ? 'bg-blue-400' : 'bg-green-500 animate-pulse'}`}></div>
                          <span className="max-w-[120px] truncate">{chat.customer.name}</span>
                          {unreadMessages[chat.id] > 0 && (
                            <span className="bg-blue-600 text-[10px] px-1 rounded-full">{unreadMessages[chat.id]}</span>
                          )}
                          <span
                            className="ml-1 p-0.5 rounded hover:bg-slate-700 text-gray-500 hover:text-red-400 opacity-60 hover:opacity-100 transition-opacity"
                            title="End Session"
                            onClick={(e) => { e.stopPropagation(); handleEndSession(chat.id); }}
                          >
                            <X className="w-3 h-3" />
                          </span>
                        </button>

                        {/* Hover Tooltip/Note - Positioned BELOW */}
                        <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          <h4 className="text-xs font-bold text-white mb-1">{chat.title}</h4>
                          <p className="text-[10px] text-gray-400 line-clamp-3">
                            {chat.description}
                          </p>
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-gray-500">
                            <span>{chat.customer.vipLevel}</span>
                            <span>{new Date(chat.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            {/* Tickets Table Header */}
            <div className="bg-slate-800/80 border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4 p-3 border-b border-gray-700 bg-slate-900/50 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                <div className="w-16 text-center">Priority</div>
                <div className="w-20">ID</div>
                <div className="w-48">Customer</div>
                <div className="w-32 hidden md:block">Balance</div>
                <div className="flex-1 min-w-[200px]">Subject</div>
                <div className="w-24">Status</div>
                <div className="w-24 hidden lg:block">Wait Time</div>
                <div className="w-32">Live</div>
                <div className="w-8"></div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-800">
                {filteredTickets.map((ticket) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    isActiveSession={activeChats.some(c => c.id === ticket.id)}
                    isHovered={hoveredChatId === ticket.id}
                    onClick={handleTicketClick}
                    onChatClick={(e) => handleChatIconClick(e, ticket)}
                    onAssignAgent={handleAssignAgent}
                  />
                ))}

                {filteredTickets.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-gray-400 font-medium">No results found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column (Docked Chat) - 25% */}
        {isDockMode && selectedTicket && selectedTicket.type === 'chat' && (
          <div className="w-1/4 flex flex-col border-r border-slate-800 bg-slate-900 z-10">
            <ChatView
              chat={selectedTicket}
              onCloseTab={() => handleEndSession(selectedTicket.id)}
              onConvertToTicket={() => handleConvertToTicket(selectedTicket.id)}
              docked={true}
            />
          </div>
        )}

        {/* Right Column (Info Panel) - 25% */}
        {selectedTicket && (
          <div className="w-1/4 flex flex-col border-l border-gray-800 bg-slate-900 z-20">
            <PlayerInfoPanel
              customer={selectedTicket.customer}
              onClose={() => setSelectedTicket(null)}
              onAssignAgent={(agentName) => handleAssignAgent(selectedTicket.id, agentName)}
              currentAssigneeName={selectedTicket.assignee?.name}
              isstatic={true}
            />
          </div>
        )}

      </main>

      {/* Floating System (Only for non-docked) */}
      <ChatSystem
        ref={chatSystemRef}
        activeChats={activeChats}
        dockedChatId={isDockMode && selectedTicket?.type === 'chat' ? selectedTicket.id : null}
        onCloseChat={handleEndSession}
        onChatFocus={handleWindowFocus}
        onConvertToTicket={handleConvertToTicket}
      />

    </div>
  );
}

export default App;
