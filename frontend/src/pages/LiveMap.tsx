import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { TrafficMap } from "../components/TrafficMap";
import { fallbackRoads } from "../data/fallback";
import { gridlockApi, type RoadSegment } from "../services/api";

export function LiveMap({ focus }: { focus?: "congestion" }) {
  const [roads, setRoads] = useState<RoadSegment[]>(fallbackRoads);

  useEffect(() => {
    gridlockApi.roads().then(setRoads).catch(() => setRoads(fallbackRoads));
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-panel p-5">
        <div>
          <p className="text-sm text-slate-400">{focus ? "Congestion Analysis" : "Live Traffic Map"}</p>
          <h3 className="text-2xl font-semibold text-white">Road density layers and hotspots</h3>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-slate-300"><Search className="h-4 w-4" /> Search</button>
          <button className="flex items-center gap-2 rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-slate-300"><Filter className="h-4 w-4" /> Layers</button>
        </div>
      </section>
      <TrafficMap roads={roads} />
    </div>
  );
}

