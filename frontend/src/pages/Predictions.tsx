import { useEffect, useState } from "react";
import { fallbackPredictions } from "../data/fallback";
import { gridlockApi, type Prediction } from "../services/api";

export function Predictions() {
  const [predictions, setPredictions] = useState<Prediction[]>(fallbackPredictions);

  useEffect(() => {
    gridlockApi.predictions().then(setPredictions).catch(() => setPredictions(fallbackPredictions));
  }, []);

  return (
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
  );
}

