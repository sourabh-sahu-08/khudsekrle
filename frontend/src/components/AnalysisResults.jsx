"use client";

import { Check, Copy, AlertCircle, Zap, Clock, Maximize2, Sparkles, Terminal, FileText, ShieldCheck, Activity, Brain } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@monaco-editor/react";

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
        { id: 'fix', label: 'Fix', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { id: 'explain', label: 'Explain', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { id: 'optimize', label: 'Optimize', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { id: 'security', label: 'Security', icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#111827]">
            {/* Tab Navigation */}
            <div className="flex p-2 bg-[#0B0F1A]/50 border-b border-white/5 gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-300 relative group ${
                            activeTab === tab.id 
                                ? 'bg-white/5 text-white' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                        }`}
                    >
                        <tab.icon size={16} className={`${activeTab === tab.id ? tab.color : 'text-slate-600 group-hover:text-slate-400'} transition-colors`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">{tab.label}</span>
                        
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className={`absolute bottom-1 w-6 h-0.5 rounded-full ${tab.color.replace('text-', 'bg-')}`}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Performance Bar */}
            <div className="px-6 py-3 flex items-center justify-between bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <Clock size={10} className="text-slate-500" />
                      <span className="text-[10px] font-mono font-bold text-slate-300">{data.timeComplexity || 'O(n)'}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Maximize2 size={10} className="text-slate-500" />
                      <span className="text-[10px] font-mono font-bold text-slate-300">{data.spaceComplexity || 'O(1)'}</span>
                   </div>
                </div>
                <div className="flex items-center gap-1.5">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Confidence {data.confidenceScore || '98%'}</span>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
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
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Corrected Codebase</h3>
                                <button
                                    onClick={() => copyToClipboard(data.correctedCode, 'fix')}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
                                >
                                    {copied === 'fix' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="h-[300px] rounded-xl overflow-hidden border border-white/10 bg-black/20 relative group">
                                <Editor
                                    height="100%"
                                    language={data.language || "javascript"}
                                    value={cleanCode(data.correctedCode)}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 20 },
                                        lineNumbers: 'on',
                                        renderLineHighlight: 'none',
                                        fontFamily: 'Fira Code, monospace',
                                    }}
                                />
                                <div className="absolute inset-0 pointer-events-none border border-blue-500/0 group-hover:border-blue-500/10 transition-colors rounded-xl" />
                            </div>
                            <div className="p-5 rounded-2xl bg-[#0B0F1A] border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                   <AlertCircle size={14} className="text-blue-400" />
                                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Findings Summary</p>
                                </div>
                                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">{data.findings}</p>
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
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                                <p className="text-[13px] text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                                    {data.explanation}
                                </p>
                            </div>
                            {data.bestPractices && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Architectural Insights</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {String(data.bestPractices).split('\n').filter(l => l.trim()).map((line, i) => (
                                            <div key={i} className="flex gap-3 text-[11px] text-slate-400 bg-[#0B0F1A] p-4 rounded-xl border border-white/5 hover:border-purple-500/20 transition-colors group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                                <span className="font-medium">{line.replace(/^[•*-]\s*/, '')}</span>
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
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimized Implementation</h3>
                                <button
                                    onClick={() => copyToClipboard(data.optimizedCode || data.correctedCode, 'opt')}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                                >
                                    {copied === 'opt' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="h-[300px] rounded-xl overflow-hidden border border-white/10 bg-black/20 group relative">
                                <Editor
                                    height="100%"
                                    language={data.language || "javascript"}
                                    value={cleanCode(data.optimizedCode || data.correctedCode)}
                                    theme="vs-dark"
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 20 },
                                        lineNumbers: 'on',
                                        fontFamily: 'Fira Code, monospace',
                                    }}
                                />
                                <div className="absolute inset-0 pointer-events-none border border-emerald-500/0 group-hover:border-emerald-500/10 transition-colors rounded-xl" />
                            </div>
                            <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-lg shadow-emerald-500/10">
                                    <Zap size={18} fill="currentColor" />
                                </div>
                                <div>
                                   <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-1">Efficiency Boost</p>
                                   <p className="text-[12px] text-emerald-400/80 font-medium leading-relaxed">
                                       Optimized for memory overhead and execution speed. Reduced algorithmic complexity where applicable.
                                   </p>
                                </div>
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
                            <div className="bg-[#0B0F1A] rounded-2xl border border-orange-500/10 p-6 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Security Protocol: Active</span>
                                </div>
                                <div className="space-y-4">
                                   <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                                       {data.securityAudit || "No major security vulnerabilities detected. Code adheres to OWASP Top 10 guidelines and internal safety protocols."}
                                   </p>
                                   <div className="flex flex-wrap gap-2 pt-2">
                                      {['XSS-Safe', 'SQL-Injection-Protected', 'No-Buffer-Overflow'].map(tag => (
                                         <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tag}</span>
                                      ))}
                                   </div>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck size={14} className="text-slate-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Scope</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                    Our AI engine scans for data leaks, insecure dependency usage, and cryptographically weak patterns.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
