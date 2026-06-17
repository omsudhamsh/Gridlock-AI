import { useEffect, useState } from "react";
import { fallbackViolations } from "../data/fallback";
import { gridlockApi, type Violation } from "../services/api";

export function Violations() {
  const [violations, setViolations] = useState<Violation[]>(fallbackViolations);

  useEffect(() => {
    gridlockApi.violations().then(setViolations).catch(() => setViolations(fallbackViolations));
  }, []);

  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Violation Monitoring</p>
      <h3 className="mt-1 text-2xl font-semibold text-white">AI-assisted camera events</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="border-b border-line py-3">Type</th>
              <th className="border-b border-line py-3">Location</th>
              <th className="border-b border-line py-3">Camera</th>
              <th className="border-b border-line py-3">Count</th>
              <th className="border-b border-line py-3">Priority</th>
              <th className="border-b border-line py-3">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((violation) => (
              <tr key={violation.id} className="text-slate-300">
                <td className="border-b border-line/70 py-4 font-medium text-white">{violation.type}</td>
                <td className="border-b border-line/70 py-4">{violation.location}</td>
                <td className="border-b border-line/70 py-4">{violation.camera_id}</td>
                <td className="border-b border-line/70 py-4">{violation.count}</td>
                <td className="border-b border-line/70 py-4">{violation.priority}</td>
                <td className="border-b border-line/70 py-4">{Math.round(violation.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

