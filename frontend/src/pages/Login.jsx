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
            <div className="min-h-full w-full flex items-center justify-center bg-[#060910] relative overflow-hidden px-6 py-16">
                {/* Background effects */}
                <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-blue-600/[0.03] blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="w-full max-w-[440px] relative z-10"
                >
                    <div className="bg-[#0B1120]/75 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.4),0_0_40px_rgba(59,130,246,0.06)] overflow-hidden">
                        <div className="p-8 sm:p-10 flex flex-col w-full">
                            {/* Heading Section */}
                            <div className="flex flex-col items-center text-center mb-10 w-full">
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    className="w-14 h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center text-blue-500 border border-white/10 shadow-xl mb-6"
                                >
                                    <LogIn size={28} strokeWidth={1.5} />
                                </motion.div>
                                <div className="space-y-2.5 w-full">
                                    <h1 className="text-4xl font-bold text-white tracking-tight font-outfit leading-none">
                                        Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">In</span>
                                    </h1>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed opacity-80">Log in to your account to continue</p>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col w-full">
                                {/* Error Alert */}
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4 text-red-300 text-sm backdrop-blur-md w-full"
                                        >
                                            <XCircle size={18} className="shrink-0 opacity-80" />
                                            <span className="font-semibold tracking-tight truncate">{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                                    <div className="space-y-5 w-full">
                                        {/* Email Field */}
                                        <div className="space-y-2.5 w-full">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] block opacity-70 w-full overflow-hidden truncate">
                                                Email Address
                                            </label>
                                            <div className="relative w-full overflow-hidden rounded-2xl">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-[14px] text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-400/30 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 hover:bg-white/[0.06] box-border min-w-0"
                                                    placeholder="name@example.com"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                                />
                                            </div>
                                        </div>

                                        {/* Password Field */}
                                        <div className="space-y-2.5 w-full">
                                            <div className="flex items-center justify-between w-full">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] block opacity-70 overflow-hidden truncate">
                                                    Password
                                                </label>
                                                <button type="button" className="text-sm text-blue-400/50 hover:text-blue-400 font-medium transition-colors duration-300 shrink-0">
                                                    Forgot?
                                                </button>
                                            </div>
                                            <div className="relative w-full overflow-hidden rounded-2xl">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                                                    <Lock size={18} />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 text-[14px] text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-400/30 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 hover:bg-white/[0.06] box-border min-w-0"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 z-10"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01, translateY: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] text-white text-[14px] font-bold rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 group overflow-hidden"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="tracking-tight">Sign In</span>
                                                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-300" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                {/* Divider */}
                                <div className="flex items-center gap-6 my-8 w-full">
                                    <div className="flex-1 h-px bg-white/5" />
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] opacity-80 shrink-0">or continue with</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>

                                {/* GitHub */}
                                <motion.button 
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.06)" }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full h-12 bg-white/[0.03] text-white rounded-2xl flex items-center justify-center gap-3.5 transition-all duration-300 border border-white/10 group shadow-sm"
                                >
                                    <Github size={19} className="group-hover:text-blue-400 transition-colors opacity-70" />
                                    <span className="font-bold text-[13px] tracking-tight opacity-90">GitHub Account</span>
                                </motion.button>

                                {/* Footer */}
                                <p className="mt-10 text-center text-slate-500 text-sm font-medium tracking-tight w-full">
                                    New here?{' '}
                                    <Link to="/auth/register" className="text-white hover:text-blue-400 transition-all font-bold underline-offset-8 hover:underline ml-1">
                                        Create account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
