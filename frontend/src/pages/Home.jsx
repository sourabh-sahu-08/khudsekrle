import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Cpu,
  Layers3,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import CodeEditor from "@/components/CodeEditor";
import AnalysisResults from "@/components/AnalysisResults";
import Layout from "@/components/Layout";
import { analysisService } from "@/utils/api";

export default function Home() {
  const [code, setCode] = useState(`function sumVisiblePrices(items) {
  return items
    .filter((item) => item.visible)
    .reduce((total, item) => total + item.price, 0);
}`);
  const [language, setLanguage] = useState("javascript");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    "Building analysis context",
    "Checking logic and edge cases",
    "Reviewing security posture",
    "Preparing recommendations",
  ];

  const languages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        if (!isAnalyzing && code.trim()) {
          handleAnalyze();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, isAnalyzing]);

  const handleAnalyze = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sign in required", {
        description: "Create an account or sign in to run a full analysis.",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((previous) =>
        previous < steps.length - 1 ? previous + 1 : previous
      );
    }, 1500);

    try {
      const response = await analysisService.analyze({ code, language });
      setResult(response.data.data);
      toast.success("Analysis complete");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "We could not analyze that code right now.";
      setError(errorMsg);
      toast.error("Analysis failed", { description: errorMsg });
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden xl:flex-row">
        <main className="flex min-w-0 flex-1 flex-col border-b border-white/10 xl:border-b-0 xl:border-r">
          <section className="border-b border-white/10 px-6 py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="eyebrow mb-3">AI Review Workspace</p>
                  <h1 className="section-title text-balance">
                    Ship cleaner code with fast, structured review.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base text-slate-400">
                    Run a focused audit for bugs, security risks, complexity, and
                    production-readiness without leaving the editor.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: BrainCircuit, label: "Reasoning", value: "Step-based" },
                    { icon: ShieldCheck, label: "Security", value: "OWASP-aware" },
                    { icon: Layers3, label: "Output", value: "Structured" },
                    { icon: Cpu, label: "Speed", value: "Single pass" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <item.icon size={16} className="text-sky-300" />
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col px-6 py-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                  <Terminal size={17} />
                </div>
                <div>
                  <p className="eyebrow">Editor</p>
                  <p className="text-sm text-slate-400">
                    Paste a snippet and run a full review with <span className="text-white">Ctrl + Enter</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value} className="bg-slate-950">
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !code.trim()}
                  className={`flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-bold ${
                    isAnalyzing || !code.trim()
                      ? "cursor-not-allowed border border-white/10 bg-white/5 text-slate-500"
                      : "bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20 hover:bg-sky-300"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-slate-900/20 border-t-slate-900 animate-spin" />
                      {steps[analysisStep]}
                    </>
                  ) : (
                    <>
                      Run Analysis
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="panel-highlight glass min-h-0 flex-1 overflow-hidden rounded-[2rem]">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>
          </section>
        </main>

        <aside className="flex w-full flex-col xl:w-[440px]">
          <div className="border-b border-white/10 px-6 py-6 xl:border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <Sparkles size={17} />
              </div>
              <div>
                <p className="eyebrow">Analysis Output</p>
                <p className="text-sm text-slate-400">
                  Findings, fixes, and follow-up guidance in one view.
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 px-6 py-6">
            <div className="panel-highlight glass flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-1 flex-col items-center justify-center px-10 text-center"
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-sky-400/10 text-sky-300 shadow-lg shadow-sky-500/10">
                      <Cpu size={42} className="animate-float" />
                    </div>
                    <h3 className="mt-8 text-lg font-bold text-white">
                      Reviewing your codebase excerpt
                    </h3>
                    <p className="mt-3 max-w-xs text-sm text-slate-400">
                      {steps[analysisStep]}. We are checking correctness, security, and practical code quality.
                    </p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="min-h-0 flex-1 overflow-hidden"
                  >
                    <AnalysisResults data={result} />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 flex-col items-center justify-center px-10 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-red-500/10 text-red-300">
                      <Code2 size={34} />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-white">Analysis failed</h3>
                    <p className="mt-3 max-w-xs text-sm text-slate-400">{error}</p>
                    <button
                      onClick={handleAnalyze}
                      className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/15"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 flex-col justify-between p-8"
                  >
                    <div>
                      <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/[0.04] text-slate-500">
                        <Code2 size={36} />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-white">
                        Ready for your next review
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                        Drop in a function, component, or route handler to get a practical review with fixes, expected output, and optimization notes.
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {[
                        "Bug and edge-case detection",
                        "Security review with actionable notes",
                        "Corrected and optimized code suggestions",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
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
