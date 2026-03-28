import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#080c14] relative overflow-hidden">
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
