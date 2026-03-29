import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, Github, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '@/utils/api';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passValidation, setPassValidation] = useState({ length: false });
    const navigate = useNavigate();

    useEffect(() => {
        setPassValidation({
            length: password.length >= 6
        });
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passValidation.length) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await authService.register({ name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen py-24 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative"
                >
                    <div className="glass p-10 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full translate-x-20 -translate-y-20" />
                        
                        <div className="text-center mb-10">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                            >
                                <UserIcon size={32} />
                            </motion.div>
                            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Join DebugAI</h1>
                            <p className="text-slate-400 font-medium">Create your developer account today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-semibold"
                                    >
                                        <XCircle size={18} className="shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600 hover:bg-slate-800/40 text-sm"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600 hover:bg-slate-800/40 text-sm"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600 hover:bg-slate-800/40 text-sm"
                                        placeholder="Min 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2 ml-1 text-[11px]">
                                    {passValidation.length ? (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                                    )}
                                    <span className={passValidation.length ? 'text-emerald-500 font-bold' : 'text-slate-500 font-medium'}>
                                        At least 6 characters
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 h-14"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                                ) : (
                                    <>
                                        <span className="relative z-10 font-bold tracking-wide">Create My Account</span>
                                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800/50"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
                                <span className="bg-[#0f172a] px-4 text-slate-500">Fast Connect</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-slate-900/60 hover:bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-800/50 hover:border-emerald-500/30 group">
                            <Github size={20} className="group-hover:text-emerald-500 transition-colors" />
                            <span className="font-bold text-sm">GitHub SSO</span>
                        </button>

                        <p className="mt-10 text-center text-slate-500 font-medium text-xs">
                            Already part of DebugAI?{' '}
                            <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold underline underline-offset-4 decoration-emerald-500/20">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
