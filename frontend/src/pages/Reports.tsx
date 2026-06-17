import { Download, FileText } from "lucide-react";

const reports = ["Daily congestion brief", "Violation enforcement summary", "Emergency response audit", "Signal optimization impact"];

export function Reports() {
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Reports</p>
      <h3 className="mt-1 text-2xl font-semibold text-white">Operational intelligence exports</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article key={report} className="flex items-center justify-between rounded-lg border border-line bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan" />
              <span className="font-medium text-white">{report}</span>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-md border border-line text-slate-300"><Download className="h-4 w-4" /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

