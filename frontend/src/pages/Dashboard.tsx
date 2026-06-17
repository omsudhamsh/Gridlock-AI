import { Activity, AlertTriangle, Ambulance, Camera, Car, Gauge, ShieldAlert, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { TrafficMap } from "../components/TrafficMap";
import { TrendChart } from "../components/TrendChart";
import { fallbackAnalytics, fallbackRecommendations, fallbackRoads, fallbackSummary, fallbackViolations } from "../data/fallback";
import { gridlockApi, type AnalyticsPoint, type DashboardSummary, type Recommendation, type RoadSegment, type Violation } from "../services/api";

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary>(fallbackSummary);
  const [roads, setRoads] = useState<RoadSegment[]>(fallbackRoads);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations);
  const [violations, setViolations] = useState<Violation[]>(fallbackViolations);
  const [analytics, setAnalytics] = useState<AnalyticsPoint[]>(fallbackAnalytics);

  useEffect(() => {
    Promise.allSettled([gridlockApi.summary(), gridlockApi.roads(), gridlockApi.recommendations(), gridlockApi.violations(), gridlockApi.analytics()]).then((results) => {
      if (results[0].status === "fulfilled") setSummary(results[0].value);
      if (results[1].status === "fulfilled") setRoads(results[1].value);
      if (results[2].status === "fulfilled") setRecommendations(results[2].value);
      if (results[3].status === "fulfilled") setViolations(results[3].value);
      if (results[4].status === "fulfilled") setAnalytics(results[4].value);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Traffic Score" value={`${summary.traffic_score}/100`} detail="Higher is healthier" icon={Gauge} tone="cyan" />
        <MetricCard title="Average Speed" value={`${summary.average_speed} km/h`} detail="Across monitored corridors" icon={Activity} tone="mint" />
        <MetricCard title="Active Vehicles" value={summary.active_vehicles.toLocaleString()} detail={`${summary.live_cameras} cameras online`} icon={Car} tone="amber" />
        <MetricCard title="Emergency Alerts" value={`${summary.emergency_alerts}`} detail={summary.prediction_summary} icon={Ambulance} tone="danger" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <TrafficMap roads={roads.slice(0, 6)} />
        <section className="rounded-lg border border-line bg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Decision Engine</p>
              <h3 className="text-xl font-semibold text-white">Priority actions</h3>
            </div>
            <Timer className="h-5 w-5 text-cyan" />
          </div>
          <div className="space-y-3">
            {recommendations.map((item) => (
              <article key={item.id} className="rounded-md border border-line bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.type}</p>
                  <span className="rounded bg-cyan/10 px-2 py-1 text-xs text-cyan">{item.priority}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.location}</p>
                <p className="mt-3 text-sm text-slate-300">{item.action}</p>
                <p className="mt-3 text-xs text-slate-500">{item.expected_improvement} · {item.estimated_time_saved}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg border border-line bg-panel p-5">
          <h3 className="mb-4 text-xl font-semibold text-white">Speed trend</h3>
          <TrendChart data={analytics} />
        </section>
        <section className="rounded-lg border border-line bg-panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber" />
            <h3 className="text-xl font-semibold text-white">Violation watch</h3>
          </div>
          <div className="space-y-3">
            {violations.slice(0, 4).map((violation) => (
              <div key={violation.id} className="flex items-center justify-between rounded-md border border-line bg-white/[0.03] p-3">
                <div>
                  <p className="font-medium text-white">{violation.type}</p>
                  <p className="text-sm text-slate-500">{violation.location} · {violation.camera_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber">{violation.count}</p>
                  <p className="text-xs text-slate-500">{Math.round(violation.confidence * 100)}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

