import {
    LayoutDashboard,
    Ticket,
    Users,
    Settings,
    HelpCircle,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
        { icon: <Ticket size={20} />, label: 'Tickets', active: false },
        { icon: <Users size={20} />, label: 'Customers', active: false },
        { icon: <Settings size={20} />, label: 'Settings', active: false },
    ];

    return (
        <div className="w-64 border-r border-gray-800 bg-slate-900/50 flex flex-col h-screen fixed left-0 top-0 backdrop-blur-xl">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Ticket className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SupportHub
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.active
                            ? 'bg-blue-600/10 text-blue-400'
                            : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {item.label === 'Tickets' && (
                            <span className="ml-auto bg-blue-600 text-white text-xs py-0.5 px-2 rounded-full">
                                12
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-slate-800 hover:text-white transition-all">
                    <HelpCircle size={20} />
                    <span className="font-medium">Help center</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-slate-800 hover:text-white transition-all">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
