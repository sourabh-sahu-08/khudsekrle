import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Code, Clock, Zap, AlertTriangle, CheckCircle, Database, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

export default function AnalysisDetail() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                if (!id) return;
                const response = await analysisService.getAnalysisById(id);
                setAnalysis(response.data.data);
            } catch (err) {
                console.error("Failed to fetch analysis", err);
                setError(err.response?.data?.message || "Something went wrong fetching the analysis.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto pt-24 px-6 pb-12 flex flex-col justify-center items-center h-[70vh] space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin relative z-10"></div>
                    </div>
                    <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">RECOVERING DATA...</p>
                </div>
            </Layout>
        );
    }

    if (error || !analysis) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-12 rounded-[2.5rem] text-center max-w-xl mx-auto border border-red-500/10 shadow-2xl shadow-red-500/5"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-6">
                            <AlertTriangle size={40} />
                        </div>
                        <h2 className="text-2xl text-white font-black mb-3">Analysis Lost</h2>
                        <p className="text-slate-400 mb-10 leading-relaxed font-medium">{error}</p>
                        <Link to="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center gap-3 border border-slate-800">
                            <ArrowLeft size={20} />
                            Return to Dashboard
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link to="/dashboard" className="text-slate-500 hover:text-white flex items-center gap-2 mb-10 transition-all font-bold text-sm tracking-widest group w-fit">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO DASHBOARD
                    </Link>
                </motion.div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5 border border-blue-500/10">
                                <Code size={28} />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Analysis Results
                            </h1>
                        </div>
                        <p className="text-slate-400 flex items-center gap-3 font-medium ml-1">
                            <span className="font-mono bg-blue-500/10 px-3 py-1 rounded-lg text-xs text-blue-400 uppercase font-bold tracking-widest border border-blue-500/10">
                                {analysis.language}
                            </span>
                            <span className="text-slate-700">•</span>
                            <span className="text-sm">{new Date(analysis.createdAt).toLocaleString()}</span>
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass px-8 py-5 rounded-[2rem] border border-white/5 flex items-center gap-6 shadow-2xl"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">AI Confidence</p>
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-32 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: analysis.confidenceScore || '0%' }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                                    />
                                </div>
                                <span className="text-blue-400 font-black text-xl leading-none">{analysis.confidenceScore}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-10 rounded-[2.5rem] border-l-4 border-l-purple-500 lg:col-span-2 relative overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/[0.03] blur-3xl rounded-full translate-x-24 -translate-y-24" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <AlertTriangle className="text-purple-400" size={22} />
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Identified Vulnerabilities</h3>
                        </div>
                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 relative z-10">
                            <pre className="text-slate-300 leading-relaxed font-mono text-[15px] whitespace-pre-wrap">{analysis.findings}</pre>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-10 rounded-[2.5rem] flex flex-col justify-center space-y-10 border border-white/5 shadow-2xl"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Time Complexity</p>
                                <p className="text-2xl font-mono text-white font-bold leading-none">{analysis.timeComplexity}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
                                <Database size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Space Complexity</p>
                                <p className="text-2xl font-mono text-white font-bold leading-none">{analysis.spaceComplexity}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-10 rounded-[2.5rem] mb-12 border border-white/5 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-3xl rounded-full translate-x-32 -translate-y-32" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Sparkles className="text-blue-400" size={24} />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Detailed AI Insights</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xl font-medium relative z-10">{analysis.explanation}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
                    >
                        <div className="bg-slate-900 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                <Code size={18} className="text-slate-500" />
                                Original Codebase
                            </h3>
                        </div>
                        <div className="p-8 bg-slate-950/80">
                            <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 shadow-inner overflow-x-auto">
                                <pre className="text-slate-400 font-mono text-sm leading-relaxed">
                                    <code>{analysis.originalCode}</code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass rounded-[2rem] overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 group"
                    >
                        <div className="bg-emerald-500/[0.03] px-8 py-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-emerald-400/80 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                <CheckCircle size={18} className="text-emerald-500" />
                                Recommended Resolution
                            </h3>
                        </div>
                        <div className="p-8 bg-emerald-500/[0.01]">
                            <div className="bg-slate-950/80 rounded-2xl p-6 border border-emerald-500/10 shadow-inner overflow-x-auto group-hover:border-emerald-500/30 transition-colors">
                                <pre className="text-emerald-400/90 font-mono text-sm leading-relaxed">
                                    <code>{analysis.correctedCode}</code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {analysis.optimizedCode && analysis.optimizedCode !== analysis.correctedCode && analysis.optimizedCode !== "N/A" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-12 glass rounded-[2.5rem] overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-500/5 group"
                    >
                        <div className="bg-blue-500/[0.03] px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-blue-400/80 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                <Zap size={20} className="text-blue-500 animate-pulse" />
                                Performance Optimized Pattern
                            </h3>
                        </div>
                        <div className="p-10 bg-blue-500/[0.01]">
                            <div className="bg-slate-950/80 rounded-3xl p-8 border border-blue-500/10 shadow-inner group-hover:border-blue-500/30 transition-all">
                                <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                                    <code>{analysis.optimizedCode}</code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </Layout>
    );
}
