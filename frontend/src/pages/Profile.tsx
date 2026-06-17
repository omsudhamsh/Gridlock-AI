import { ShieldCheck } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export function Profile() {
  const { user } = useAuth();

  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Profile</p>
      <h3 className="mt-1 text-2xl font-semibold text-white">Authenticated operator</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          ["Name", user?.name],
          ["Email", user?.email],
          ["Role", user?.role],
          ["Department", user?.department],
          ["Last Login", user?.last_login ? new Date(user.last_login).toLocaleString() : "First session"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-line bg-white/[0.03] p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 font-medium text-white">{value}</p>
          </div>
        ))}
        <div className="rounded-md border border-mint/20 bg-mint/10 p-4">
          <ShieldCheck className="h-5 w-5 text-mint" />
          <p className="mt-3 font-medium text-white">JWT session active</p>
          <p className="mt-1 text-sm text-slate-400">Protected dashboard routes are unlocked for this role.</p>
        </div>
      </div>
    </section>
  );
}

