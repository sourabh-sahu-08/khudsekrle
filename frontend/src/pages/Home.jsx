import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle, Code2, Zap, ArrowRight } from "lucide-react";
import { analysisService } from "@/utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";

export default function Home() {
  const [code, setCode] = useState("// Paste your code here to begin...");
  const [language, setLanguage] = useState("javascript");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const taglines = ["Debug.", "Optimize.", "Secure.", "Perfect."];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isAnalyzing && code.trim()) {
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyzing, code]);

  const steps = [
    "Initializing AI models...",
    "Analyzing code structure...",
    "Checking for security vulnerabilities...",
    "Scanning for logic errors...",
    "Evaluating time & space complexity...",
    "Generating optimized solutions..."
  ];

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "C", value: "c" }
  ];

  const detectLanguage = (codeSnippet) => {
    const code = codeSnippet.toLowerCase();
    if (code.includes("import react") || code.includes("const ") || code.includes("let ") || code.includes("function ")) return "javascript";
    if (code.includes("def ") || code.includes("import ") || code.includes("print(")) return "python";
    if (code.includes("public class ") || code.includes("System.out.print")) return "java";
    if (code.includes("#include <iostream>") || code.includes("int main()")) return "cpp";
    if (code.includes("#include <stdio.h>")) return "c";
    return language;
  };

  const handleCodeChange = (val) => {
    setCode(val);
    if (val.trim() && val.length > 20) {
      const detected = detectLanguage(val);
      if (detected !== language) {
        setLanguage(detected);
      }
    }
  };

  const handleAnalyze = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const authError = "Authentication Required: You must be logged in to analyze code.";
      setError(authError);
      toast.error(authError, {
        description: "Please sign in to your account to continue.",
      });
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
      toast.success("Analysis complete!", {
        description: `Successfully analyzed ${language} code.`
      });
    } catch (err) {
      console.error("ANALYSIS ERROR:", err);
      const errorMsg = err.response?.data?.message || "Failed to analyze code. Please check your connection.";
      setError(errorMsg);
      toast.error("Analysis failed", { description: errorMsg });
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `khudsekrle Analysis Report\nGenerated on: ${new Date().toLocaleString()}\nLanguage: ${language}\n\n---------------------------------\nIDENTIFIED FINDINGS:\n${result.findings}\n\nEXPLANATION:\n${result.explanation}\n\nCORRECTED CODE:\n${result.correctedCode}\n\nOPTIMIZED CODE:\n${result.optimizedCode}\n\nCOMPLEXITY:\nTime: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n---------------------------------`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `khudsekrle_analysis_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded", {
        description: "Your code analysis report is ready."
    });
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-80px)] overflow-y-auto lg:overflow-hidden bg-[#0B0F1A]">
        {/* Left Sidebar is already in Layout.jsx (hidden on mobile) */}
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* Center Panel: Editor */}
          <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0B0F1A] min-w-0 min-h-[500px] lg:min-h-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B0F1A]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Code2 size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Main Editor</h2>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Source Code Input</p>
                </div>
              </div>
              
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/5 text-slate-300 text-[11px] font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all cursor-pointer hover:bg-white/10"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 relative bg-slate-950/20">
              <CodeEditor value={code} onChange={handleCodeChange} language={language} />
              
              {/* Floating Action Button */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-20">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim()}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl ${
                    isAnalyzing 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} fill="currentColor" />
                      Run Analysis
                    </>
                  )}
                </button>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] text-center mt-4 hidden sm:block">
                  Ctrl + Enter to Execute
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="w-full lg:w-[450px] flex flex-col bg-[#0B0F1A] lg:overflow-hidden border-t lg:border-t-0 border-white/5">
            <div className="px-6 py-4 border-b border-white/5 bg-[#0B0F1A]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">AI Output</h2>
              </div>
              {result && (
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/5"
                >
                  <Save size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mb-8 relative">
                      <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin relative z-10" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">{steps[analysisStep]}</h3>
                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest animate-pulse">Llama 3.3 70B</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-full"
                  >
                    <AnalysisResults data={result} />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6">
                      <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Analysis Failed</h3>
                    <p className="text-xs text-slate-500 mb-8 leading-relaxed">{error}</p>
                    <button 
                      onClick={handleAnalyze}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all border border-slate-800"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-slate-600 mb-6 border border-white/5">
                      <Code size={32} />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">Ready to Audit</h3>
                    <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed font-medium">
                      Input your code and run the analysis to see security findings and optimizations.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
