import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function Layout({ children }) {
    const cursorRef = useRef(null);
    const location = useLocation();
    const isAuthPage = location.pathname.startsWith('/auth');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    const particles = Array.from({ length: 15 });

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col">
            <div id="cursor-glow" ref={cursorRef} />
            
            {/* Background Decorations */}
            <div className="bg-glow blob-1" />
            <div className="bg-glow blob-2" />

            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {particles.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: Math.random() * window.innerWidth, 
                            y: Math.random() * window.innerHeight,
                            opacity: Math.random() * 0.3
                        }}
                        animate={{ 
                            x: Math.random() * window.innerWidth, 
                            y: Math.random() * window.innerHeight,
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{ 
                            duration: Math.random() * 20 + 20, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute text-blue-500/20 font-mono text-xs"
                    >
                        {['{ }', '< >', '( )', '[ ]', '=>', ';;', '!!'][Math.floor(Math.random() * 7)]}
                    </motion.div>
                ))}
            </div>
            
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="relative z-10 flex flex-1 overflow-hidden">
                {!isAuthPage && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
                <main className={`flex-1 overflow-y-auto custom-scrollbar relative ${isAuthPage ? '' : ''}`}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
