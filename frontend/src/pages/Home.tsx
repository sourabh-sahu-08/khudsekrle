import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle, Code2, Zap } from "lucide-react";
import { analysisService } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";

export default function Home() {
  const [code, setCode] = useState("// Paste your code here to begin...");
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await analysisService.analyze({ code, language });
      setResult(response.data.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("You must be logged in to analyze code. Please sign in or create an account.");
      } else {
        setError(err.response?.data?.message || "Failed to analyze code. Please check your connection.");
      }
    } finally {
      setIsAnalyzing(false);
    }
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
                <button className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-white px-6 rounded-2xl transition-all border border-slate-700/50 flex items-center justify-center hover:border-slate-600">
                  <Save size={20} />
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
      </div>
    </Layout>
  );
}
