import { Activity, AlertTriangle, BarChart3, Bell, Camera, FileText, Gauge, Map, Route, Settings, ShieldAlert, User } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/map", label: "Live Map", icon: Map },
  { to: "/congestion", label: "Congestion", icon: Route },
  { to: "/violations", label: "Violations", icon: ShieldAlert },
  { to: "/predictions", label: "Predictions", icon: Activity },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-graphite text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-panel/90 px-4 py-5 backdrop-blur xl:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan/30 bg-cyan/10">
            <Camera className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Bengaluru</p>
            <h1 className="text-xl font-semibold">Gridlock AI</h1>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-cyan/12 text-cyan" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-line bg-graphite/84 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Traffic Command Center</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Decision Support System</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-sm text-mint md:flex">
                <span className="h-2 w-2 rounded-full bg-mint" />
                Live simulation
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-md border border-line bg-white/5 text-slate-300">
                <Bell className="h-4 w-4" />
              </button>
              <NavLink to="/profile" className="grid h-10 w-10 place-items-center rounded-md border border-line bg-white/5 text-slate-300">
                <User className="h-4 w-4" />
              </NavLink>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto xl:hidden">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className="shrink-0 rounded-md border border-line px-3 py-2 text-sm text-slate-300">
                {label}
              </NavLink>
            ))}
          </div>
        </header>
        <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </motion.main>
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 hidden rounded-md border border-amber/20 bg-amber/10 px-3 py-2 text-sm text-amber lg:flex">
        <AlertTriangle className="mr-2 h-4 w-4" /> Emergency lane watch active
      </div>
    </div>
  );
}
