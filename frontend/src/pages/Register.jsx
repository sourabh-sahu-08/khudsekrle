import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, Github, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/utils/api';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await authService.register({ name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Welcome to khudsekrle, ${data.user.name}!`);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0B0F1A] to-black">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px]"
                >
                    <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-emerald-500/20">
                                <UserIcon size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Create Identity</h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">Initialize developer profile</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-[13px] font-medium"
                                    >
                                        <XCircle size={16} className="shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Name Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full h-12 bg-black/20 border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all hover:bg-black/30"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full h-12 bg-black/20 border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all hover:bg-black/30"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full h-12 bg-black/20 border border-white/5 rounded-lg pl-11 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all hover:bg-black/30"
                                        placeholder="Min 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mt-1 ml-1">
                                    {passValidation.length ? (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    ) : (
                                        <div className="w-3 h-3 rounded-full border border-slate-700" />
                                    )}
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${passValidation.length ? 'text-emerald-500' : 'text-slate-600'}`}>
                                        Minimum 6 characters
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create My Account</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">OR continue with</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        {/* GitHub Button */}
                        <button className="w-full h-12 bg-white/5 hover:bg-white/[0.08] text-white rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10 group active:scale-[0.98]">
                            <Github size={20} className="group-hover:text-emerald-400 transition-colors" />
                            <span className="font-bold text-sm">GitHub SSO</span>
                        </button>

                        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                            Already part of khudsekrle?{' '}
                            <Link to="/auth/login" className="text-white hover:text-emerald-400 transition-colors font-bold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
