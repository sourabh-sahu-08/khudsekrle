"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { analysisService } from "@/utils/api";
import { ArrowLeft, Code, Clock, Zap, AlertTriangle, CheckCircle, Database } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AnalysisDetails() {
    const params = useParams();
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const id = Array.isArray(params.id) ? params.id[0] : params.id;
                const response = await analysisService.getAnalysisById(id as string);
                setAnalysis(response.data.data);
            } catch (err: any) {
                console.error("Failed to fetch analysis", err);
                setError(err.response?.data?.message || "Something went wrong fetching the analysis.");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAnalysis();
        }
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0f172a]">
                <Navbar />
                <div className="max-w-6xl mx-auto pt-24 px-6 pb-12 flex justify-center items-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </main>
        );
    }

    if (error || !analysis) {
        return (
            <main className="min-h-screen bg-[#0f172a]">
                <Navbar />
                <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
                    <div className="glass p-8 rounded-2xl text-center max-w-xl mx-auto">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                        <h2 className="text-xl text-white font-semibold mb-2">Error Loading Analysis</h2>
                        <p className="text-slate-400 mb-6">{error}</p>
                        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all inline-flex items-center gap-2">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f172a]">
            <Navbar />
            <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
                <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors w-fit">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Code className="text-blue-400" size={32} />
                            Analysis Results
                        </h1>
                        <p className="text-slate-400 mt-2 flex items-center gap-2">
                            <span className="font-mono bg-slate-800 px-2 py-1 rounded text-sm text-blue-300 uppercase">{analysis.language}</span>
                            <span>•</span>
                            <span>{new Date(analysis.createdAt).toLocaleString()}</span>
                        </p>
                    </div>
                    <div className="glass px-6 py-3 rounded-xl border border-blue-500/30 flex items-center gap-3">
                        <span className="text-slate-300">Confidence</span>
                        <div className="h-2 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500" 
                                style={{ width: analysis.confidenceScore || '0%' }}
                            />
                        </div>
                        <span className="text-blue-400 font-bold">{analysis.confidenceScore}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="glass p-6 rounded-2xl border-l-4 border-l-purple-500 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="text-purple-400" size={20} />
                            <h3 className="text-lg font-semibold text-white">Issue Identified</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">{analysis.findings}</p>
                    </div>
                    <div className="glass p-6 rounded-2xl flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Time Complexity</p>
                                <p className="text-xl font-mono text-white">{analysis.timeComplexity}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                                <Database size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Space Complexity</p>
                                <p className="text-xl font-mono text-white">{analysis.spaceComplexity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl mb-8 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="text-yellow-400" size={24} />
                        <h3 className="text-xl font-semibold text-white flex-1">Explanation & Recommendation</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">{analysis.explanation}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass rounded-2xl overflow-hidden border border-slate-700/50">
                        <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <Code size={18} className="text-slate-400" />
                                Original Code
                            </h3>
                        </div>
                        <div className="p-4 bg-slate-900 overflow-x-auto">
                            <pre className="text-slate-300 font-mono text-sm leading-relaxed">
                                <code>{analysis.originalCode}</code>
                            </pre>
                        </div>
                    </div>

                    <div className="glass rounded-2xl overflow-hidden border border-green-500/30">
                        <div className="bg-green-500/10 px-4 py-3 border-b border-green-500/20 flex items-center justify-between">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-400" />
                                Corrected Code
                            </h3>
                        </div>
                        <div className="p-4 bg-slate-900 overflow-x-auto">
                            <pre className="text-green-400 font-mono text-sm leading-relaxed">
                                <code>{analysis.correctedCode}</code>
                            </pre>
                        </div>
                    </div>
                </div>
                
                {analysis.optimizedCode && analysis.optimizedCode !== analysis.correctedCode && analysis.optimizedCode !== "N/A" && (
                    <div className="mt-8 glass rounded-2xl overflow-hidden border border-blue-500/30">
                        <div className="bg-blue-500/10 px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <Zap size={18} className="text-blue-400" />
                                Highly Optimized Version
                            </h3>
                        </div>
                        <div className="p-4 bg-slate-900 overflow-x-auto">
                            <pre className="text-blue-300 font-mono text-sm leading-relaxed">
                                <code>{analysis.optimizedCode}</code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
