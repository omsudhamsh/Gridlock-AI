export function Settings({ mode }: { mode?: "auth" | "profile" }) {
  const title = mode === "auth" ? "Authentication" : mode === "profile" ? "Officer profile" : "Settings";
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Command Center</p>
      <h3 className="mt-1 text-2xl font-semibold text-white">{title}</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {["Role based access", "Camera feed permissions", "Alert thresholds", "Notification channels"].map((item) => (
          <label key={item} className="flex items-center justify-between rounded-md border border-line bg-white/[0.03] p-4 text-slate-300">
            <span>{item}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-cyan" />
          </label>
        ))}
      </div>
    </section>
  );
}

