import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, History, User, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
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
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="fixed top-0 w-full z-50 glass h-20 flex items-center px-8 justify-between border-b border-white/5 active:border-white/10 transition-colors"
        >
            <Link to="/" className="flex items-center gap-3 group min-w-fit">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/10">
                    <Terminal size={24} />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter hidden md:block">
                    khudsekrle
                </span>
            </Link>

            {isLoggedIn && (
                <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative group hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your code history..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600 hover:bg-white/[0.08]"
                    />
                </form>
            )}

            <div className="flex items-center gap-8">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 font-medium hover:translate-y-[-1px]">
                            <History size={18} />
                            <span>History</span>
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 font-medium hover:translate-y-[-1px]">
                            <User size={18} />
                            <span>Profile</span>
                        </Link>
                        <button 
                            onClick={handleSignOut} 
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border border-red-500/20"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth/login" className="text-slate-400 hover:text-white transition-colors font-semibold tracking-wide">
                            Sign In
                        </Link>
                        <Link 
                            to="/auth/register" 
                            className="relative group overflow-hidden bg-white text-black px-7 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-blue-600 hover:text-white"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </>
                )}
            </div>
        </motion.nav>
    );
}
