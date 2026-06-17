import type { LucideIcon } from "lucide-react";

export function MetricCard({ title, value, detail, icon: Icon, tone = "cyan" }: { title: string; value: string; detail: string; icon: LucideIcon; tone?: "cyan" | "mint" | "amber" | "danger" }) {
  const toneClass = {
    cyan: "text-cyan bg-cyan/10 border-cyan/20",
    mint: "text-mint bg-mint/10 border-mint/20",
    amber: "text-amber bg-amber/10 border-amber/20",
    danger: "text-danger bg-danger/10 border-danger/20"
  }[tone];

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-md border ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
}

