import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0B0F1A] py-6 px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-600/10 flex items-center justify-center text-blue-500">
                        <Terminal size={12} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                        khudsekrle © 2026
                    </span>
                </div>
                
                <div className="flex items-center gap-6">
                    <Link to="#" className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Privacy</Link>
                    <Link to="#" className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
                    <Link to="#" className="text-[10px] font-bold text-slate-600 hover:text-white transition-colors uppercase tracking-widest">Support</Link>
                    <div className="h-3 w-[1px] bg-white/5" />
                    <div className="flex items-center gap-3">
                        <Github size={14} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
                        <Twitter size={14} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
