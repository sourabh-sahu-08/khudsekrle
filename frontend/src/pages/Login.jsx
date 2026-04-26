import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, XCircle, LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/utils/api';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.search.includes('expired=true')) {
            setError('Your session has expired. Please sign in again.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await authService.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success(`Welcome back, ${data.user.name}!`);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid email or password.';
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
                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500 border border-blue-500/20">
                                <LogIn size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Access Console</h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">Security clearance required</p>
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

                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full h-12 bg-black/20 border border-white/5 rounded-lg pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all hover:bg-black/30"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Password</label>
                                    <button type="button" className="text-[11px] text-blue-400 hover:text-blue-300 font-bold transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full h-12 bg-black/20 border border-white/5 rounded-lg pl-11 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all hover:bg-black/30"
                                        placeholder="••••••••"
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
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
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
                            <Github size={20} className="group-hover:text-blue-400 transition-colors" />
                            <span className="font-bold text-sm">GitHub SSO</span>
                        </button>

                        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/auth/register" className="text-white hover:text-blue-400 transition-colors font-bold">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
