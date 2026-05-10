import { Link } from "react-router-dom";
import { ShieldCheck, Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/40 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
            <Terminal size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">khudsekrle</p>
            <p className="text-xs text-slate-500">
              Professional AI-assisted code review for security, quality, and clarity.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-slate-400 md:items-end">
          <div className="flex items-center gap-2 text-emerald-300">
            <ShieldCheck size={14} />
            <span>Private workspace and authenticated analysis history</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-white">
              Workspace
            </Link>
            <Link to="/dashboard" className="hover:text-white">
              History
            </Link>
            <Link to="/profile" className="hover:text-white">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
