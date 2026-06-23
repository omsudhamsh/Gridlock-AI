import { Activity, Camera, MapPin, RefreshCw, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TrafficMap } from "../components/TrafficMap";
import { fallbackPredictions, fallbackRecommendations, fallbackRoads, fallbackViolations } from "../data/fallback";
import { gridlockApi, type Prediction, type Recommendation, type RoadSegment, type Violation } from "../services/api";

export function LiveMap({ focus }: { focus?: "congestion" }) {
  const [roads, setRoads] = useState<RoadSegment[]>(fallbackRoads);
  const [predictions, setPredictions] = useState<Prediction[]>(fallbackPredictions);
  const [violations, setViolations] = useState<Violation[]>(fallbackViolations);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMap = useCallback(async () => {
    setIsRefreshing(true);
    const [roadResult, predictionResult, violationResult, recommendationResult] = await Promise.allSettled([
      gridlockApi.roads(),
      gridlockApi.predictions(),
      gridlockApi.violations(),
      gridlockApi.recommendations()
    ]);
    if (roadResult.status === "fulfilled") setRoads(roadResult.value);
    if (predictionResult.status === "fulfilled") setPredictions(predictionResult.value);
    if (violationResult.status === "fulfilled") setViolations(violationResult.value);
    if (recommendationResult.status === "fulfilled") setRecommendations(recommendationResult.value);
    if ([roadResult, predictionResult, violationResult, recommendationResult].some((result) => result.status === "fulfilled")) {
      setLastUpdated(new Date());
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    void refreshMap();
    const refreshTimer = window.setInterval(() => void refreshMap(), 30_000);
    return () => window.clearInterval(refreshTimer);
  }, [refreshMap]);

  useEffect(() => {
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") void refreshMap();
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    return () => document.removeEventListener("visibilitychange", visibilityHandler);
  }, [refreshMap]);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-panel p-5">
        <div>
          <p className="text-sm text-slate-400">{focus ? "Congestion Analysis" : "Live Traffic Map"}</p>
          <h3 className="text-2xl font-semibold text-white">Bengaluru mobility operations</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Coordinate-accurate corridor monitoring with forecast, enforcement, camera, and intervention overlays.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          {[
            [MapPin, roads.length, "Corridors"],
            [Activity, predictions.length, "Forecasts"],
            [ShieldAlert, violations.length, "Events"],
            [Camera, new Set(violations.map((item) => item.camera_id)).size, "Cameras"]
          ].map(([Icon, value, label]) => {
            const SummaryIcon = Icon as typeof MapPin;
            return (
              <div key={label as string} className="rounded-md border border-line bg-white/[0.03] px-3 py-2">
                <SummaryIcon className="mb-1 h-3.5 w-3.5 text-cyan" />
                <span className="font-semibold text-white">{value as number}</span>
                <span className="ml-1 text-slate-500">{label as string}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => void refreshMap()}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-md border border-line bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition hover:border-cyan/40 hover:text-cyan disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh live data
        </button>
      </section>
      <TrafficMap roads={roads} predictions={predictions} violations={violations} recommendations={recommendations} lastUpdated={lastUpdated} />
    </div>
  );
}
