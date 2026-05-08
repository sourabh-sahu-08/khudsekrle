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
            <div className="min-h-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    <div className="bg-[#111827] p-6 pb-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 text-blue-500 border border-blue-500/20 shadow-inner">
                                <LogIn size={24} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
                                <p className="text-sm text-gray-400">Log in to your account to continue</p>
                            </div>
                        </div>

                        {/* Content Gap */}
                        <div className="mt-8 flex flex-col">
                            {/* Error Message */}
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden mb-5"
                                    >
                                        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2.5 text-red-400 text-sm">
                                            <XCircle size={14} className="shrink-0" />
                                            <span className="leading-tight">{error}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form Area */}
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="flex flex-col gap-4">
                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs tracking-wider text-gray-400 uppercase font-bold ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-white/[0.08] relative z-0"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-xs tracking-wider text-gray-400 uppercase font-bold">Password</label>
                                            <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors z-10" size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-white/[0.08] relative z-0"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors flex items-center justify-center z-10"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-blue-900/20 active:scale-95 hover:brightness-110 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider Line */}
                            <div className="flex items-center gap-4 mt-5">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">or continue with</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Social Auth */}
                            <button className="w-full h-12 mt-4 bg-white/5 hover:bg-white/[0.08] text-white rounded-xl flex items-center justify-center gap-3 transition-all duration-200 border border-white/10 active:scale-95 group shadow-sm">
                                <Github size={20} className="group-hover:text-blue-400 transition-colors" />
                                <span className="font-bold text-sm">Continue with GitHub</span>
                            </button>

                            {/* Footer Link */}
                            <p className="mt-8 text-center text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/auth/register" className="text-white hover:text-blue-400 transition-colors font-bold hover:underline underline-offset-4">
                                    Create one for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
