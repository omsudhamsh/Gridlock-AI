import { ArrowRight, Camera, ShieldCheck, Siren } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";

export function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-graphite text-slate-100">
      <section className="relative min-h-screen px-4 py-6 md:px-10">
        <div className="absolute inset-0 traffic-grid opacity-20" />
        <div className="relative z-[1] mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan/30 bg-cyan/10">
              <Camera className="h-5 w-5 text-cyan" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Bengaluru</p>
              <h1 className="text-xl font-semibold text-white">Gridlock AI</h1>
            </div>
          </div>
          <Link to="/login" className="rounded-md border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan">
            Login
          </Link>
        </div>

        <div className="relative z-[1] mx-auto grid max-w-7xl items-center gap-10 py-20 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="mb-4 inline-flex rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-sm text-mint">Authenticated command access</p>
            <h2 className="max-w-4xl text-5xl font-semibold leading-tight text-white md:text-7xl">Traffic intelligence for secure city operations</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Monitor Bengaluru congestion, violations, emergency alerts, and AI recommendations through a protected police command center interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-3 font-semibold text-graphite">
                Request access <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="rounded-md border border-line bg-white/5 px-5 py-3 font-semibold text-slate-200">
                Existing operator
              </Link>
            </div>
          </motion.div>

          <div className="rounded-lg border border-line bg-panel/70 p-5 shadow-glow backdrop-blur">
            {[
              ["JWT Access", "Short-lived bearer tokens protect dashboard APIs.", ShieldCheck],
              ["Role Based Access", "Traffic Police, Operators, Admins, Guests, and Super Admins.", Camera],
              ["Session Control", "Remember me, refresh flow, timeout, and logout.", Siren]
            ].map(([title, body, Icon]) => (
              <div key={title as string} className="flex gap-4 border-b border-line py-5 last:border-b-0">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-cyan/20 bg-cyan/10">
                  <Icon className="h-5 w-5 text-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title as string}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{body as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

