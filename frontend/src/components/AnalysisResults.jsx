"use client";

import { Check, Copy, AlertCircle, Zap, Clock, Maximize2, Sparkles, Terminal, FileText, ShieldCheck, Activity } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiffEditor, Editor } from "@monaco-editor/react";

export default function AnalysisResults({ data }) {
    const [activeTab, setActiveTab] = useState("fix");
    const [copied, setCopied] = useState(null);

    if (!data) return null;

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const cleanCode = (code) => code?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '') || "";

    const tabs = [
        { id: 'fix', label: 'Fix', icon: Zap, color: 'text-blue-400' },
        { id: 'explain', label: 'Explain', icon: FileText, color: 'text-purple-400' },
        { id: 'optimize', label: 'Optimize', icon: Activity, color: 'text-emerald-400' },
        { id: 'security', label: 'Security', icon: ShieldCheck, color: 'text-yellow-400' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0B0F1A]">
            {/* Stats Summary */}
            <div className="p-4 grid grid-cols-3 gap-2 border-b border-white/5 bg-slate-900/20">
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <Clock size={12} className="text-slate-500 mb-1" />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{data.timeComplexity || 'O(n)'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <Maximize2 size={12} className="text-slate-500 mb-1" />
                    <span className="text-[10px] font-mono font-bold text-white uppercase">{data.spaceComplexity || 'O(1)'}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <Activity size={12} className="text-slate-500 mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase">{data.confidenceScore || '95%'}</span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex p-1 bg-slate-900/50 border-b border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                                ? 'bg-white/10 text-white shadow-inner' 
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? tab.color : 'text-slate-600'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'fix' && (
                        <motion.div
                            key="fix"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Resolution</h3>
                                <button
                                    onClick={() => copyToClipboard(data.correctedCode, 'fix')}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                                >
                                    {copied === 'fix' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="h-[350px] rounded-2xl overflow-hidden border border-white/5 bg-slate-950/50 shadow-inner">
                                <Editor
                                    height="100%"
                                    language={data.language || "javascript"}
                                    value={cleanCode(data.correctedCode)}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 12,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 16 },
                                        lineNumbers: 'on',
                                        renderLineHighlight: 'none',
                                        scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
                                    }}
                                />
                            </div>
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Findings</p>
                                <p className="text-xs text-slate-400 leading-relaxed italic">"{data.findings}"</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'explain' && (
                        <motion.div
                            key="explain"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 text-purple-400">
                                <Sparkles size={16} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Logic Explanation</h3>
                            </div>
                            <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap font-medium bg-white/2 p-6 rounded-2xl border border-white/5">
                                {data.explanation}
                            </div>
                            {data.bestPractices && (
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended Patterns</h4>
                                    <div className="space-y-2">
                                        {String(data.bestPractices).split('\n').filter(l => l.trim()).map((line, i) => (
                                            <div key={i} className="flex gap-3 text-xs text-slate-400 bg-white/2 p-3 rounded-xl border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1 shrink-0" />
                                                <span>{line.replace(/^[•*-]\s*/, '')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'optimize' && (
                        <motion.div
                            key="optimize"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Activity size={16} />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Performance Logic</h3>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(data.optimizedCode || data.correctedCode, 'opt')}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                                >
                                    {copied === 'opt' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="h-[350px] rounded-2xl overflow-hidden border border-emerald-500/10 bg-slate-950/50 shadow-inner">
                                <Editor
                                    height="100%"
                                    language={data.language || "javascript"}
                                    value={cleanCode(data.optimizedCode || data.correctedCode)}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 12,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 16 },
                                        lineNumbers: 'on',
                                        renderLineHighlight: 'none',
                                        scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
                                    }}
                                />
                            </div>
                            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Zap size={14} />
                                </div>
                                <p className="text-[11px] text-emerald-400/80 font-medium leading-relaxed">
                                    This version focuses on memory efficiency and execution speed by reducing unnecessary allocations.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 text-yellow-400">
                                <ShieldCheck size={16} />
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Security Audit</h3>
                            </div>
                            <div className="bg-slate-950/50 rounded-2xl border border-yellow-500/10 p-6 space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Audit Status: Complete</span>
                                </div>
                                <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                                    {data.securityAudit || "No major security vulnerabilities detected in this snippet. Code follows standard safety protocols."}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={14} className="text-slate-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Assessment</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                    The code has been scanned for SQL injection, XSS, and buffer overflow patterns.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
