import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle, Code2, Zap, ArrowRight, Code, Download, Terminal, Settings, Layers, Cpu, ShieldAlert } from "lucide-react";
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
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#060910] overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 border-r border-white/5 bg-[#060910]">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#0d121f]/50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg">
                <Terminal size={16} />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Editor</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Layers size={14} className="text-slate-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none text-slate-300 text-xs font-bold uppercase outline-none cursor-pointer hover:text-white transition-colors"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value} className="bg-slate-900">{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 rounded-2xl border border-white/5 overflow-hidden bg-[#0d121f]/30 relative group shadow-2xl"
            >
              <CodeEditor 
                value={code} 
                onChange={setCode} 
                language={language}
              />
            </motion.div>
            
            <div className="mt-6 flex gap-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                className={`flex-1 group h-14 flex items-center justify-center gap-3 rounded-2xl transition-all duration-500 relative overflow-hidden shadow-2xl active:scale-[0.98] ${
                  isAnalyzing || !code.trim()
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'
                }`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isAnalyzing ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">{steps[analysisStep]}</span>
                  </div>
                ) : (
                  <>
                    <Cpu size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Analyze Code</span>
                  </>
                )}
              </motion.button>
              
              <div className="flex items-center justify-center px-6 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-widest text-slate-500">
                 <kbd className="bg-white/10 px-2 py-1 rounded-md text-white mr-2">CTRL</kbd>
                 <span className="opacity-30">+</span>
                 <kbd className="bg-white/10 px-2 py-1 rounded-md text-white ml-2">ENTER</kbd>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-full lg:w-[450px] flex flex-col bg-[#060910] border-t lg:border-t-0 lg:border-l border-white/5 shadow-2xl">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#0d121f]/50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg">
                <Sparkles size={16} />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Results</h2>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative group shadow-3xl border border-white/5"
            >
              <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-24 h-24 mb-10 relative">
                       <div className="absolute inset-0 bg-blue-500/20 blur-[60px] animate-pulse rounded-full" />
                       <div className="w-full h-full rounded-3xl border border-blue-500/20 flex items-center justify-center text-blue-500 bg-[#0d121f] relative z-10 shadow-3xl overflow-hidden">
                          <motion.div 
                            animate={{ 
                              y: [-100, 100],
                              opacity: [0, 0.5, 0]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-transparent w-full h-1/2"
                          />
                          <Cpu size={48} className="relative z-20 animate-float" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-sm font-bold text-white uppercase tracking-widest animate-shimmer bg-clip-text text-transparent">Analyzing your code</h3>
                       <div className="flex items-center justify-center gap-3">
                          {[0, 1, 2].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            />
                          ))}
                       </div>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-loose opacity-70">
                         We're checking your code for errors, security risks, and optimization opportunities.
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
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-red-500/5 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/10 shadow-2xl">
                      <ShieldAlert size={36} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Analysis Failed</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-8">{error}</p>
                    <button onClick={handleAnalyze} className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors border-b border-blue-400/20 pb-1">Try Again</button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-16 text-center"
                  >
                    <div className="w-24 h-24 bg-slate-900/40 rounded-[2rem] flex items-center justify-center text-slate-700 mb-10 border border-white/5 shadow-inner">
                      <Code2 size={48} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Ready to analyze</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose opacity-50">
                      Paste your code into the editor and click analyze to get started.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
