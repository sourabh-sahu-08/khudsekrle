import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, History, User, LogOut, Search, Menu, X, Bell, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ onMenuClick }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 w-full z-[100] h-14 flex items-center px-6 justify-between border-b border-white/5 bg-[#060910]/80 backdrop-blur-xl"
        >
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-all"
                    >
                        <Menu size={18} />
                    </button>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white border border-white/10 shadow-lg group-hover:scale-105 transition-all duration-500 group-hover:border-blue-500/50">
                            <Terminal size={18} strokeWidth={2.5} className="text-blue-500" />
                        </div>
                        <span className="text-xl font-black text-white tracking-tightest-extreme hidden sm:block">
                            khudsekrle<span className="text-blue-500">.</span>
                        </span>
                    </Link>
                </div>

                {isLoggedIn && (
                    <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                        <Search className="absolute left-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={14} />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your audits..."
                            className="bg-white/5 border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-[12px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600 w-72 hover:bg-white/[0.08]"
                        />
                    </form>
                )}
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-2 pr-4 border-r border-white/5">
                            <Link to="/dashboard" className="p-2.5 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl" title="Audit History">
                                <History size={18} />
                            </Link>
                            <button className="p-2.5 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-xl relative" title="Notifications">
                                <Bell size={18} />
                                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-[#060910]" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                    <User size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white transition-colors">Profile</span>
                            </Link>
                            <button 
                                onClick={handleSignOut} 
                                className="p-2.5 text-slate-600 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-xl"
                                title="Sign Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link to="/auth/login" className="text-[12px] font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link 
                            to="/auth/register" 
                            className="bg-white text-black px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white shadow-2xl active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
