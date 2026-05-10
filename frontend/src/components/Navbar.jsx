import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { History, LogOut, Search, ShieldCheck, Terminal, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-300 shadow-lg shadow-sky-500/10">
              <Terminal size={18} strokeWidth={2.2} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-500">
                AI Code Review
              </p>
              <p className="text-lg font-bold tracking-[-0.04em] text-white">
                khudsekrle
              </p>
            </div>
          </Link>

          {isLoggedIn && (
            <form onSubmit={handleSearch} className="hidden lg:block">
              <label className="relative block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search analyses, findings, or code snippets"
                  className="w-[26rem] rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                />
              </label>
            </form>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                <ShieldCheck size={14} />
                Secure Workspace
              </div>

              <Link
                to="/dashboard"
                className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 hover:border-sky-400/20 hover:text-white"
              >
                <History size={16} />
                <span className="hidden sm:inline">History</span>
              </Link>

              <Link
                to="/profile"
                className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 hover:border-sky-400/20 hover:text-white"
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex h-11 items-center gap-2 rounded-2xl border border-red-400/15 bg-red-500/10 px-4 text-sm font-medium text-red-200 hover:bg-red-500/15"
                title="Sign out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="flex h-11 items-center px-4 text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="flex h-11 items-center rounded-2xl bg-sky-400 px-6 text-sm font-bold text-slate-950 shadow-xl shadow-sky-400/20 hover:bg-sky-300 active:scale-95"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
