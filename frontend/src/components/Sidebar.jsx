import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, ChartColumn, Code2, Home, User } from "lucide-react";
import { analysisService } from "@/utils/api";

export default function Sidebar() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchRecent = async () => {
      try {
        const response = await analysisService.getHistory();
        setHistory(response.data.data.slice(0, 6));
      } catch (error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const languageSummary = useMemo(() => {
    const counts = history.reduce((acc, item) => {
      acc[item.language] = (acc[item.language] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [history]);

  const navItems = [
    { icon: Home, label: "Workspace", path: "/" },
    { icon: Activity, label: "History", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-white/10 bg-slate-950/40 xl:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col px-5 py-6">
        <div className="panel-highlight glass rounded-[1.75rem] p-5">
          <p className="eyebrow mb-3">Workspace</p>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user?.name || "Guest Developer"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email || "Sign in to save and compare analyses"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                  active
                    ? "border-sky-400/20 bg-sky-400/10 text-white"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <ChartColumn size={16} className="text-sky-300" />
            <p className="eyebrow">Quick Snapshot</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Saved audits</p>
              <p className="mt-2 text-2xl font-bold text-white">{history.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs text-slate-500">Top languages</p>
              <p className="mt-2 text-2xl font-bold text-white">{languageSummary.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 min-h-0 flex-1 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">Recent Analyses</p>
            <Code2 size={15} className="text-slate-500" />
          </div>

          <div className="space-y-2 overflow-y-auto pr-1">
            {loading ? (
              [0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-16 rounded-2xl border border-white/5 bg-white/5 animate-pulse"
                />
              ))
            ) : history.length > 0 ? (
              history.map((item) => (
                <Link
                  key={item._id}
                  to={`/dashboard/analysis/${item._id}`}
                  className="block rounded-2xl border border-white/8 bg-slate-950/50 p-4 hover:border-sky-400/15 hover:bg-slate-900/70"
                >
                  <p className="line-clamp-2 text-sm font-medium text-slate-200">
                    {item.originalCode.substring(0, 70).trim()}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    <span>{item.language}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-sm text-slate-400">
                Your recent analyses will appear here after the first run.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
