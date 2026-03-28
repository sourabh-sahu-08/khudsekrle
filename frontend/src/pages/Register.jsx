import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { authService } from '@/utils/api';
import Layout from '@/components/Layout';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await authService.register({ name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[85vh] flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-md glass p-10 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                    
                    <h1 className="text-4xl font-black text-center mb-3 text-white tracking-tight">Create Account</h1>
                    <p className="text-slate-400 text-center mb-10 font-medium">Join the community of developers</p>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-medium animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 hover:bg-slate-800/50"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 hover:bg-slate-800/50"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 hover:bg-slate-800/50"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                            <span className="bg-[#0f172a] px-4 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 bg-slate-900/80 hover:bg-slate-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-800 hover:border-slate-700">
                        <Github size={20} />
                        <span className="font-bold">GitHub</span>
                    </button>

                    <p className="mt-8 text-center text-slate-400 font-medium text-sm">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
                            Login instead
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}
