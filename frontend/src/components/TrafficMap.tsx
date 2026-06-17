import type { RoadSegment } from "../services/api";

const colorByDensity = (density: number) => {
  if (density >= 85) return "bg-danger";
  if (density >= 68) return "bg-amber";
  if (density >= 42) return "bg-cyan";
  return "bg-mint";
};

export function TrafficMap({ roads }: { roads: RoadSegment[] }) {
  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-lg border border-line bg-[#0d1520] p-5">
      <div className="absolute inset-0 opacity-30 traffic-grid" />
      <div className="relative z-[1] flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Live Bengaluru Corridor Layer</p>
          <h3 className="mt-1 text-xl font-semibold text-white">Density, speed, and intervention map</h3>
        </div>
        <div className="rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-slate-300">Auto refresh 90s</div>
      </div>
      <div className="relative z-[1] mt-8 grid gap-4 md:grid-cols-2">
        {roads.map((road) => (
          <article key={road.id} className="rounded-lg border border-line bg-graphite/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-white">{road.name}</h4>
                <p className="text-sm text-slate-500">{road.corridor}</p>
              </div>
              <span className={`rounded px-2 py-1 text-xs font-semibold text-graphite ${colorByDensity(road.density_score)}`}>{road.density_score}</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className={`h-2 rounded-full ${colorByDensity(road.density_score)}`} style={{ width: `${road.density_score}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Speed</p>
                <p className="font-medium text-white">{road.average_speed} km/h</p>
              </div>
              <div>
                <p className="text-slate-500">Vehicles</p>
                <p className="font-medium text-white">{road.vehicle_count}</p>
              </div>
              <div>
                <p className="text-slate-500">Trend</p>
                <p className="font-medium text-white">{road.trend}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

