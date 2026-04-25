import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { analysisService } from "@/utils/api";
import { History, Code, Calendar, ExternalLink, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";

export default function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterLanguage, setFilterLanguage] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        languages: 0,
        avgScore: 0
    });

    const handleDeleteClick = (id) => {
        setIdToDelete(id);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!idToDelete) return;
        try {
            await analysisService.deleteAnalysis(idToDelete);
            setHistory(prev => prev.filter(item => item._id !== idToDelete));
            toast.success("Analysis deleted");
        } catch (err) {
            console.error("Failed to delete analysis", err);
            toast.error("Failed to delete analysis");
        } finally {
            setIdToDelete(null);
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setSearchQuery(q);

        const fetchHistory = async () => {
            try {
                const response = await analysisService.getHistory();
                const data = response.data.data;
                setHistory(data);
                
                // Calculate Stats
                const total = data.length;
                const uniqueLangs = [...new Set(data.map(i => i.language))].length;
                const scores = data.map(i => parseInt(i.confidenceScore) || 0).filter(s => s > 0);
                const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                
                setStats({ total, languages: uniqueLangs, avgScore });
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [searchParams]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-[1400px] mx-auto pt-32 px-12 pb-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Your Analyses</h1>
                        <p className="text-slate-400 font-medium">Manage and view your previous code debugging sessions</p>
                    </div>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        New Analysis
                    </Link>
                </div>

                {/* Stats Section */}
                {!loading && history.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                    >
                        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.05] blur-2xl rounded-full translate-x-8 -translate-y-8" />
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Analyses</p>
                            <h4 className="text-3xl font-black text-white">{stats.total}</h4>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.05] blur-2xl rounded-full translate-x-8 -translate-y-8" />
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Languages</p>
                            <h4 className="text-3xl font-black text-white">{stats.languages}</h4>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/[0.05] blur-2xl rounded-full translate-x-8 -translate-y-8" />
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Avg Score</p>
                            <h4 className="text-3xl font-black text-white">{stats.avgScore}%</h4>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-12">
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                            <History size={20} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search your code or findings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-600 hover:bg-white/[0.08]"
                        />
                    </div>
                    <div className="md:col-span-1.5 relative">
                        <select 
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer hover:bg-white/[0.08] appearance-none"
                        >
                            <option value="all" className="bg-slate-900">All Languages</option>
                            {[...new Set(history.map(item => item.language))].map(lang => (
                                <option key={lang} value={lang} className="bg-slate-900 capitalize">{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-1.5 relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer hover:bg-white/[0.08] appearance-none"
                        >
                            <option value="newest" className="bg-slate-900">Newest First</option>
                            <option value="oldest" className="bg-slate-900">Oldest First</option>
                            <option value="highestScore" className="bg-slate-900">Highest Score</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="glass h-56 rounded-3xl animate-pulse bg-white/[0.02]" />
                        ))}
                    </div>
                ) : (() => {
                    const filteredHistory = history.filter(item => {
                        const matchesSearch = 
                            item.originalCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.findings && String(item.findings).toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (item.explanation && String(item.explanation).toLowerCase().includes(searchQuery.toLowerCase()));
                        
                        const matchesLanguage = filterLanguage === "all" || item.language === filterLanguage;
                        
                        return matchesSearch && matchesLanguage;
                    }).sort((a, b) => {
                        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
                        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
                        if (sortBy === "highestScore") {
                            const scoreA = parseInt(a.confidenceScore) || 0;
                            const scoreB = parseInt(b.confidenceScore) || 0;
                            return scoreB - scoreA;
                        }
                        return 0;
                    });

                    const groupHistory = (items) => {
                        if (sortBy !== "newest") return { "All Results": items };
                        
                        const groups = { "Today": [], "Yesterday": [], "Earlier": [] };
                        const today = new Date().toDateString();
                        const yesterday = new Date(Date.now() - 86400000).toDateString();
                        
                        items.forEach(i => {
                            const date = new Date(i.createdAt).toDateString();
                            if (date === today) groups["Today"].push(i);
                            else if (date === yesterday) groups["Yesterday"].push(i);
                            else groups["Earlier"].push(i);
                        });
                        
                        return Object.fromEntries(Object.entries(groups).filter(([_, val]) => val.length > 0));
                    };

                    const groupedHistory = groupHistory(filteredHistory);

                    return filteredHistory.length > 0 ? (
                        <div className="space-y-16">
                            {Object.entries(groupedHistory).map(([groupName, items]) => (
                                <div key={groupName} className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 whitespace-nowrap">{groupName}</h3>
                                        <div className="h-[1px] w-full bg-white/5" />
                                    </div>
                                    <motion.div 
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {items.map((itemValue) => (
                                            <motion.div 
                                                key={itemValue._id} 
                                                variants={item}
                                                whileHover={{ 
                                                    y: -10,
                                                    transition: { duration: 0.3 }
                                                }}
                                                className="glass p-7 rounded-3xl group border border-white/5 glass-hover relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.03] blur-2xl rounded-full translate-x-12 -translate-y-12" />
                                                
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3 text-blue-400">
                                                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                            <Code size={18} />
                                                        </div>
                                                        <span className="font-bold tracking-widest text-xs uppercase">{itemValue.language}</span>
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {new Date(itemValue.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-200 mb-3 line-clamp-1 group-hover:text-white transition-colors">
                                                    {itemValue.originalCode.substring(0, 50).trim()}...
                                                </h3>

                                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-8 tracking-wide">
                                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/5 text-blue-400/80">
                                                        <span className="italic">O</span>({
                                                            itemValue.timeComplexity?.match(/O\((.*?)\)/)?.[1] || 
                                                            itemValue.timeComplexity?.replace(/O\(|\)/g, '') || 
                                                            "n"
                                                        })
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 text-emerald-400/80">
                                                        {itemValue.confidenceScore || "0%"} Score
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 relative z-10">
                                                    <Link 
                                                        to={`/dashboard/analysis/${itemValue._id}`} 
                                                        className="flex-1 bg-slate-900/80 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-slate-800 group-hover:border-slate-700"
                                                    >
                                                        <ExternalLink size={16} />
                                                        View Details
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteClick(itemValue._id)} 
                                                        className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all active:scale-90"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-[3rem] p-16 text-center h-[400px] flex flex-col items-center justify-center relative overflow-hidden border border-white/5"
                        >
                            <div className="absolute inset-0 bg-blue-500/[0.02] blur-3xl rounded-full" />
                            <div className="w-20 h-20 bg-slate-900/80 rounded-[2rem] flex items-center justify-center text-slate-500 mb-6 border border-white/5 relative z-10">
                                <History size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-100 mb-2 relative z-10">No matches found</h3>
                            <p className="text-slate-400 max-w-xs mb-8 relative z-10 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setFilterLanguage("all"); }}
                                className="text-blue-400 hover:text-blue-300 transition-colors font-bold group relative z-10"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )
                })()}
            </div>

            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Analysis?"
                message="Are you sure you want to delete this analysis? This action is permanent and cannot be undone."
                confirmText="Yes, Delete"
            />
        </Layout>
    );
}
