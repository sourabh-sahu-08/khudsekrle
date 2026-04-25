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

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-24 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} />
            The Future of Debugging
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
            Write code that is <br />
            <span className="relative inline-block h-[1.2em] min-w-[300px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={taglineIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent italic absolute left-1/2 -translate-x-1/2"
                >
                  {taglines[taglineIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-xl font-medium leading-relaxed">
            khudsekrle is your AI-powered companion for technical audits, security scanning, and algorithm optimization.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left Panel: Editor */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Code2 className="text-blue-500" size={20} />
                  <h2 className="text-xl font-bold text-white tracking-tight">Source Code</h2>
                </motion.div>
                <p className="text-sm text-slate-400">Select language and paste your code below</p>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer hover:bg-slate-800"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-3xl p-6 shadow-2xl shadow-blue-500/5"
            >
              <CodeEditor value={code} onChange={handleCodeChange} language={language} />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim()}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-95 shadow-xl ${
                    isAnalyzing 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={18} fill="currentColor" />
                      Start Analysis
                    </>
                  )}
                </button>
                {result && (
                  <button
                    onClick={handleDownload}
                    className="p-4 rounded-2xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all hover:bg-slate-800"
                    title="Download Report"
                  >
                    <Save size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Results */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="glass h-full rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-500/[0.02] blur-3xl rounded-full" />
                  
                  {/* Step Indicators */}
                  <div className="relative z-10 w-full max-w-sm">
                    <div className="flex justify-between mb-8">
                      {steps.map((_, idx) => (
                        <motion.div
                          key={idx}
                          initial={false}
                          animate={{ 
                            scale: idx === analysisStep ? 1.2 : 1,
                            backgroundColor: idx <= analysisStep ? '#3b82f6' : '#1e293b'
                          }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                      ))}
                    </div>

                    <div className="relative h-24 flex flex-col items-center justify-center">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={analysisStep}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="text-2xl font-black text-white absolute"
                        >
                          {steps[analysisStep]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    
                    <p className="mt-8 text-slate-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                      Processing with Llama 3.3 70B
                    </p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AnalysisResults data={result} />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass h-[600px] rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border-red-500/20"
                >
                  <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 shadow-2xl shadow-red-500/5">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Analysis Failed</h3>
                  <p className="text-slate-400 max-w-sm mb-8 leading-relaxed font-medium">{error}</p>
                  <button 
                    onClick={handleAnalyze}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-slate-800"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass h-[600px] rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8 relative">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                    <Sparkles size={32} className="relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Ready to Audit</h3>
                  <p className="text-slate-400 max-w-xs leading-relaxed font-medium">
                    Upload or paste your code snippet to get detailed security findings and optimizations.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
