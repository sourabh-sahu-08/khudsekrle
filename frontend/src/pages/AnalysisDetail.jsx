import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Code, Clock, Zap, AlertTriangle, CheckCircle, Database, Sparkles, Download, Share2, Check, FileJson, Copy, Terminal, MessageSquare, Send, Trash2, Edit2, Globe, Lock, Split, LayoutList } from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AnalysisDetail() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [viewMode, setViewMode] = useState("diff"); // "diff" or "blocks"

    useEffect(() => {
        const handleScroll = () => {
            const totalWidth = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            setScrollProgress((currentScroll / totalWidth) * 100);
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
        toast.success("Public link copied!", {
            description: "You can now share this analysis with anyone."
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTogglePublic = async () => {
        try {
            const response = await analysisService.togglePublic(id);
            setAnalysis(response.data.data);
            toast.success(response.data.data.isPublic ? "Analysis is now public" : "Analysis is now private");
        } catch (err) {
            toast.error("Failed to update visibility");
        }
    };

    const handleDownloadMarkdown = () => {
        if (!analysis) return;
        try {
            const markdown = `
# khudsekrle Analysis Report: ${analysis.language.toUpperCase()}
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
            a.download = `khudsekrle_analysis_${analysis.language}_${id?.substring(0, 8)}.md`;
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
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
                <motion.div 
                    className="h-full bg-blue-500 origin-left"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

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

                        <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleTogglePublic}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 border ${analysis.isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/5'}`}
                                title={analysis.isPublic ? "Make Private" : "Make Public"}
                            >
                                {analysis.isPublic ? <Globe size={20} /> : <Lock size={20} />}
                            </button>
                            <button 
                                onClick={handleDownloadMarkdown}
                                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
                                title="Download Markdown"
                            >
                                <Download size={20} />
                            </button>
                            <button 
                                onClick={handleShare}
                                disabled={!analysis.isPublic}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-white/5 relative ${!analysis.isPublic ? 'opacity-30 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'}`}
                                title={analysis.isPublic ? "Copy Public Link" : "Make public to share link"}
                            >
                                {copied ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                            </button>
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
                                original={analysis.originalCode}
                                modified={analysis.correctedCode}
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
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12"
                        >
                            <div className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
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
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border border-emerald-500/10 shadow-inner overflow-x-auto group-hover:border-emerald-500/30 transition-colors">
                                        <pre className="text-emerald-400/90 font-mono text-sm leading-relaxed">
                                            <code>{analysis.correctedCode}</code>
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
                                    <code>{analysis.expectedOutput}</code>
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                )}
                
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
                            <CopyButton text={analysis.optimizedCode} tooltip="Optimized Code" />
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

                {/* AI Chat Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 glass rounded-[3rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/[0.02] blur-3xl rounded-full -translate-x-32 -translate-y-32" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Ask AI Assistant</h3>
                                <p className="text-sm text-slate-500 font-medium">Get deeper insights or clarifications about this analysis</p>
                            </div>
                        </div>
                    </div>

                    <ChatInterface analysisId={id} />
                </motion.div>

                {/* Comments Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 glass rounded-[3rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Developer Notes</h3>
                            <p className="text-sm text-slate-500 font-medium">Add your own notes or comments to this analysis</p>
                        </div>
                    </div>

                    <CommentsSection analysisId={id} initialComments={analysis.comments || []} />
                </motion.div>
            </div>
        </Layout>
    );
}

function CommentsSection({ analysisId, initialComments }) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await analysisService.addComment(analysisId, newComment.trim());
            setComments(response.data.data);
            setNewComment("");
            toast.success("Note added!");
        } catch (err) {
            toast.error("Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            const response = await analysisService.deleteComment(analysisId, commentId);
            setComments(response.data.data);
            toast.success("Note deleted");
        } catch (err) {
            toast.error("Failed to delete note");
        }
    };

    const handleEditStart = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.text);
    };

    const handleEditSave = async (commentId) => {
        if (!editText.trim()) return;
        try {
            const response = await analysisService.editComment(analysisId, commentId, editText.trim());
            setComments(response.data.data);
            setEditingId(null);
            toast.success("Note updated");
        } catch (err) {
            toast.error("Failed to update note");
        }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="flex gap-4">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a note to yourself..."
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600"
                />
                <button 
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                    {isSubmitting ? "Adding..." : <Send size={18} />}
                </button>
            </form>

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="bg-white/[0.01] border border-dashed border-white/5 rounded-3xl p-10 text-center">
                        <p className="text-slate-500 text-sm font-medium italic">No notes yet. Add one above!</p>
                    </div>
                ) : (
                    comments.map((comment, i) => (
                        <motion.div 
                            key={comment._id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.08] transition-all group/comment"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{comment.userName}</span>
                                    <span className="text-[10px] font-bold text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEditStart(comment)}
                                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                        title="Edit Note"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(comment._id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete Note"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            {editingId === comment._id ? (
                                <div className="space-y-3">
                                    <textarea 
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all min-h-[80px]"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEditSave(comment._id)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={() => setEditingId(null)}
                                            className="text-slate-400 hover:text-white text-xs font-bold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-300 text-sm leading-relaxed">{comment.text}</p>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

function ChatInterface({ analysisId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useState(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsSending(true);

        try {
            const response = await analysisService.chat(analysisId, userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response.data.data }]);
        } catch (err) {
            toast.error("Failed to get AI response");
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-950/50 rounded-3xl p-6 min-h-[200px] max-h-[400px] overflow-y-auto border border-white/5 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 py-10">
                        <Sparkles size={32} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">No messages yet. Ask about the time complexity or security risks!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                            }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))
                )}
                {isSending && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="relative group">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-600"
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale"
                >
                    <ArrowLeft size={18} className="rotate-180" />
                </button>
            </form>
        </div>
    );
}
