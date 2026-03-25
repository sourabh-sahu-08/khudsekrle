"use client";

import Link from 'next/link';
import { Terminal, History, User, LogOut } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 glass h-16 flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
                <Terminal className="text-blue-500 w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    DebugAI
                </span>
            </div>

            <div className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    <History size={18} />
                    <span>History</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                    <User size={18} />
                    <span>Profile</span>
                </Link>
                <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </nav>
    );
}
