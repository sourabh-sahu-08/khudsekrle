import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isWorkspace =
    location.pathname === "/" || location.pathname.startsWith("/dashboard/analysis/");

  return (
    <div className="min-h-screen bg-transparent text-slate-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="absolute top-[-15%] left-[-8%] h-[36rem] w-[36rem] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[34rem] w-[34rem] rounded-full bg-blue-700/10 blur-[150px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex min-h-screen pt-16">
        {!isAuthPage && <Sidebar />}

        <main className="flex min-w-0 flex-1 flex-col">
          <div
            className={`flex-1 ${
              isWorkspace ? "overflow-hidden" : "overflow-y-auto"
            }`}
          >
            {children}
          </div>
          {!isWorkspace && !isAuthPage && <Footer />}
        </main>
      </div>
    </div>
  );
}
