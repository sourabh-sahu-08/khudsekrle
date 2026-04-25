import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    History, 
    User, 
    Settings, 
    PlusCircle, 
    Code, 
    ChevronRight, 
    Search,
    Command
} from 'lucide-react';
import { analysisService } from '@/utils/api';
import { motion } from 'framer-motion';

export default function Sidebar() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const response = await analysisService.getHistory();
                setHistory(response.data.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to fetch sidebar history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: History, label: 'Full History', path: '/dashboard' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="w-64 flex flex-col h-[calc(100vh-80px)] border-r border-white/5 bg-[#0B0F1A] overflow-hidden hidden lg:flex">
            {/* Search Bar */}
            <div className="p-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder="Quick search..." 
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Navigation</p>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                            location.pathname === item.path 
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                    >
                        <item.icon size={18} className={location.pathname === item.path ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Recent History */}
            <div className="flex-1 overflow-y-auto px-3 mt-8 custom-scrollbar">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-3 flex items-center justify-between">
                    Recent Analyses
                    <PlusCircle size={14} className="text-slate-700 hover:text-blue-500 cursor-pointer transition-colors" />
                </p>
                
                <div className="space-y-1">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-10 w-full rounded-xl bg-white/5 animate-pulse mb-1" />
                        ))
                    ) : history.length > 0 ? (
                        history.map((item) => (
                            <Link
                                key={item._id}
                                to={`/dashboard/analysis/${item._id}`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
                            >
                                <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                                    <Code size={12} />
                                </div>
                                <span className="truncate flex-1">{item.originalCode.substring(0, 30).trim()}...</span>
                                <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))
                    ) : (
                        <p className="px-3 text-[10px] text-slate-600 italic">No recent activity</p>
                    )}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="p-4 border-t border-white/5 mt-auto bg-slate-950/20">
                <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-4 rounded-2xl border border-blue-500/10">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Premium Access</p>
                    <p className="text-[11px] text-slate-400 leading-tight mb-3">Upgrade for unlimited AI code reviews.</p>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest">
                        Go Pro
                    </button>
                </div>
            </div>
        </aside>
    );
}
