"use client";

import { Check, Copy, AlertCircle, Zap, Clock, Maximize2, Sparkles, Terminal, Split, LayoutList } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiffEditor } from "@monaco-editor/react";

export default function AnalysisResults({ data }) {
    const [copied, setCopied] = useState(null);
    const [viewMode, setViewMode] = useState("diff"); // "diff" or "blocks"

    if (!data) return null;

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const renderContent = (content) => {
        if (!content) return null;
        if (Array.isArray(content)) {
            return (
                <div className="space-y-1">
                    {content.map((item, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-slate-500">•</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return content;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4 glass-hover border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                        <Clock size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">Time</p>
                        <p className="font-mono font-bold text-slate-200">{data.timeComplexity}</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4 glass-hover border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-inner">
                        <Maximize2 size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">Space</p>
                        <p className="font-mono font-bold text-slate-200">{data.spaceComplexity}</p>
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass p-5 rounded-3xl flex items-center gap-4 glass-hover border border-white/5 col-span-2 md:col-span-1">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner">
                        <Zap size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">Confidence</p>
                        <p className="font-bold text-slate-200">{data.confidenceScore}</p>
                    </div>
                </motion.div>
            </div>

            {/* Main Analysis Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Findings Section */}
                <motion.section variants={item} className="glass p-8 rounded-3xl border-l-4 border-l-red-500/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                    <div className="flex items-center gap-2 mb-6 text-red-400 relative z-10">
                        <AlertCircle size={20} className="animate-pulse" />
                        <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Identified Vulnerabilities</h3>
                    </div>
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 relative z-10">
                        <div className="text-slate-300 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                            {renderContent(data.findings) || "No critical errors identified."}
                        </div>
                    </div>
                </motion.section>

                {/* Security Audit Section */}
                <motion.section variants={item} className="glass p-8 rounded-3xl border-l-4 border-l-yellow-500/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                    <div className="flex items-center gap-2 mb-6 text-yellow-400 relative z-10">
                        <Terminal size={20} />
                        <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Security Audit</h3>
                    </div>
                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 relative z-10">
                        <div className="text-slate-300 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                            {renderContent(data.securityAudit) || "Audit complete: No major security holes detected."}
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* AI Insights & Best Practices */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <motion.section variants={item} className="md:col-span-3 glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <Sparkles size={18} />
                        <h3 className="font-bold uppercase tracking-[0.2em] text-xs">AI Insights</h3>
                    </div>
                    <div className="text-slate-400 leading-relaxed text-[15px]">
                        {renderContent(data.explanation)}
                    </div>
                </motion.section>

                <motion.section variants={item} className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                    <div className="flex items-center gap-2 mb-4 text-emerald-400">
                        <Check size={18} />
                        <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Best Practices</h3>
                    </div>
                    <div className="text-slate-400 text-sm leading-relaxed space-y-2">
                        {data.bestPractices ? (
                            Array.isArray(data.bestPractices) ? (
                                data.bestPractices.map((line, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-emerald-500/50">•</span>
                                        <span>{line.replace(/^[•*-]\s*/, '')}</span>
                                    </div>
                                ))
                            ) : (
                                String(data.bestPractices).split('\n').map((line, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-emerald-500/50">•</span>
                                        <span>{line.replace(/^[•*-]\s*/, '')}</span>
                                    </div>
                                ))
                            )
                        ) : (
                            <p>Following industry standard practices.</p>
                        )}
                    </div>
                </motion.section>
            </div>

            {/* View Mode Toggle */}
            <motion.div variants={item} className="flex items-center justify-between">
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

            {/* Code Blocks / Diff Editor */}
            <div className="space-y-8">
                <AnimatePresence mode="wait">
                    {viewMode === "diff" ? (
                        <motion.div 
                            key="diff"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl h-[500px] relative group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-3xl rounded-full" />
                            <DiffEditor
                                height="100%"
                                language={data.language || "javascript"}
                                original={data.originalCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
                                modified={data.correctedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
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
                            className="space-y-8"
                        >
                            <CodeBlock
                                title="Suggested Resolution"
                                code={data.correctedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
                                onCopy={() => copyToClipboard(data.correctedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, ''), 'fix')}
                                isCopied={copied === 'fix'}
                                icon={<Terminal size={18} />}
                            />
                            {data.optimizedCode && data.optimizedCode !== data.correctedCode && (
                                <CodeBlock
                                    title="Performance Optimized"
                                    code={data.optimizedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '')}
                                    onCopy={() => copyToClipboard(data.optimizedCode?.replace(/^```[\w]*\n/, '').replace(/\n```$/, ''), 'opt')}
                                    isCopied={copied === 'opt'}
                                    variant="emerald"
                                    icon={<Zap size={18} />}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function CodeBlock({ title, code, onCopy, isCopied, variant = "blue", icon }) {
    const themes = {
        blue: {
            border: "border-l-blue-500/50",
            text: "text-blue-400",
            bg: "bg-blue-500/5",
            glow: "shadow-blue-500/5"
        },
        emerald: {
            border: "border-l-emerald-500/50",
            text: "text-emerald-400",
            bg: "bg-emerald-500/5",
            glow: "shadow-emerald-500/5"
        }
    };

    const theme = themes[variant];

    return (
        <div className={`glass rounded-3xl overflow-hidden border-l-4 ${theme.border} ${theme.glow} shadow-2xl`}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/2">
                <div className={`flex items-center gap-3 ${theme.text}`}>
                    {icon}
                    <h3 className="font-bold uppercase tracking-[0.2em] text-xs leading-none">{title}</h3>
                </div>
                <button
                    onClick={onCopy}
                    className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-white/10 active:scale-90"
                >
                    {isCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
            </div>
            <div className={`p-8 ${theme.bg}`}>
                <div className="bg-slate-950/80 rounded-2xl p-6 border border-white/5 shadow-inner">
                    <pre className="font-mono text-[13px] text-slate-300 overflow-x-auto leading-relaxed custom-scrollbar">
                        <code>{code}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
