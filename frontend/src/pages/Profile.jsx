import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Hash, Shield, ArrowLeft, LogOut, Lock, Activity, TrendingUp, Zap, ChevronRight, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { analysisService, authService } from '@/utils/api';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ totalAnalyses: 0, corrections: 0, optimizations: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [updating, setUpdating] = useState(false);
    const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showSecurity, setShowSecurity] = useState(false);
    const [updatingSecurity, setUpdatingSecurity] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [userRes, statsRes, historyRes] = await Promise.all([
                    authService.getMe(),
                    analysisService.getStats(),
                    analysisService.getHistory()
                ]);
                const userData = userRes.data.data;
                setUser({ ...userData, id: userData._id || userData.id });
                setFormData({ name: userData.name, email: userData.email });
                setStats(statsRes.data.data);
                setHistory(historyRes.data.data);
            } catch (err) {
                if (err.response?.status === 401) navigate('/auth/login');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await authService.updateDetails(formData);
            const userData = response.data.data;
            setUser(prev => ({ ...prev, ...userData }));
            setIsEditing(false);
            toast.success("Identity updated");
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) return toast.error("Passwords mismatch");
        setUpdatingSecurity(true);
        try {
            await authService.updatePassword({
                currentPassword: securityData.currentPassword,
                newPassword: securityData.newPassword
            });
            setShowSecurity(false);
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success("Security credentials updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Security update failed");
        } finally {
            setUpdatingSecurity(false);
        }
    };

    if (loading) return (
        <Layout><div className="max-w-5xl mx-auto pt-32 px-6 h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div></Layout>
    );

    return (
        <Layout>
            <div className="max-w-5xl mx-auto pt-32 px-6 pb-20">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 relative group">
                            <User size={40} className="group-hover:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0B0F1A]" title="Verified" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight-extreme mb-2">{user.name}</h1>
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <Mail size={14} />
                                {user.email}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <Edit3 size={14} />
                            Modify Identity
                        </button>
                        <button 
                            onClick={() => { localStorage.clear(); window.location.href = '/auth/login'; }}
                            className="text-red-400 hover:text-red-300 font-black text-[11px] uppercase tracking-widest px-4 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Meta */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="card-premium p-8 space-y-8">
                            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                                <TrendingUp size={18} className="text-blue-500" />
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">System Analytics</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Total Audits</p>
                                    <p className="text-3xl font-black text-white">{stats.totalAnalyses}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Resolutions</p>
                                    <p className="text-3xl font-black text-emerald-500">{stats.corrections}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Optimizations</p>
                                    <p className="text-3xl font-black text-purple-500">{stats.optimizations}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-8 space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                <Shield size={18} className="text-emerald-500" />
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Security Node</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Protocol</span>
                                    <span className="text-[11px] font-black text-white uppercase">Encrypted_V2</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                    <span className="text-[11px] font-black text-emerald-500 uppercase">Operational</span>
                                </div>
                                <button 
                                    onClick={() => setShowSecurity(!showSecurity)}
                                    className="w-full mt-4 py-2.5 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-white/5"
                                >
                                    {showSecurity ? "Conceal Settings" : "Security Override"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content/Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="card-premium p-10"
                                >
                                    <h3 className="text-xl font-black text-white mb-8 tracking-tight">Identity Parameters</h3>
                                    <form onSubmit={handleUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Legal Name</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-6 text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Access</label>
                                                <input 
                                                    type="email" 
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-6 text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-4">
                                            <button 
                                                type="submit" 
                                                disabled={updating}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50"
                                            >
                                                {updating ? "Processing..." : "Commit Changes"}
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-4 transition-colors">Abort</button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : showSecurity ? (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="card-premium p-10"
                                >
                                    <h3 className="text-xl font-black text-white mb-8 tracking-tight">Credential Management</h3>
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Current Secret</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={securityData.currentPassword}
                                                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                                                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-6 text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">New Secret</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    value={securityData.newPassword}
                                                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-6 text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirm Secret</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    value={securityData.confirmPassword}
                                                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-6 text-white text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-4">
                                            <button 
                                                type="submit"
                                                disabled={updatingSecurity}
                                                className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {updatingSecurity ? "Updating..." : "Update Credentials"}
                                            </button>
                                            <button onClick={() => setShowSecurity(false)} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-4 transition-colors">Discard</button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="activity"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    {/* Language Distribution */}
                                    <div className="card-premium p-10">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                                            <Activity size={14} className="text-blue-400" />
                                            Language Mastery
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {Object.entries(
                                                history.reduce((acc, item) => {
                                                    acc[item.language] = (acc[item.language] || 0) + 1;
                                                    return acc;
                                                }, {})
                                            )
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([lang, count], idx) => (
                                                <div key={lang} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{lang}</span>
                                                        <span className="text-[10px] font-black text-blue-400 uppercase">{count} audits</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(count / history.length) * 100}%` }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                            className="h-full bg-blue-600"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity List */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Terminal Activity</h3>
                                        {history.length > 0 ? (
                                            history.slice(0, 4).map((item) => (
                                                <Link 
                                                    key={item._id} 
                                                    to={`/dashboard/analysis/${item._id}`}
                                                    className="card-premium p-6 flex items-center justify-between group hover:border-blue-500/20"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            <Terminal size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold text-sm line-clamp-1">{item.originalCode.substring(0, 30)}...</p>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.language} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="card-premium p-10 text-center">
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">No activity recorded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
