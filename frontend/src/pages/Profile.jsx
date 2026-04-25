import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Hash, Shield, ArrowLeft, LogOut, Lock } from 'lucide-react';
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
                // 1. Try to get initial user from localStorage for instant UI
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setFormData({ name: parsedUser.name, email: parsedUser.email });
                }

                // 2. Fetch fresh data from API
                const [userRes, statsRes, historyRes] = await Promise.all([
                    authService.getMe(),
                    analysisService.getStats(),
                    analysisService.getHistory()
                ]);

                const userData = userRes.data.data;
                const userWithId = { ...userData, id: userData._id || userData.id };
                
                setUser(userWithId);
                setFormData({ name: userData.name, email: userData.email });
                localStorage.setItem('user', JSON.stringify(userWithId));
                
                setStats(statsRes.data.data);
                setHistory(historyRes.data.data);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
                if (err.response?.status === 401) {
                    navigate('/auth/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await authService.updateDetails(formData);
            const userData = response.data.data;
            const updatedUser = { ...user, ...userData, id: userData._id || userData.id };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (securityData.newPassword.length < 6) {
            return toast.error("New password must be at least 6 characters");
        }
        
        setUpdatingSecurity(true);
        try {
            const response = await authService.updatePassword({
                currentPassword: securityData.currentPassword,
                newPassword: securityData.newPassword
            });
            localStorage.setItem('token', response.data.token);
            
            const userData = response.data.user;
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowSecurity(false);
            toast.success("Password updated successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password");
        } finally {
            setUpdatingSecurity(false);
        }
    };

    if (!user || loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto pt-32 px-6 pb-20 animate-pulse">
                    <div className="h-8 w-32 bg-white/5 rounded-xl mb-8" />
                    <div className="glass rounded-[2rem] overflow-hidden border border-white/5">
                        <div className="h-40 bg-white/5" />
                        <div className="px-8 pb-12 -mt-16 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12">
                                <div className="w-32 h-32 rounded-3xl bg-slate-900 border-4 border-slate-950" />
                                <div className="flex-1 space-y-3 pb-2">
                                    <div className="h-10 w-48 bg-white/10 rounded-xl" />
                                    <div className="h-4 w-32 bg-white/5 rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-white/5 rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-bold text-sm"
                    >
                        <LogOut size={18} />
                        Logout Session
                    </button>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-[2rem] overflow-hidden border border-white/5"
                >
                    {/* Header/Cover */}
                    <div className="h-40 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 relative">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')] opacity-20" />
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
                                    {user.name}
                                </h1>
                                <p className="text-slate-400 flex items-center gap-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    Account Verified
                                </p>
                            </div>

                            {!isEditing && (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <motion.form 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleUpdate} 
                                className="space-y-6 bg-white/[0.02] p-8 rounded-3xl border border-white/5"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={updating}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updating ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: user.name, email: user.email });
                                        }}
                                        className="text-slate-400 hover:text-white font-bold transition-colors px-4"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField 
                                icon={<User size={20} />} 
                                label="Name" 
                                value={user.name} 
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
                                value={user.id?.substring(0, 12) + "..." || "N/A"} 
                                delay={0.3}
                            />
                            <ProfileField 
                                icon={<Calendar size={20} />} 
                                label="Joined" 
                                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"} 
                                delay={0.4}
                            />
                        </div>
                        )}

                        {/* Stats Section */}
                        <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <StatCard label="Analyses" value={loading ? "..." : stats.totalAnalyses} />
                            <StatCard label="Fixed" value={loading ? "..." : stats.corrections} />
                            <StatCard label="Optimized" value={loading ? "..." : stats.optimizations} />
                        </div>

                        {/* Language Distribution */}
                        {!loading && history.length > 0 && (
                            <div className="mt-12 pt-12 border-t border-white/5">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Language Distribution</h3>
                                <div className="space-y-6">
                                    {Object.entries(
                                        history.reduce((acc, item) => {
                                            acc[item.language] = (acc[item.language] || 0) + 1;
                                            return acc;
                                        }, {})
                                    )
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([lang, count], idx) => (
                                        <div key={lang} className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-slate-300">{lang}</span>
                                                <span className="text-blue-400">{count} {count === 1 ? 'Analysis' : 'Analyses'}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(count / history.length) * 100}%` }}
                                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="mt-12 pt-12 border-t border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Recent Activity</h3>
                                <Link to="/dashboard" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
                            </div>
                            
                            <div className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
                                ) : history.length > 0 ? (
                                    history.slice(0, 3).map((item, idx) => (
                                        <Link 
                                            key={item._id} 
                                            to={`/dashboard/analysis/${item._id}`}
                                            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                    <Hash size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm line-clamp-1">{item.originalCode.substring(0, 40)}...</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.language} • {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-slate-500 group-hover:text-white transition-colors">
                                                <ArrowLeft size={16} className="rotate-180" />
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                                        <p className="text-slate-500 text-sm font-medium">No recent analyses found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Section Toggle */}
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <button 
                                onClick={() => setShowSecurity(!showSecurity)}
                                className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold group"
                            >
                                <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all ${showSecurity ? 'bg-blue-500/10 text-blue-400' : ''}`}>
                                    <Lock size={18} />
                                </div>
                                <span>{showSecurity ? "Hide Security Settings" : "Security & Password"}</span>
                            </button>

                            <AnimatePresence>
                                {showSecurity && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <form onSubmit={handleUpdatePassword} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.01] p-8 rounded-3xl border border-white/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    value={securityData.currentPassword}
                                                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                                                <input 
                                                    type="password" 
                                                    required
                                                    value={securityData.newPassword}
                                                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
                                                <div className="flex items-center gap-4">
                                                    <input 
                                                        type="password" 
                                                        required
                                                        value={securityData.confirmPassword}
                                                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                                        className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                    <button 
                                                        type="submit"
                                                        disabled={updatingSecurity}
                                                        className="bg-white text-black h-full px-6 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 min-w-[120px]"
                                                    >
                                                        {updatingSecurity ? "Updating..." : "Update"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
