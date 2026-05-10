import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { analysisService, authService } from "@/utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    corrections: 0,
    optimizations: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const [updatingSecurity, setUpdatingSecurity] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [userRes, statsRes, historyRes] = await Promise.all([
          authService.getMe(),
          analysisService.getStats(),
          analysisService.getHistory(),
        ]);

        const userData = userRes.data.data;
        setUser({ ...userData, id: userData._id || userData.id });
        setFormData({ name: userData.name, email: userData.email });
        setStats(statsRes.data.data);
        setHistory(historyRes.data.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/auth/login");
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const languageBreakdown = useMemo(() => {
    const counts = history.reduce((acc, item) => {
      acc[item.language] = (acc[item.language] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [history]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setUpdating(true);

    try {
      const response = await authService.updateDetails(formData);
      const userData = response.data.data;
      const nextUser = { ...user, ...userData };
      setUser(nextUser);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: nextUser._id || nextUser.id,
          name: nextUser.name,
          email: nextUser.email,
          role: nextUser.role,
        })
      );
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setUpdatingSecurity(true);

    try {
      await authService.updatePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      setShowSecurity(false);
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setUpdatingSecurity(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-sky-400/20 border-t-sky-400 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 shadow-2xl shadow-sky-500/20">
              <User size={36} />
            </div>
            <div>
              <p className="eyebrow mb-2">Profile</p>
              <h1 className="text-4xl font-bold tracking-[-0.05em] text-white">
                {user?.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-slate-400">
                <Mail size={15} />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setIsEditing((previous) => !previous);
                setShowSecurity(false);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-sky-400/20"
            >
              Edit profile
            </button>
            <button
              onClick={() => {
                setShowSecurity((previous) => !previous);
                setIsEditing(false);
              }}
              className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/15"
            >
              Update password
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { label: "Saved analyses", value: stats.totalAnalyses },
            { label: "Corrections generated", value: stats.corrections },
            { label: "Optimizations suggested", value: stats.optimizations },
          ].map((stat) => (
            <div key={stat.label} className="card-premium p-6">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card-premium p-8"
              >
                <h2 className="text-2xl font-bold text-white">Edit profile</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Update the name and email used across your saved workspace.
                </p>

                <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Full name
                    </span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Email
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          email: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                      required
                    />
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={updating}
                      className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-sky-300 disabled:opacity-70"
                    >
                      {updating ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : showSecurity ? (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card-premium p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Update password</h2>
                    <p className="text-sm text-slate-400">
                      Keep your workspace secure with a fresh password.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="mt-6 space-y-5">
                  {[
                    {
                      label: "Current password",
                      key: "currentPassword",
                    },
                    {
                      label: "New password",
                      key: "newPassword",
                    },
                    {
                      label: "Confirm new password",
                      key: "confirmPassword",
                    },
                  ].map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        {field.label}
                      </span>
                      <input
                        type="password"
                        value={securityData[field.key]}
                        onChange={(e) =>
                          setSecurityData((previous) => ({
                            ...previous,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                        required
                      />
                    </label>
                  ))}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={updatingSecurity}
                      className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-70"
                    >
                      {updatingSecurity ? "Updating..." : "Update password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSecurity(false)}
                      className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-premium p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Account overview</h2>
                    <p className="text-sm text-slate-400">
                      Basic account details and recent workspace activity.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Display name
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{user?.name}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Email
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{user?.email}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="card-premium p-8">
              <h2 className="text-2xl font-bold text-white">Language activity</h2>
              <p className="mt-2 text-sm text-slate-400">
                Distribution of analyses by language in your saved history.
              </p>

              <div className="mt-6 space-y-4">
                {languageBreakdown.length > 0 ? (
                  languageBreakdown.map(([language, count]) => (
                    <div key={language}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">{language}</span>
                        <span className="text-slate-400">{count} analyses</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className="h-2 rounded-full bg-sky-400"
                          style={{ width: `${(count / history.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No saved analyses yet. Run a review to start building history.
                  </p>
                )}
              </div>
            </div>

            <div className="card-premium p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Recent reports</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Jump back into your latest findings and recommendations.
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {history.length > 0 ? (
                  history.slice(0, 4).map((item) => (
                    <Link
                      key={item._id}
                      to={`/dashboard/analysis/${item._id}`}
                      className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4 hover:border-sky-400/20"
                    >
                      <p className="line-clamp-2 text-sm font-medium text-slate-200">
                        {item.originalCode.substring(0, 80).trim()}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        <span>{item.language}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    No recent reports yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
