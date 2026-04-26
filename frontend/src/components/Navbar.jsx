import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, History, User, LogOut, Search, Menu, X, Bell } from 'lucide-react';
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
            className="fixed top-0 w-full z-[100] h-16 flex items-center px-6 justify-between border-b border-white/10 bg-[#0B0F1A]/80 backdrop-blur-md"
        >
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-all"
                    >
                        <Menu size={18} />
                    </button>
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                            <Terminal size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tighter hidden sm:block">
                            khudsekrle<span className="text-blue-500">.</span>
                        </span>
                    </Link>
                </div>

                {isLoggedIn && (
                    <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                        <Search className="absolute left-3 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={14} />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Quick search..."
                            className="bg-white/5 border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 w-64 hover:bg-white/[0.08]"
                        />
                    </form>
                )}
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                            <Link to="/dashboard" className="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-lg" title="History">
                                <History size={18} />
                            </Link>
                            <button className="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/5 rounded-lg relative" title="Notifications">
                                <Bell size={18} />
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#0B0F1A]" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <User size={14} />
                                </div>
                                <span className="text-[12px] font-bold text-slate-300 group-hover:text-white">Account</span>
                            </Link>
                            <button 
                                onClick={handleSignOut} 
                                className="p-2 text-slate-500 hover:text-red-400 transition-all hover:bg-red-500/10 rounded-lg"
                                title="Sign Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/auth/login" className="text-[13px] font-semibold text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link 
                            to="/auth/register" 
                            className="bg-white text-black px-5 py-2 rounded-xl text-[13px] font-bold transition-all hover:bg-blue-600 hover:text-white shadow-lg shadow-white/5"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
