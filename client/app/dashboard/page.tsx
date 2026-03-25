"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { analysisService } from "@/utils/api";
import { History, Code, Calendar, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id: string) => {
        try {
            await analysisService.deleteAnalysis(id);
            setHistory(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error("Failed to delete analysis", err);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await analysisService.getHistory();
                setHistory(response.data.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <main className="min-h-screen bg-[#0f172a]">
            <Navbar />

            <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Your Analyses</h1>
                        <p className="text-slate-400">Manage and view your previous code debugging sessions</p>
                    </div>
                    <Link
                        href="/"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                    >
                        New Analysis
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass h-48 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item) => (
                            <div key={item._id} className="glass p-6 rounded-2xl hover:border-slate-600 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Code size={18} />
                                        <span className="font-mono text-sm uppercase">{item.language}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-200 mb-2 line-clamp-1">
                                    {item.originalCode.substring(0, 50)}...
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                                    <span className="flex items-center gap-1">
                                        <span className="text-blue-400 italic">O</span>({item.timeComplexity.split('(')[1]?.split(')')[0] || "n"})
                                    </span>
                                    <span>|</span>
                                    <span>{item.confidenceScore} match</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/analysis/${item._id}`} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={16} />
                                        View Details
                                    </Link>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass rounded-3xl p-12 text-center h-[400px] flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 mb-4">
                            <History size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">No history yet</h3>
                        <p className="text-slate-400 max-w-sm mb-8">Start your first analysis to see it tracked here in your dashboard.</p>
                        <Link
                            href="/"
                            className="text-blue-400 hover:underline flex items-center gap-2"
                        >
                            Analyze your first piece of code <Code size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
