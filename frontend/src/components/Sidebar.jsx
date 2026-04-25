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
    Command,
    X,
    Zap
} from 'lucide-react';
import { analysisService } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchRecent = async () => {
            try {
                const response = await analysisService.getHistory();
                setHistory(response.data.data.slice(0, 8));
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
        { icon: User, label: 'Profile Settings', path: '/profile' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 w-[260px] bg-[#0B0F1A] border-r border-white/10 z-[70] transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:z-auto lg:h-[calc(100vh-80px)]
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col overflow-hidden
            `}>
                
                {/* Profile Section */}
                <div className="p-6 border-b border-white/10 bg-[#111827]/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <User size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Developer'}</p>
                            <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email || 'standard-tier'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group ${
                                location.pathname === item.path 
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                            <item.icon size={18} className={location.pathname === item.path ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Recent Analyses (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar">
                    <div className="flex items-center justify-between px-3 mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Recent Audits</p>
                        <PlusCircle size={14} className="text-slate-700 hover:text-blue-500 cursor-pointer transition-colors" />
                    </div>
                    
                    <div className="space-y-1">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-full rounded-xl bg-white/5 animate-pulse mb-1" />
                            ))
                        ) : history.length > 0 ? (
                            history.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/dashboard/analysis/${item._id}`}
                                    onClick={() => onClose()}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-blue-400 transition-colors border border-white/5">
                                        <Code size={12} />
                                    </div>
                                    <span className="truncate flex-1 font-mono">{item.originalCode.substring(0, 20).trim()}...</span>
                                    <ChevronRight size={12} className="text-slate-800 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-[10px] text-slate-600 font-bold uppercase">No Audits Found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Premium Card (Sticky Bottom) */}
                <div className="p-4 border-t border-white/10 bg-[#0B0F1A]">
                    <div className="bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 p-5 rounded-2xl border border-blue-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-blue-400 fill-blue-400/20" />
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Enterprise</p>
                            </div>
                            <p className="text-[11px] text-slate-300 font-bold leading-tight mb-3">Get advanced security audits & unlimited history.</p>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-[0.1em] active:scale-95">
                                Upgrade Workspace
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
