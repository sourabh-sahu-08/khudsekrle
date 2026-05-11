import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { authService } from "@/utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes("expired=true")) {
      setError("Your session expired. Sign in again to continue.");
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await authService.login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}`);
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid email or password.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-14">
      <div className="mx-auto grid w-full max-w-[1400px] items-stretch gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_40%),linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(9,15,28,0.5)_100%)] p-16 backdrop-blur-xl lg:flex lg:flex-col lg:justify-center lg:gap-20 xl:p-24"
        >
          <div className="max-w-md">
            <p className="eyebrow mb-6 text-sky-400/70 text-[10px]">Secure Sign In</p>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-white leading-tight">
              Pick up your review workflow exactly where you left it.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-400/90">
              Access saved analyses, iterate on findings, and keep every report in one authenticated workspace.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              "Saved analysis history tied to your account",
              "Private review sessions and public-share controls",
              "Profile-level settings for identity and password management",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/[0.04]"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-10 shadow-2xl backdrop-blur-xl sm:p-16 xl:p-24"
        >
          <div className="mx-auto max-w-md">
            <div className="mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 shadow-inner">
                <LogIn size={22} />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in with your email and password to continue.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden rounded-2xl border border-red-400/15 bg-red-500/10 px-5 py-4 text-xs text-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Email Address
                </span>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-14 pr-5 text-sm text-white placeholder:text-slate-600 transition-all focus:border-sky-400/30 focus:outline-none focus:ring-4 focus:ring-sky-400/5"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Secure Password
                </span>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-14 pr-14 text-sm text-white placeholder:text-slate-600 transition-all focus:border-sky-400/30 focus:outline-none focus:ring-4 focus:ring-sky-400/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-sky-400 text-sm font-bold text-slate-950 shadow-xl shadow-sky-400/10 transition-all hover:bg-sky-300 hover:shadow-sky-400/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-900/20 border-t-slate-900 animate-spin" />
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 text-[11px] leading-relaxed text-slate-500">
              Email and password authentication is currently supported in this build.
            </div>

            <p className="mt-10 text-center text-xs text-slate-500">
              New here?{" "}
              <Link to="/auth/register" className="font-semibold text-slate-300 hover:text-sky-300 underline underline-offset-4 decoration-white/10 hover:decoration-sky-300">
                Create a free account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </Layout>
  );
}
