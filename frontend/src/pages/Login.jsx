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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-slate-950/40 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="hidden border-r border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,#09111f_0%,#060a14_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="eyebrow mb-4">Secure Sign In</p>
              <h1 className="text-4xl font-bold tracking-[-0.05em] text-white">
                Pick up your review workflow exactly where you left it.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Access saved analyses, iterate on findings, and keep every report in one authenticated workspace.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "Saved analysis history tied to your account",
                "Private review sessions and public-share controls",
                "Profile-level settings for identity and password management",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                  <LogIn size={22} />
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Sign in with your email and password to continue.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden rounded-2xl border border-red-400/15 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                    Email
                  </span>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                    Password
                  </span>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky-400 text-sm font-bold text-slate-950 shadow-lg shadow-sky-400/20 hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-900/20 border-t-slate-900 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                Email and password authentication is currently supported in this build.
              </div>

              <p className="mt-8 text-sm text-slate-400">
                New here?{" "}
                <Link to="/auth/register" className="font-semibold text-white hover:text-sky-300">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
