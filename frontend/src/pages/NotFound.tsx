import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="rounded-lg border border-line bg-panel p-8 text-center">
      <p className="text-sm text-slate-400">404</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Route not found</h3>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-graphite">
        Return to dashboard
      </Link>
    </section>
  );
}

