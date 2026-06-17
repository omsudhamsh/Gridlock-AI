import { useEffect, useState } from "react";
import { TrendChart } from "../components/TrendChart";
import { fallbackAnalytics } from "../data/fallback";
import { gridlockApi, type AnalyticsPoint } from "../services/api";

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsPoint[]>(fallbackAnalytics);

  useEffect(() => {
    gridlockApi.analytics().then(setAnalytics).catch(() => setAnalytics(fallbackAnalytics));
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-lg border border-line bg-panel p-5">
        <h3 className="mb-4 text-xl font-semibold text-white">Average speed by hour</h3>
        <TrendChart data={analytics} />
      </section>
      <section className="rounded-lg border border-line bg-panel p-5">
        <h3 className="mb-4 text-xl font-semibold text-white">Traffic volume by hour</h3>
        <TrendChart data={analytics} mode="bar" />
      </section>
    </div>
  );
}

