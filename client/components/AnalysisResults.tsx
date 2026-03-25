"use client";

import { Check, Copy, AlertCircle, Zap, Clock, Maximize2 } from "lucide-react";
import { useState } from "react";

interface AnalysisData {
    errors: string;
    explanation: string;
    correctedCode: string;
    optimizedCode: string;
    timeComplexity: string;
    spaceComplexity: string;
    confidenceScore: string;
}

interface ResultsProps {
    data: AnalysisData | null;
}

export default function AnalysisResults({ data }: ResultsProps) {
    const [copied, setCopied] = useState<string | null>(null);

    if (!data) return null;

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Time Complexity</p>
                        <p className="font-mono font-bold">{data.timeComplexity}</p>
                    </div>
                </div>
                <div className="glass p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Maximize2 size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Space Complexity</p>
                        <p className="font-mono font-bold">{data.spaceComplexity}</p>
                    </div>
                </div>
                <div className="glass p-4 rounded-2xl flex items-center gap-3 col-span-2 md:col-span-1">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Zap size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">AI Confidence</p>
                        <p className="font-bold">{data.confidenceScore}</p>
                    </div>
                </div>
            </div>

            {/* Errors Section */}
            <section className="glass p-6 rounded-2xl border-l-4 border-l-red-500">
                <div className="flex items-center gap-2 mb-4 text-red-400">
                    <AlertCircle size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Detected Errors</h3>
                </div>
                <pre className="text-slate-300 font-sans whitespace-pre-wrap">{data.errors}</pre>
            </section>

            {/* Explanation Section */}
            <section className="glass p-6 rounded-2xl">
                <h3 className="font-bold text-slate-200 mb-2">Explanation</h3>
                <p className="text-slate-400 leading-relaxed">{data.explanation}</p>
            </section>

            {/* Code Blocks */}
            <div className="space-y-6">
                <CodeBlock
                    title="Suggested Fix"
                    code={data.correctedCode}
                    onCopy={() => copyToClipboard(data.correctedCode, 'fix')}
                    isCopied={copied === 'fix'}
                />
                <CodeBlock
                    title="Optimized Version"
                    code={data.optimizedCode}
                    onCopy={() => copyToClipboard(data.optimizedCode, 'opt')}
                    isCopied={copied === 'opt'}
                    variant="emerald"
                />
            </div>
        </div>
    );
}

function CodeBlock({ title, code, onCopy, isCopied, variant = "blue" }: any) {
    const colors: any = {
        blue: "border-l-blue-500 text-blue-400",
        emerald: "border-l-emerald-500 text-emerald-400"
    };

    return (
        <div className={`glass rounded-2xl overflow-hidden border-l-4 ${colors[variant]}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="font-bold uppercase tracking-wider text-sm">{title}</h3>
                <button
                    onClick={onCopy}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                    {isCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
            </div>
            <div className="p-6 bg-slate-900/50">
                <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
