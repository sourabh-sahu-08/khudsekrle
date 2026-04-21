import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle, Code2, Zap } from "lucide-react";
import { analysisService } from "@/utils/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";

export default function Home() {
  const [code, setCode] = useState("// Paste your code here to begin...");
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
  ];

  const handleAnalyze = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      const authError = "Authentication Required: You must be logged in to analyze code.";
      setError(authError);
      toast.error(authError, {
        description: "Please sign in to your account to continue.",
        action: {
          label: "Sign In",
          onClick: () => navigate('/auth/login')
        }
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
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
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `AI Code Debugger Analysis Report\nGenerated on: ${new Date().toLocaleString()}\nLanguage: ${language}\n\n---------------------------------\nIDENTIFIED FINDINGS:\n${result.findings}\n\nEXPLANATION:\n${result.explanation}\n\nCORRECTED CODE:\n${result.correctedCode}\n\nOPTIMIZED CODE:\n${result.optimizedCode}\n\nCOMPLEXITY:\nTime: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n---------------------------------`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `debug_analysis_${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded", {
        description: "Your code analysis report is ready."
    });
  };

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12">
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
              <div className="rounded-2xl overflow-hidden border border-slate-800/50 shadow-inner">
                <CodeEditor
                   code={code}
                   onChange={(val) => setCode(val || "")}
                   language={language}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm overflow-hidden"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-[3] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95 group"
                >
                  {isAnalyzing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {isAnalyzing ? "Analyzing Environment..." : "Analyze Code"}
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={!result}
                  title="Download Report"
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white px-6 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <Save size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Results */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Zap className="text-emerald-500" size={20} />
              <h2 className="text-xl font-bold text-white tracking-tight">Analysis Result</h2>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <AnalysisResults data={result} />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-3xl h-[calc(100vh-16rem)] min-h-[550px] flex flex-col items-center justify-center p-12 text-center space-y-6 relative overflow-hidden"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                    <div className="w-20 h-20 bg-slate-900/80 rounded-3xl flex items-center justify-center text-slate-500 relative z-10 border border-slate-800 shadow-2xl">
                      <Sparkles size={40} className="animate-bounce" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-100 italic">Ready for Debugging</h3>
                    <p className="text-slate-400 max-w-[320px] text-lg leading-relaxed">Paste your code and let AI reveal potential bugs and optimizations.</p>
                  </div>
                  
                  {/* Decorative lines */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-amber-400" size={32} />}
            title="Instant Analysis"
            description="Our advanced LLM models identify bugs and vulnerabilities in milliseconds, providing real-time feedback."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Sparkles className="text-blue-400" size={32} />}
            title="Smart Correction"
            description="Don't just find bugs—fix them. Get production-ready code replacements that follow industry best practices."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Code2 className="text-emerald-400" size={32} />}
            title="Optimization"
            description="Go beyond basic fixes. AI analyzes time and space complexity to recommend more efficient algorithms."
            delay={0.3}
          />
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">How it Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Three simple steps to cleaner, more efficient code.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none" />
            
            <ProcessStep 
              number="01"
              title="Input Code"
              description="Paste your snippet into our advanced code editor and select your language."
            />
            <ProcessStep 
              number="02"
              title="AI Processing"
              description="Our specialized models perform a deep audit of logic, security, and performance."
            />
            <ProcessStep 
              number="03"
              title="Apply Fixes"
              description="Review identified vulnerabilities and apply the recommended corrections instantly."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-blue-500/20 transition-all shadow-xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-500/10 transition-colors" />
      <div className="mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}

function ProcessStep({ number, title, description }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative z-10 text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center mx-auto shadow-2xl relative group overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 tracking-tighter relative z-10">
          {number}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">{description}</p>
      </div>
    </motion.div>
  );
}
