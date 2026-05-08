import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { analysisService } from "@/utils/api";
import { History, Code, Calendar, ExternalLink, Trash2, Sparkles, Filter, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "@/components/ConfirmModal";

export default function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterLanguage, setFilterLanguage] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [stats, setStats] = useState({ total: 0, languages: 0, avgScore: 0 });
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setSearchQuery(q);

        const fetchHistory = async () => {
            try {
                const response = await analysisService.getHistory();
                const data = response.data.data;
                setHistory(data);
                
                const scores = data.map(i => parseInt(i.confidenceScore) || 0).filter(s => s > 0);
                setStats({ 
                    total: data.length, 
                    languages: [...new Set(data.map(i => i.language))].length, 
                    avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0 
                });
            } catch (err) {
                toast.error("Failed to fetch activity");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [searchParams]);

    const handleDeleteConfirm = async () => {
        if (!idToDelete) return;
        try {
            await analysisService.deleteAnalysis(idToDelete);
            setHistory(prev => prev.filter(item => item._id !== idToDelete));
            toast.success("Analysis deleted");
        } catch (err) {
            toast.error("Failed to delete analysis");
        } finally {
            setIdToDelete(null);
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = 
            item.originalCode.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.findings && String(item.findings).toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch && (filterLanguage === "all" || item.language === filterLanguage);
    }).sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        const scoreA = parseInt(a.confidenceScore) || 0;
        const scoreB = parseInt(b.confidenceScore) || 0;
        return scoreB - scoreA;
    });

    return (
        <Layout>
            <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-white tracking-tighter mb-3"
                        >
                            History
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 font-medium tracking-tight"
                        >
                            Review your code analyses and optimization history.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            to="/"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2.5"
                        >
                            <Code size={16} />
                            New Analysis
                        </Link>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Analyses', value: stats.total, color: 'blue' },
                        { label: 'Languages Used', value: stats.languages, color: 'emerald' },
                        { label: 'Avg Confidence Score', value: `${stats.avgScore}%`, color: 'purple' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="card-premium p-6 flex flex-col items-center text-center relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/[0.03] blur-3xl rounded-full`} />
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
                            <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
                        </motion.div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by code or findings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 hover:bg-white/[0.08]"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-white pointer-events-none" size={14} />
                            <select 
                                value={filterLanguage}
                                onChange={(e) => setFilterLanguage(e.target.value)}
                                className="bg-white/5 border border-white/5 rounded-xl py-3.5 pl-10 pr-6 text-xs font-bold uppercase tracking-widest text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer hover:bg-white/[0.08] appearance-none min-w-[160px]"
                            >
                                <option value="all" className="bg-slate-900">All Langs</option>
                                {[...new Set(history.map(item => item.language))].map(lang => (
                                    <option key={lang} value={lang} className="bg-slate-900">{lang}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="card-premium p-6 relative overflow-hidden">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                                            <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex gap-2">
                                            <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                                            <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
                                        </div>
                                        <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredHistory.length > 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {filteredHistory.map((item, i) => (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card-premium p-6 group hover:border-blue-500/20"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500 border border-blue-500/10 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <Code size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                                                    {item.originalCode.substring(0, 40).trim()}...
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-400/60 transition-colors">
                                                        {item.language}
                                                    </span>
                                                    <span className="text-slate-800">•</span>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { setIdToDelete(item._id); setIsModalOpen(true); }}
                                            className="p-2 text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-4">
                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {item.confidenceScore || "0%"} Score
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-600">O({item.timeComplexity?.match(/O\((.*?)\)/)?.[1] || "n"})</span>
                                        </div>
                                        <Link 
                                            to={`/dashboard/analysis/${item._id}`}
                                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-all group/link"
                                        >
                                            View Report
                                            <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="card-premium py-20 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none" />
                            <div className="w-20 h-20 bg-blue-500/5 rounded-3xl flex items-center justify-center text-blue-500/40 mb-6 border border-blue-500/10 shadow-inner">
                                <Sparkles size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight mb-2">No Analyses Recorded</h3>
                            <p className="text-sm text-slate-500 font-medium max-w-sm mb-8">Your dashboard is currently empty. Start by running an AI analysis on your code snippets to see them here.</p>
                            <Link 
                                to="/" 
                                className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95 flex items-center gap-2"
                            >
                                <Sparkles size={14} className="text-blue-400" />
                                Start First Analysis
                            </Link>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Analysis?"
                message="This will permanently delete this analysis record. This action cannot be undone."
                confirmText="Confirm Delete"
            />
        </Layout>
    );
}
