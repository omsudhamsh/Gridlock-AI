import type { ReactNode } from "react";
import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthPanel({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-graphite px-4 py-8 text-slate-100 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden min-h-[calc(100vh-64px)] flex-col justify-between rounded-lg border border-line bg-panel/70 p-8 shadow-glow backdrop-blur lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan/30 bg-cyan/10">
            <Camera className="h-5 w-5 text-cyan" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gridlock AI</p>
            <h1 className="text-xl font-semibold text-white">Secure Access</h1>
          </div>
        </div>
        <div>
          <h2 className="max-w-xl text-5xl font-semibold leading-tight text-white">Police command center authentication</h2>
          <p className="mt-5 max-w-lg leading-7 text-slate-400">Every operational view is protected by JWT authentication and role-aware navigation.</p>
        </div>
        <Link to="/" className="text-sm text-cyan">Back to landing</Link>
      </section>

      <section className="flex items-center justify-center py-8">
        <div className="w-full max-w-md rounded-lg border border-line bg-panel/90 p-6 shadow-glow backdrop-blur md:p-8">
          <p className="text-sm text-slate-400">Sprint 1 Authentication</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-sm text-slate-400">{footer}</div>
        </div>
      </section>
    </main>
  );
}

