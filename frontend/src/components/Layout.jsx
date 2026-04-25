import { useEffect, useRef } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    const cursorRef = useRef(null);

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

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden">
            <div id="cursor-glow" ref={cursorRef} />
            
            {/* Background Decorations */}
            <div className="bg-glow blob-1" />
            <div className="bg-glow blob-2" />
            
            <Navbar />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
