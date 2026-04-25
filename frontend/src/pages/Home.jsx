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
      {/* 3-Column Workspace Container */}
      <div className="flex h-[calc(100vh-64px)] bg-[#0B0F1A] overflow-hidden">
        
        {/* Left Sidebar is handled by Layout (260px) */}

        {/* Center Panel: Editor (Flex) */}
        <main className="flex-1 flex flex-col min-w-0 border-r border-white/10 bg-[#0B0F1A]">
          {/* Editor Header */}
          <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#111827]/30">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500">
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
              <button className="p-2 text-slate-500 hover:text-white transition-all">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex-1 rounded-t-xl border-x border-t border-white/10 overflow-hidden bg-[#111827]/50 relative">
              <CodeEditor 
                value={code} 
                onChange={setCode} 
                language={language}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20 }
                }}
              />
            </div>
            
            {/* Attached Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
              className={`w-full group h-14 flex items-center justify-center gap-3 rounded-b-xl transition-all duration-300 relative overflow-hidden active:scale-[0.99] ${
                isAnalyzing || !code.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{steps[analysisStep]}</span>
                </div>
              ) : (
                <>
                  <Zap size={16} className="group-hover:animate-pulse" fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Run Deep Analysis</span>
                </>
              )}
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
               <span className="flex items-center gap-1.5"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">CTRL</kbd> + <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10">ENTER</kbd> TO EXECUTE</span>
            </div>
          </div>
        </main>

        {/* Right Panel: Output (400px) */}
        <aside className="w-[400px] flex flex-col bg-[#0B0F1A] border-l border-white/10">
          <div className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#111827]/30">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sparkles size={14} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Intelligence / Findings</h2>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex-1 card-premium flex flex-col overflow-hidden relative">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 mb-8 relative">
                       <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full" />
                       <div className="w-full h-full rounded-2xl border-2 border-blue-500/20 flex items-center justify-center text-blue-500 relative z-10">
                          <Zap size={32} className="animate-bounce" />
                       </div>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-3">Auditing Pipeline</h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px]">
                      Our Llama 3.3 70B model is scanning your code for semantic errors.
                    </p>
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
