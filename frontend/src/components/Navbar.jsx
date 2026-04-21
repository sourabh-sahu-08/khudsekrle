import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, History, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

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
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/10">
                    <Terminal size={24} />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
                    khudsekrle
                </span>
            </Link>

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
