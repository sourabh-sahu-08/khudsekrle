import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Hash, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return (
            <Layout>
                <div className="pt-32 px-6 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-slate-400">Loading your profile...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2rem] overflow-hidden border border-white/5"
                >
                    {/* Header/Cover */}
                    <div className="h-40 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    </div>

                    <div className="px-8 pb-12 -mt-16 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15 }}
                                className="w-32 h-32 rounded-3xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-blue-500 shadow-2xl relative overflow-hidden group"
                            >
                                <User size={64} className="group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>

                            <div className="flex-1 pb-2">
                                <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                                    {user.username}
                                </h1>
                                <p className="text-slate-400 flex items-center gap-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    Account Verified
                                </p>
                            </div>

                            <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField 
                                icon={<User size={20} />} 
                                label="Username" 
                                value={user.username} 
                                delay={0.1}
                            />
                            <ProfileField 
                                icon={<Mail size={20} />} 
                                label="Email Address" 
                                value={user.email} 
                                delay={0.2}
                            />
                            <ProfileField 
                                icon={<Hash size={20} />} 
                                label="User ID" 
                                value={user.id.substring(0, 12) + "..."} 
                                delay={0.3}
                            />
                            <ProfileField 
                                icon={<Calendar size={20} />} 
                                label="Joined" 
                                value={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                                delay={0.4}
                            />
                        </div>

                        {/* Stats Section */}
                        <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <StatCard label="Analyses" value="12" />
                            <StatCard label="Fixed" value="8" />
                            <StatCard label="Optimized" value="4" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

function ProfileField({ icon, label, value, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/[0.08] transition-colors"
        >
            <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </motion.div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="text-center md:text-left">
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{label}</p>
        </div>
    );
}
