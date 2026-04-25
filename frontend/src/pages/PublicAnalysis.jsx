import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Code, Clock, Zap, AlertTriangle, CheckCircle, Database, Sparkles, Download, Check, Copy, Terminal, Split, LayoutList, ChevronLeft, ShieldCheck, Activity, Share2 } from "lucide-react";
import { DiffEditor, Editor } from "@monaco-editor/react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicAnalysis() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("diff");

    const cleanCode = (code) => code?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '') || "";

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                if (!id) return;
                const response = await analysisService.getPublicAnalysis(id);
                setAnalysis(response.data.data);
            } catch (err) {
                setError("This analysis is either private or does not exist.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [id]);

    const handleDownloadMarkdown = () => {
        if (!analysis) return;
        const markdown = `# Shared Analysis: ${analysis.language}\n\n## Findings\n${analysis.findings}\n\n## Explanation\n${analysis.explanation}`;
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_${id?.substring(0, 8)}.md`;
        a.click();
        toast.success("Markdown report exported");
    };

    if (loading) return (
        <Layout><div className="h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div></Layout>
    );

    if (error || !analysis) return (
        <Layout>
            <div className="max-w-xl mx-auto pt-40 px-6 text-center">
                <div className="card-premium p-12 space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 mx-auto border border-red-500/20">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Access Denied</h2>
                    <p className="text-slate-500 font-medium">{error}</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-white transition-colors pt-4">
                        <ChevronLeft size={16} />
                        Return to Workspace
                    </Link>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                           <Link to="/" className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all">
                              <ChevronLeft size={18} />
                           </Link>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Public Audit Report</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight-extreme mb-2 flex items-center gap-4">
                           Shared Insight
                           <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-400 uppercase tracking-widest">{analysis.language}</span>
                        </h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                           <Clock size={14} />
                           Finalized on {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="card-premium px-6 py-3 flex items-center gap-6">
                            <div className="flex flex-col items-center">
                               <span className="text-[9px] font-black uppercase text-slate-600 mb-1">Confidence</span>
                               <span className="text-sm font-black text-blue-500">{analysis.confidenceScore}</span>
                            </div>
                            <div className="h-6 w-[1px] bg-white/5" />
                            <button 
                                onClick={handleDownloadMarkdown}
                                className="p-2 text-slate-500 hover:text-white transition-all"
                                title="Export Markdown"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Core Findings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-premium p-8 lg:col-span-2 space-y-6 border-l-4 border-l-blue-600"
                    >
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-blue-500" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Audit Summary</h3>
                        </div>
                        <p className="text-[15px] text-slate-300 leading-relaxed font-medium bg-black/20 p-6 rounded-2xl border border-white/5">
                            {analysis.findings}
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-premium p-8 flex flex-col justify-center space-y-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/5 flex items-center justify-center text-blue-500 rounded-xl border border-blue-500/10">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Efficiency</p>
                                <p className="text-xl font-black text-white font-mono">{analysis.timeComplexity}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/5 flex items-center justify-center text-emerald-500 rounded-xl border border-emerald-500/10">
                                <Database size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Footprint</p>
                                <p className="text-xl font-black text-white font-mono">{analysis.spaceComplexity}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* AI Explanation */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-premium p-10 mb-12 space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-purple-400" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Logic Rationale</h3>
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed font-medium">{analysis.explanation}</p>
                </motion.div>

                {/* Comparison Engine */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                        <Terminal size={20} className="text-blue-400" />
                        Comparison Node
                    </h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {[
                            { id: 'diff', label: 'Diff View', icon: Split },
                            { id: 'blocks', label: 'Blocks', icon: LayoutList }
                        ].map((mode) => (
                            <button 
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                            >
                                <mode.icon size={14} />
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === "diff" ? (
                        <motion.div 
                            key="diff"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="card-premium overflow-hidden h-[500px] mb-12"
                        >
                            <DiffEditor
                                height="100%"
                                language={analysis.language || "javascript"}
                                original={cleanCode(analysis.originalCode)}
                                modified={cleanCode(analysis.correctedCode)}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    renderSideBySide: true,
                                    fontFamily: 'Fira Code, monospace',
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="blocks"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
                        >
                            <div className="card-premium overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-black uppercase tracking-widest text-slate-500">Input_Buffer</div>
                                <div className="h-[400px]">
                                    <Editor
                                        height="100%"
                                        language={analysis.language || "javascript"}
                                        value={cleanCode(analysis.originalCode)}
                                        theme="vs-dark"
                                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, fontFamily: 'Fira Code, monospace' }}
                                    />
                                </div>
                            </div>
                            <div className="card-premium overflow-hidden border-blue-500/20">
                                <div className="px-6 py-4 border-b border-white/5 bg-blue-500/5 text-[10px] font-black uppercase tracking-widest text-blue-400">Resolution_Output</div>
                                <div className="h-[400px]">
                                    <Editor
                                        height="100%"
                                        language={analysis.language || "javascript"}
                                        value={cleanCode(analysis.correctedCode)}
                                        theme="vs-dark"
                                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, fontFamily: 'Fira Code, monospace' }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Final CTA */}
                <div className="mt-20 card-premium p-16 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl font-black text-white tracking-tight">Deploy Better Code.</h3>
                        <p className="text-slate-500 max-w-xl mx-auto font-medium">Join the neural auditing platform and eliminate security vulnerabilities before they reach production.</p>
                        <Link to="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all inline-block shadow-2xl shadow-blue-500/20">
                            Create Master Account
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
