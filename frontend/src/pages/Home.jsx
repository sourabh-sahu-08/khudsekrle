import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle, Code2, Zap, ArrowRight, Code, Download, Terminal, Settings } from "lucide-react";
import { analysisService } from "@/utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";

export default function Home() {
  const [code, setCode] = useState("// Paste your code here to begin...");
  const [language, setLanguage] = useState("javascript");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    "Initializing AI models...",
    "Analyzing code structure...",
    "Scanning vulnerabilities...",
    "Optimizing logic...",
  ];

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isAnalyzing && code.trim()) handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyzing, code]);

  const handleAnalyze = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication Required", { description: "Please sign in to analyze code." });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisStep(0);
    
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const response = await analysisService.analyze({ code, language });
      setResult(response.data.data);
      toast.success("Audit complete!");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to analyze code.";
      setError(errorMsg);
      toast.error("Audit failed", { description: errorMsg });
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-[#0B0F1A] overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 border-r border-white/10 bg-[#0B0F1A]">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#111827]/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <Terminal size={14} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Workspace / Source</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all cursor-pointer hover:bg-white/10"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 rounded-t-2xl border-x border-t border-white/10 overflow-hidden bg-[#111827]/50 relative group"
            >
              <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none group-focus-within:bg-blue-500/[0.03] transition-colors" />
              <CodeEditor 
                value={code} 
                onChange={setCode} 
                language={language}
              />
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className={`w-full group h-14 flex items-center justify-center gap-3 rounded-b-2xl transition-all duration-500 relative overflow-hidden active:scale-[0.99] ${
                isAnalyzing || !code.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{steps[analysisStep]}</span>
                </div>
              ) : (
                <>
                  <Zap size={16} className="group-hover:scale-110 transition-transform" fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Initiate Deep Audit</span>
                </>
              )}
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600"
            >
               <span className="flex items-center gap-2">
                 <kbd className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400">CTRL</kbd>
                 <span className="opacity-40">+</span>
                 <kbd className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-slate-400">ENTER</kbd>
               </span>
            </motion.div>
          </div>
        </main>

        <aside className="w-[400px] flex flex-col bg-[#0B0F1A] border-l border-white/10">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#111827]/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <Sparkles size={14} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono tracking-premium">Output_Console</h2>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 card-premium flex flex-col overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-24 h-24 mb-8 relative">
                       <div className="absolute inset-0 bg-blue-500/30 blur-[60px] animate-pulse rounded-full" />
                       <div className="w-full h-full rounded-[2rem] border border-blue-500/30 flex items-center justify-center text-blue-500 bg-[#111827] relative z-10 shadow-2xl overflow-hidden">
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"
                          />
                          <Zap size={40} className="relative z-20" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] animate-shimmer bg-clip-text text-transparent">Neural Process Active</h3>
                       <div className="flex items-center justify-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[220px] mx-auto leading-loose">
                         Cross-referencing syntax patterns with established security heuristics.
                       </p>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <AnalysisResults data={result} />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                      <AlertCircle size={28} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Analysis Interrupted</h3>
                    <p className="text-[11px] text-slate-500 font-medium mb-6 leading-relaxed">{error}</p>
                    <button onClick={handleAnalyze} className="text-[10px] font-black uppercase text-blue-400 hover:text-white transition-colors border-b border-blue-400/30 pb-0.5">Restart Process</button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center text-slate-700 mb-8 border border-white/5 shadow-inner">
                      <Code size={36} />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">System Idle</h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Deploy your code to the editor and initiate an audit to receive AI-powered feedback.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
