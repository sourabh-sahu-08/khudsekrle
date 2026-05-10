import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  Code2,
  Search,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import ConfirmModal from "@/components/ConfirmModal";
import { analysisService } from "@/utils/api";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);

    const fetchHistory = async () => {
      try {
        const response = await analysisService.getHistory();
        setHistory(response.data.data);
      } catch (error) {
        toast.error("Failed to load analysis history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [searchParams]);

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return;

    try {
      await analysisService.deleteAnalysis(idToDelete);
      setHistory((previous) => previous.filter((item) => item._id !== idToDelete));
      toast.success("Analysis deleted");
    } catch (error) {
      toast.error("Failed to delete analysis");
    } finally {
      setIdToDelete(null);
      setIsModalOpen(false);
    }
  };

  const languageOptions = useMemo(
    () => [...new Set(history.map((item) => item.language))],
    [history]
  );

  const filteredHistory = useMemo(
    () =>
      history.filter((item) => {
        const searchTarget = `${item.originalCode} ${item.findings || ""}`.toLowerCase();
        const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
        const matchesLanguage =
          filterLanguage === "all" || item.language === filterLanguage;

        return matchesSearch && matchesLanguage;
      }),
    [filterLanguage, history, searchQuery]
  );

  const stats = useMemo(() => {
    const scores = history
      .map((item) => parseInt(item.confidenceScore, 10) || 0)
      .filter(Boolean);

    return [
      { label: "Total analyses", value: history.length },
      { label: "Languages reviewed", value: languageOptions.length },
      {
        label: "Average confidence",
        value: scores.length
          ? `${Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)}%`
          : "0%",
      },
    ];
  }, [history, languageOptions.length]);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Analysis History</p>
            <h1 className="section-title">Track every review with context.</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-400">
              Compare findings, revisit fixes, and keep a searchable record of the code you have analyzed.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-sky-400 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-400/20 hover:bg-sky-300"
          >
            New Analysis
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="card-premium p-6"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 md:flex-row">
          <label className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search code, findings, or notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
          </label>

          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:outline-none"
          >
            <option value="all" className="bg-slate-950">
              All languages
            </option>
            {languageOptions.map((language) => (
              <option key={language} value={language} className="bg-slate-950">
                {language}
              </option>
            ))}
          </select>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-52 rounded-[1.75rem] border border-white/10 bg-white/[0.04] animate-pulse"
                />
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              {filteredHistory.map((item) => (
                <div
                  key={item._id}
                  className="card-premium flex flex-col justify-between p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                          <Code2 size={18} />
                        </div>
                        <div>
                          <p className="line-clamp-2 text-lg font-semibold text-white">
                            {item.originalCode.substring(0, 80).trim()}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                            <span>{item.language}</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIdToDelete(item._id);
                          setIsModalOpen(true);
                        }}
                        className="rounded-xl border border-red-400/10 bg-red-500/5 p-2 text-red-200 hover:bg-red-500/10"
                        title="Delete analysis"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                      {item.findings || "No written findings were saved for this analysis."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-300">
                      Confidence: {item.confidenceScore || "0%"}
                    </div>
                    <Link
                      to={`/dashboard/analysis/${item._id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white"
                    >
                      View report
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="card-premium mt-8 flex min-h-[18rem] flex-col items-center justify-center px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white/[0.04] text-slate-500">
                <Activity size={28} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">No matching analyses</h3>
              <p className="mt-3 max-w-md text-sm text-slate-400">
                Try a different search term, clear the language filter, or run a new analysis from the workspace.
              </p>
            </div>
          )}
        </AnimatePresence>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete analysis?"
          message="This will permanently remove the saved report from your history."
          confirmText="Delete analysis"
        />
      </div>
    </Layout>
  );
}
