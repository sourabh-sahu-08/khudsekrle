import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Code, Clock, Zap, AlertTriangle, CheckCircle, Database, Sparkles, Download, Check, Copy, Terminal, Split, LayoutList } from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PublicAnalysis() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("diff"); // "diff" or "blocks"

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                if (!id) return;
                const response = await analysisService.getPublicAnalysis(id);
                setAnalysis(response.data.data);
            } catch (err) {
                console.error("Failed to fetch public analysis", err);
                setError(err.response?.data?.message || "This analysis is either private or does not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    const handleDownloadMarkdown = () => {
        if (!analysis) return;
        try {
            const markdown = `
# khudsekrle Shared Analysis: ${analysis.language.toUpperCase()}
*Generated on: ${new Date(analysis.createdAt).toLocaleString()}*

## 1. Identified Findings
${analysis.findings}

## 2. AI Insights & Explanation
${analysis.explanation}

## 3. Recommended Resolution (Corrected Code)
\`\`\`${analysis.language}
${analysis.correctedCode}
\`\`\`

## 4. Expected Output
\`\`\`text
${analysis.expectedOutput || "N/A"}
\`\`\`

## 5. Performance Optimized Pattern
\`\`\`${analysis.language}
${analysis.optimizedCode || "N/A"}
\`\`\`

## 6. Complexity Analysis
- **Time Complexity:** ${analysis.timeComplexity}
- **Space Complexity:** ${analysis.spaceComplexity}
- **AI Confidence:** ${analysis.confidenceScore}
`;
            const blob = new Blob([markdown], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `khudsekrle_shared_${analysis.language}_${id?.substring(0, 8)}.md`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Markdown report downloaded");
        } catch (err) {
            toast.error("Failed to generate report");
        }
    };

    const CopyButton = ({ text, tooltip }) => {
        const [isCopied, setIsCopied] = useState(false);
        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            toast.success(`${tooltip} copied!`);
            setTimeout(() => setIsCopied(false), 2000);
        };
        return (
            <button 
                onClick={handleCopy}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all active:scale-90"
                title={`Copy ${tooltip}`}
            >
                {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12 flex flex-col justify-center items-center h-[70vh] space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-mono text-sm tracking-widest">FETCHING PUBLIC DATA...</p>
                </div>
            </Layout>
        );
    }

    if (error || !analysis) {
        return (
            <Layout>
                <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12">
                    <div className="glass p-12 rounded-[2.5rem] text-center max-w-xl mx-auto border border-red-500/10 shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-400 mx-auto mb-6">
                            <AlertTriangle size={40} />
                        </div>
                        <h2 className="text-2xl text-white font-black mb-3">Analysis Unavailable</h2>
                        <p className="text-slate-400 mb-10 leading-relaxed font-medium">{error}</p>
                        <Link to="/" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-flex items-center gap-3 border border-slate-800">
                            <ArrowLeft size={20} />
                            Go to Home
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shadow-xl border border-blue-500/10">
                                <Code size={28} />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                Shared Analysis
                            </h1>
                        </div>
                        <p className="text-slate-400 flex items-center gap-3 font-medium ml-1">
                            <span className="font-mono bg-blue-500/10 px-3 py-1 rounded-lg text-xs text-blue-400 uppercase font-bold tracking-widest border border-blue-500/10">
                                {analysis.language}
                            </span>
                            <span className="text-slate-700">•</span>
                            <span className="text-sm">Shared via khudsekrle</span>
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
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: analysis.confidenceScore || '0%' }} />
                                </div>
                                <span className="text-blue-400 font-black text-xl leading-none">{analysis.confidenceScore}</span>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

                        <button 
                            onClick={handleDownloadMarkdown}
                            className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
                            title="Download Markdown"
                        >
                            <Download size={20} />
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-10 rounded-[2.5rem] border-l-4 border-l-purple-500 lg:col-span-2 relative overflow-hidden shadow-2xl"
                    >
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
                    className="glass p-10 rounded-[2.5rem] mb-12 border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <Sparkles className="text-blue-400" size={24} />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">AI Insights</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xl font-medium relative z-10">{analysis.explanation}</p>
                </motion.div>

                {/* Code Comparison Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="flex items-center justify-between mb-8 mt-12"
                >
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Terminal size={20} className="text-blue-400" />
                        Code Comparison
                    </h3>
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setViewMode("diff")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "diff" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Split size={14} />
                            Diff View
                        </button>
                        <button 
                            onClick={() => setViewMode("blocks")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "blocks" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LayoutList size={14} />
                            List View
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {viewMode === "diff" ? (
                        <motion.div 
                            key="diff"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl h-[500px] relative group mb-12"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-3xl rounded-full" />
                            <DiffEditor
                                height="100%"
                                language={analysis.language || "javascript"}
                                original={analysis.originalCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
                                modified={analysis.correctedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
                                theme="vs-dark"
                                options={{
                                    originalEditable: false,
                                    readOnly: true,
                                    renderSideBySide: true,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    padding: { top: 20, bottom: 20 },
                                    folding: true,
                                    scrollbar: {
                                        vertical: 'hidden',
                                        horizontal: 'hidden'
                                    }
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="blocks"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                        >
                            <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                                <div className="bg-slate-900 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                        <Code size={18} className="text-slate-500" />
                                        Original Code
                                    </h3>
                                </div>
                                <div className="p-8 bg-slate-950/80">
                                    <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 shadow-inner overflow-x-auto">
                                        <pre className="text-slate-400 font-mono text-sm leading-relaxed">
                                            <code>{analysis.originalCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            <div className="glass rounded-[2rem] overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 group">
                                <div className="bg-emerald-500/[0.03] px-8 py-5 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-emerald-400/80 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                        <CheckCircle size={18} className="text-emerald-500" />
                                        Recommended Resolution
                                    </h3>
                                    <CopyButton text={analysis.correctedCode} tooltip="Corrected Code" />
                                </div>
                                <div className="p-8 bg-emerald-500/[0.01]">
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border border-emerald-500/10 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                                        <pre className="text-emerald-400/90 font-mono text-sm leading-relaxed">
                                            <code>{analysis.correctedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {analysis.expectedOutput && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="mt-12 glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative group"
                    >
                        <div className="bg-slate-900/50 px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                                <Terminal size={20} className="text-blue-400" />
                                Expected Execution Output
                            </h3>
                            <CopyButton text={analysis.expectedOutput} tooltip="Expected Output" />
                        </div>
                        <div className="p-10 bg-slate-950/50">
                            <div className="bg-black/40 rounded-3xl p-8 border border-white/5 shadow-inner group-hover:border-blue-500/10 transition-all">
                                <pre className="text-blue-300/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                    <code>{analysis.expectedOutput?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}</code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* CTA for unauthenticated users */}
                <div className="mt-20 text-center p-12 glass rounded-[3rem] border border-blue-500/10">
                    <h3 className="text-2xl font-black text-white mb-4">Want to debug your own code?</h3>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto font-medium">Join thousands of developers using AI to write safer, faster, and cleaner code every day.</p>
                    <Link to="/auth/register" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all inline-block shadow-2xl shadow-blue-500/20">
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
