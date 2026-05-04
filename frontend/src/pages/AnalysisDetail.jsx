import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Clock, AlertTriangle, Database, Sparkles, Download, Share2, Check, FileJson, Globe, Lock, MessageSquare, Terminal } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CodePreview from "@/components/shared/CodePreview";
import ChatInterface from "@/components/analysis/ChatInterface";
import CommentsSection from "@/components/analysis/CommentsSection";

export default function AnalysisDetail() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalHeight) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleShare = () => {
        const url = `${window.location.origin}/analysis/public/${id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Public link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTogglePublic = async () => {
        try {
            const response = await analysisService.togglePublic(id);
            setAnalysis(response.data.data);
            toast.success(response.data.data.isPublic ? "Global visibility enabled" : "Privacy protocol activated");
        } catch (err) {
            toast.error("Network error: Visibility update failed");
        }
    };

    const handleDownloadMarkdown = () => {
        if (!analysis) return;
        try {
            const markdown = `# AI Audit Report: ${analysis.language.toUpperCase()}\n\n## Findings\n${analysis.findings}\n\n## Explanation\n${analysis.explanation}\n\n## Corrected Code\n\`\`\`${analysis.language}\n${analysis.correctedCode}\n\`\`\``;
            const blob = new Blob([markdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit_${id?.substring(0, 8)}.md`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Report exported as Markdown");
        } catch (err) {
            toast.error("Export failed");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                        <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin relative z-10 shadow-2xl"></div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-white font-black text-xl tracking-[0.2em] uppercase animate-shimmer bg-clip-text text-transparent">Decoding Metadata</p>
                        <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">INITIALIZING SECURE SESSION...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !analysis) {
        return (
            <Layout>
                <div className="max-w-6xl mx-auto pt-32 px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-16 rounded-[3rem] text-center max-w-2xl mx-auto border border-red-500/10 shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-red-500/5 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/10 shadow-inner">
                            <AlertTriangle size={48} />
                        </div>
                        <h2 className="text-3xl text-white font-black mb-4 tracking-tight">Access Protocol Failure</h2>
                        <p className="text-slate-400 mb-12 leading-relaxed font-medium text-lg">{error || "The requested analysis does not exist in our neural core."}</p>
                        <Link to="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all inline-flex items-center gap-4 border border-white/5 shadow-xl">
                            <ArrowLeft size={18} />
                            Return to Nexus
                        </Link>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
                <motion.div className="h-full bg-blue-500 origin-left shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${scrollProgress}%` }} />
            </div>

            <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-24">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link to="/dashboard" className="text-slate-500 hover:text-white flex items-center gap-2 mb-12 transition-all font-black text-[10px] tracking-widest-xl group w-fit">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO TERMINAL
                    </Link>
                </motion.div>

                <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-16 gap-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-5 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-2xl border border-blue-500/10">
                                <FileJson size={32} />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tightest-extreme mb-1">
                                    Analysis Report
                                </h1>
                                <div className="flex items-center gap-4">
                                    <span className="bg-blue-500/10 px-4 py-1.5 rounded-lg text-[10px] text-blue-400 uppercase font-black tracking-widest-xl border border-blue-500/10">
                                        {analysis.language}
                                    </span>
                                    <span className="text-slate-800">/</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(analysis.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass px-10 py-6 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center gap-8 shadow-2xl">
                        <div className="flex flex-col gap-2">
                            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Confidence Score</p>
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <motion.div initial={{ width: 0 }} animate={{ width: analysis.confidenceScore || '90%' }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                                </div>
                                <span className="text-blue-400 font-black text-2xl tracking-tighter">{analysis.confidenceScore}</span>
                            </div>
                        </div>

                        <div className="h-12 w-[1px] bg-white/5 hidden xl:block" />

                        <div className="flex items-center gap-3">
                            <button onClick={handleTogglePublic} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border shadow-lg ${analysis.isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`} title={analysis.isPublic ? "Make Private" : "Make Public"}>
                                {analysis.isPublic ? <Globe size={20} /> : <Lock size={20} />}
                            </button>
                            <button onClick={handleDownloadMarkdown} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-90 border border-white/5 shadow-lg" title="Download Report">
                                <Download size={20} />
                            </button>
                            <button onClick={handleShare} disabled={!analysis.isPublic} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border relative shadow-lg ${!analysis.isPublic ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white'}`}>
                                {copied ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 glass p-12 rounded-[3rem] border-l-4 border-l-blue-600 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/[0.03] blur-3xl rounded-full translate-x-40 -translate-y-40" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Findings</h3>
                        </div>
                        <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                            <pre className="text-slate-300 leading-relaxed font-mono text-base whitespace-pre-wrap">{analysis.findings}</pre>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center gap-6 group hover:border-blue-500/20 transition-all">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-110 transition-transform">
                                <Clock size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Time Complexity</p>
                                <p className="text-3xl font-mono text-white font-bold tracking-tighter">{analysis.timeComplexity}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                                <Database size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Memory Usage</p>
                                <p className="text-3xl font-mono text-white font-bold tracking-tighter">{analysis.spaceComplexity}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-[3.5rem] mb-20 border border-white/5 shadow-3xl relative overflow-hidden group">
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/[0.03] blur-3xl rounded-full" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Explanation</h3>
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-2xl font-bold tracking-tight relative z-10">{analysis.explanation}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    <CodePreview title="Original Code" code={analysis.originalCode} language={analysis.language} height="400px" />
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2rem] blur-xl opacity-50" />
                        <CodePreview title="Optimized Code" code={analysis.correctedCode} language={analysis.language} height="400px" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-10">
                        <div className="flex items-center gap-5 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10 shadow-lg">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">AI Assistant</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ask questions about this report</p>
                            </div>
                        </div>
                        <ChatInterface analysisId={id} initialMessages={analysis.chatHistory || []} />
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-5 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-lg">
                                <Terminal size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">My Notes</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Saved developer notes</p>
                            </div>
                        </div>
                        <CommentsSection analysisId={id} initialComments={analysis.comments || []} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
