"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import { Sparkles, Save, AlertCircle } from "lucide-react";
import { analysisService } from "@/utils/api";

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
      setError(err.response?.data?.message || "Failed to analyze code. Please check your API key and connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <Navbar />

      <div className="max-w-[1400px] mx-auto pt-24 px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Editor */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Source Code</h2>
                <p className="text-sm text-slate-400">Select language and paste your code below</p>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="glass rounded-2xl p-4">
              <CodeEditor
                code={code}
                onChange={(val) => setCode(val || "")}
                language={language}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Analyze Code"}
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-xl transition-all">
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Analysis Result</h2>
            {result ? (
              <AnalysisResults data={result} />
            ) : (
              <div className="glass rounded-2xl h-[calc(100vh-16rem)] min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-200">No Analysis Yet</h3>
                  <p className="text-slate-400 max-w-[280px]">Paste your code and click &quot;Analyze Code&quot; to see the magic happen.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
