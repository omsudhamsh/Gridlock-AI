import { useEffect, useState } from "react";
import { fallbackPredictions } from "../data/fallback";
import { gridlockApi, type IntelligenceBriefing, type Prediction } from "../services/api";

export function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>(fallbackPredictions);
  const [briefing, setBriefing] = useState<IntelligenceBriefing | null>(null);

  useEffect(() => {
    gridlockApi.predictions().then(setPredictions).catch(() => setPredictions(fallbackPredictions));
    gridlockApi.briefing().then(setBriefing).catch(() => setBriefing(null));
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-cyan/20 bg-panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">AI shift briefing</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Command-center outlook</h2>
          </div>
          {briefing && (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-slate-400">
              {briefing.used_fallback ? "Local fallback" : briefing.provider}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-5xl leading-7 text-slate-300">
          {briefing?.briefing ?? "Generating a live operational briefing from current corridor telemetry…"}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {predictions.map((prediction) => (
          <article key={`${prediction.location}-${prediction.horizon_minutes}`} className="rounded-lg border border-line bg-panel p-5">
            <p className="text-sm text-slate-400">{prediction.horizon_minutes} minute horizon</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{prediction.location}</h3>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Density</p>
                <p className="text-xl font-semibold text-cyan">{Math.round(prediction.predicted_density)}</p>
              </div>
              <div>
                <p className="text-slate-500">Speed</p>
                <p className="text-xl font-semibold text-white">{prediction.expected_speed}</p>
              </div>
              <div>
                <p className="text-slate-500">Risk</p>
                <p className="text-xl font-semibold text-amber">{Math.round(prediction.hotspot_probability * 100)}%</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
