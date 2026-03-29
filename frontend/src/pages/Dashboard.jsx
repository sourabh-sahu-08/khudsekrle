import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { analysisService } from "@/utils/api";
import { History, Code, Calendar, ExternalLink, Trash2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id) => {
        try {
            await analysisService.deleteAnalysis(id);
            setHistory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error("Failed to delete analysis", err);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await analysisService.getHistory();
                setHistory(response.data.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
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

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="glass h-56 rounded-3xl animate-pulse bg-white/[0.02]" />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {history.map((itemValue) => (
                            <motion.div 
                                key={itemValue._id} 
                                variants={item}
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
                                        <span className="italic">O</span>({itemValue.timeComplexity.includes('(') ? itemValue.timeComplexity.split('(')[1]?.split(')')[0] : itemValue.timeComplexity.replace('O(', '').replace(')', '') || "n"})
                                    </span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 text-emerald-400/80">
                                        {itemValue.confidenceScore} match
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
                                        onClick={() => handleDelete(itemValue._id)} 
                                        className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-[3rem] p-16 text-center h-[500px] flex flex-col items-center justify-center relative overflow-hidden border border-white/5"
                    >
                        <div className="absolute inset-0 bg-blue-500/[0.02] blur-3xl rounded-full" />
                        <div className="w-24 h-24 bg-slate-900/80 rounded-[2rem] flex items-center justify-center text-slate-500 mb-8 border border-white/5 shadow-2xl relative z-10">
                            <History size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-100 mb-3 relative z-10 italic">Journey Starts Here</h3>
                        <p className="text-slate-400 max-w-sm mb-10 text-lg relative z-10 leading-relaxed font-medium">Start your first analysis to see it tracked here in your dashboard.</p>
                        <Link
                            to="/"
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 font-bold text-lg group relative z-10"
                        >
                            Analyze your first code <Code size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
}
