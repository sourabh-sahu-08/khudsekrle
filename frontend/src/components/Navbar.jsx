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
            className="fixed top-0 w-full z-[100] h-14 flex items-center px-10 justify-between border-b border-white/5 bg-[#060910]/60 backdrop-blur-xl"
        >
            <div className="flex items-center gap-12">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-all duration-300"
                    >
                        <Menu size={18} />
                    </button>
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                            <Terminal size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tighter hidden sm:block font-outfit">
                            khudsekrle<span className="text-blue-500">.</span>
                        </span>
                    </Link>
                </div>

                {isLoggedIn && (
                    <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                        <Search className="absolute left-4 text-slate-500/60 group-focus-within:text-blue-400 transition-colors" size={14} />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search analyses..."
                            className="bg-white/5 border border-white/5 rounded-2xl py-2 pl-11 pr-5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-slate-600 w-80 hover:bg-white/[0.08]"
                        />
                    </form>
                )}
            </div>

            <div className="flex items-center gap-8">
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-4 pr-8 border-r border-white/5">
                            <Link to="/dashboard" className="p-2 text-slate-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl" title="Analysis History">
                                <History size={18} />
                            </Link>
                            <button className="p-2 text-slate-400 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl relative" title="Notifications">
                                <Bell size={18} />
                                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-[#060910]" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-3.5 px-4.5 py-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                                <div className="w-6.5 h-6.5 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    <User size={14} />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Profile</span>
                            </Link>
                            <button 
                                onClick={handleSignOut} 
                                className="p-2 text-slate-500 hover:text-red-400 transition-all duration-300 hover:bg-red-500/10 rounded-xl"
                                title="Sign Out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-10">
                        <Link to="/auth/login" className="text-[13px] font-bold text-slate-400 hover:text-white transition-all duration-300 tracking-wide">
                            Sign In
                        </Link>
                        <Link 
                            to="/auth/register" 
                            className="bg-white text-black px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
