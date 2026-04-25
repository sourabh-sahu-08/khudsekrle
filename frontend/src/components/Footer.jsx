import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/5 bg-[#030712]/80 backdrop-blur-xl mt-20">
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                <Terminal size={24} />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
                                khudsekrle
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            Empowering developers with AI-driven insights to write safer, faster, and more efficient code. Join the future of software development today.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink icon={<Github size={20} />} href="#" />
                            <SocialLink icon={<Twitter size={20} />} href="#" />
                            <SocialLink icon={<Linkedin size={20} />} href="#" />
                            <SocialLink icon={<Mail size={20} />} href="#" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/">Home</FooterLink>
                            <FooterLink to="/dashboard">Dashboard</FooterLink>
                            <FooterLink to="/profile">Profile</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <FooterLink to="#">About Us</FooterLink>
                            <FooterLink to="#">Privacy Policy</FooterLink>
                            <FooterLink to="#">Terms of Service</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} khudsekrle AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            Built with <span className="text-red-500">❤️</span> by developers for developers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ to, children }) {
    return (
        <li>
            <Link to={to} className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ icon, href }) {
    return (
        <a 
            href={href} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all duration-300 border border-white/5"
        >
            {icon}
        </a>
    );
}
