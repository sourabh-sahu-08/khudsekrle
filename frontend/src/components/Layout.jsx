import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith('/auth');
    const isWorkspace = location.pathname === '/' || location.pathname.startsWith('/dashboard/analysis/');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-[#0B0F1A] flex flex-col overflow-hidden text-slate-200">
            {/* Navbar - Fixed Height 64px (h-16) */}
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 overflow-hidden relative pt-16">
                {/* Conditional Sidebar */}
                {!isAuthPage && (
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                )}

                {/* Main Content Area */}
                <main className={`flex-1 flex flex-col overflow-hidden relative ${isAuthPage ? 'overflow-y-auto' : ''}`}>
                    <div className={`flex-1 ${isWorkspace ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}>
                        {children}
                    </div>
                    
                    {/* Minimal Footer only on non-workspace pages or as a slim bar */}
                    {!isWorkspace && !isAuthPage && <Footer />}
                </main>
            </div>

            {/* Global Background Glow (Subtle & Animated) */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.08, 0.05],
                        x: [-20, 20, -20],
                        y: [-20, 20, -20]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.08, 0.05],
                        x: [20, -20, 20],
                        y: [20, -20, 20]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" 
                />
            </div>
        </div>
    );
}
