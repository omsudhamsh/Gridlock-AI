import { type LatLngBoundsExpression } from "leaflet";
import {
  Activity, AlertTriangle, Camera, Car, Crosshair, Gauge, Layers3,
  LocateFixed, Route, ShieldAlert, Sparkles, TrendingDown, TrendingUp
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Circle, CircleMarker, MapContainer, Popup, ScaleControl,
  TileLayer, Tooltip, useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Prediction, Recommendation, RoadSegment, Violation } from "../services/api";

type Layer = "traffic" | "predictions" | "violations" | "recommendations";

interface TrafficMapProps {
  roads: RoadSegment[];
  predictions?: Prediction[];
  violations?: Violation[];
  recommendations?: Recommendation[];
  compact?: boolean;
  lastUpdated?: Date;
}

const OSM_TILE_URL = import.meta.env.VITE_OSM_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

const densityColor = (density: number) => {
  if (density >= 85) return "#ff6b6b";
  if (density >= 68) return "#f8c15c";
  if (density >= 42) return "#55d8ff";
  return "#4fe0b5";
};

const layerOptions: Array<[Layer, string, typeof Gauge]> = [
  ["traffic", "Traffic", Gauge],
  ["predictions", "Forecast", Activity],
  ["violations", "Enforcement", ShieldAlert],
  ["recommendations", "Actions", Sparkles]
];

function MapController({ roads, selected, recenterToken }: {
  roads: RoadSegment[];
  selected?: RoadSegment;
  recenterToken: number;
}) {
  const map = useMap();
  const hasFitted = useRef(false);
  const previousRecenterToken = useRef(recenterToken);

  useEffect(() => {
    if (selected) map.flyTo([selected.latitude, selected.longitude], Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [map, selected?.id]);

  useEffect(() => {
    if (!roads.length) return;
    const wasExplicitlyRecentered = previousRecenterToken.current !== recenterToken;
    if (hasFitted.current && !wasExplicitlyRecentered) return;
    const bounds: LatLngBoundsExpression = roads.map((road) => [road.latitude, road.longitude]);
    map.fitBounds(bounds, { padding: [55, 55], maxZoom: 13 });
    hasFitted.current = true;
    previousRecenterToken.current = recenterToken;
  }, [map, recenterToken, roads]);

  return null;
}

const pointOffset = (road: RoadSegment, index: number, distance = 0.0012): [number, number] => {
  const angle = ((index * 137.5 + road.density_score) * Math.PI) / 180;
  return [road.latitude + Math.sin(angle) * distance, road.longitude + Math.cos(angle) * distance];
};

export function TrafficMap({
  roads,
  predictions = [],
  violations = [],
  recommendations = [],
  compact = false,
  lastUpdated = new Date()
}: TrafficMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(roads[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [recenterToken, setRecenterToken] = useState(0);
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    traffic: true,
    predictions: true,
    violations: true,
    recommendations: true
  });

  const filteredRoads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return roads;
    return roads.filter((road) => `${road.name} ${road.corridor}`.toLowerCase().includes(needle));
  }, [query, roads]);

  const selected = roads.find((road) => road.id === selectedId) ?? filteredRoads[0] ?? roads[0];
  const selectedPredictions = predictions.filter((item) => item.location === selected?.name);
  const selectedViolations = violations.filter((item) => item.location === selected?.name);
  const selectedRecommendations = recommendations.filter((item) => item.location === selected?.name);
  const totalVehicles = roads.reduce((sum, road) => sum + road.vehicle_count, 0);
  const severeCount = roads.filter((road) => road.density_score >= 85).length;
  const layerCount = Object.values(layers).filter(Boolean).length;
  const roadByLocation = useMemo(() => new Map(roads.map((road) => [road.name, road])), [roads]);

  const selectSearchResult = (road: RoadSegment) => {
    setSelectedId(road.id);
    setQuery(road.name);
  };

  if (!roads.length) {
    return <section className="rounded-xl border border-line bg-panel p-8 text-slate-400">No mapped corridor data is available.</section>;
  }

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-[#0b131e] shadow-glow">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-4 lg:px-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-cyan">
            <Crosshair className="h-4 w-4" />
            OpenStreetMap · Bengaluru live operations
          </div>
          <h3 className="mt-1 text-xl font-semibold text-white">City mobility command map</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-mint">
            <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="rounded-full border border-line bg-white/5 px-3 py-1.5 text-slate-300">{totalVehicles.toLocaleString()} vehicles</span>
          <span className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-danger">{severeCount} severe</span>
        </div>
      </header>

      <div className={compact ? "grid" : "grid xl:grid-cols-[minmax(0,1fr)_350px]"}>
        <div className={`relative overflow-hidden ${compact ? "h-[570px]" : "h-[680px]"}`}>
          <div className="absolute left-4 right-14 top-4 z-[500] flex flex-wrap gap-2">
            {!compact && (
              <div className="relative min-w-[230px] flex-1">
                <label className="flex items-center gap-2 rounded-lg border border-line bg-graphite/95 px-3 py-2.5 shadow-xl backdrop-blur">
                  <Crosshair className="h-4 w-4 text-cyan" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find junction, road, or corridor"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </label>
                {query && filteredRoads.length > 0 && !filteredRoads.some((road) => road.name === query) && (
                  <div className="absolute left-0 right-0 top-12 max-h-52 overflow-auto rounded-lg border border-line bg-graphite/95 p-1 shadow-2xl backdrop-blur">
                    {filteredRoads.map((road) => (
                      <button
                        key={road.id}
                        onClick={() => selectSearchResult(road)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                      >
                        <span>
                          <span className="block text-white">{road.name}</span>
                          <span className="text-xs text-slate-500">{road.corridor}</span>
                        </span>
                        <span className="font-semibold" style={{ color: densityColor(road.density_score) }}>{road.density_score}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-1 rounded-lg border border-line bg-graphite/95 p-1 shadow-xl backdrop-blur">
              {layerOptions.map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => setLayers((current) => ({ ...current, [key]: !current[key] }))}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition ${
                    layers[key] ? "bg-cyan/15 text-cyan" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className={compact ? "hidden 2xl:inline" : ""}>{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setRecenterToken((value) => value + 1)}
              title="Fit all monitored corridors"
              className="rounded-lg border border-line bg-graphite/95 p-2.5 text-slate-300 shadow-xl transition hover:text-cyan"
            >
              <LocateFixed className="h-4 w-4" />
            </button>
          </div>

          <MapContainer
            center={BENGALURU_CENTER}
            zoom={12}
            preferCanvas
            className="gridlock-leaflet-map h-full w-full"
            minZoom={10}
            maxZoom={18}
            maxBounds={[[12.7, 77.35], [13.25, 77.9]]}
            maxBoundsViscosity={0.65}
          >
            <TileLayer
              url={OSM_TILE_URL}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
            <ScaleControl position="bottomright" imperial={false} />
            <MapController roads={roads} selected={selected} recenterToken={recenterToken} />

            {layers.predictions && roads.map((road) => {
              const forecast = predictions.find((item) => item.location === road.name && item.horizon_minutes === 30);
              if (!forecast) return null;
              const color = densityColor(forecast.predicted_density);
              return (
                <Circle
                  key={`risk-${road.id}`}
                  center={[road.latitude, road.longitude]}
                  radius={260 + forecast.hotspot_probability * 620}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.08, opacity: 0.35, dashArray: "7 9", weight: 2 }}
                  interactive={false}
                />
              );
            })}

            {layers.traffic && filteredRoads.map((road) => {
              const color = densityColor(road.density_score);
              const isSelected = selected?.id === road.id;
              return (
                <CircleMarker
                  key={road.id}
                  center={[road.latitude, road.longitude]}
                  radius={isSelected ? 18 : 11 + Math.min(7, road.vehicle_count / 300)}
                  pathOptions={{ color: isSelected ? "#ffffff" : color, fillColor: color, fillOpacity: 0.82, opacity: 1, weight: isSelected ? 4 : 2 }}
                  eventHandlers={{ click: () => setSelectedId(road.id) }}
                >
                  <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                    <div className="min-w-[180px]">
                      <strong>{road.name}</strong>
                      <div>{road.corridor}</div>
                      <div className="mt-1">Density {road.density_score}/100 · {road.average_speed} km/h</div>
                    </div>
                  </Tooltip>
                  <Popup minWidth={250}>
                    <div className="gridlock-map-popup">
                      <strong>{road.name}</strong>
                      <span>{road.corridor}</span>
                      <div><b>{road.congestion_level}</b> · {road.trend}</div>
                      <div>{road.vehicle_count.toLocaleString()} vehicles · {Math.round(road.occupancy * 100)}% occupancy</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {layers.violations && violations.map((violation, index) => {
              const road = roadByLocation.get(violation.location);
              if (!road) return null;
              return (
                <CircleMarker
                  key={violation.id}
                  center={pointOffset(road, index)}
                  radius={7 + Math.min(8, violation.count / 10)}
                  pathOptions={{ color: "#0b1017", fillColor: "#f8c15c", fillOpacity: 0.95, weight: 3 }}
                  eventHandlers={{ click: () => setSelectedId(road.id) }}
                >
                  <Tooltip direction="top" opacity={1}>
                    <strong>{violation.type}</strong><br />
                    {violation.count} events · {violation.camera_id}<br />
                    {Math.round(violation.confidence * 100)}% confidence
                  </Tooltip>
                </CircleMarker>
              );
            })}

            {layers.recommendations && recommendations.map((recommendation, index) => {
              const road = roadByLocation.get(recommendation.location);
              if (!road) return null;
              return (
                <CircleMarker
                  key={recommendation.id}
                  center={pointOffset(road, index + 8, 0.0017)}
                  radius={10}
                  pathOptions={{ color: "#0b1017", fillColor: "#55d8ff", fillOpacity: 1, weight: 3 }}
                  eventHandlers={{ click: () => setSelectedId(road.id) }}
                >
                  <Tooltip direction="top" opacity={1}>
                    <strong>{recommendation.type}</strong><br />
                    {recommendation.priority}: {recommendation.action}
                  </Tooltip>
                  <Popup>
                    <div className="gridlock-map-popup">
                      <strong>{recommendation.type}</strong>
                      <span>{recommendation.action}</span>
                      <div>{recommendation.expected_improvement}</div>
                      <div>{recommendation.estimated_time_saved}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex flex-wrap items-center gap-3 rounded-lg border border-line bg-graphite/90 px-3 py-2 text-[11px] text-slate-300 shadow-xl backdrop-blur">
            <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-mint" /> Free</span>
            <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-cyan" /> Moderate</span>
            <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber" /> Heavy</span>
            <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-danger" /> Severe</span>
            <span className="border-l border-line pl-3"><Layers3 className="mr-1 inline h-3 w-3" />{layerCount}/4 layers</span>
          </div>
        </div>

        {selected && !compact && (
          <aside className="max-h-[680px] overflow-y-auto border-t border-line bg-panel/95 p-5 xl:border-l xl:border-t-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Active corridor</p>
                <h4 className="mt-1 text-lg font-semibold text-white">{selected.name}</h4>
                <p className="text-sm text-slate-400">{selected.corridor}</p>
              </div>
              <span className="rounded-md px-2.5 py-1 text-sm font-bold text-graphite" style={{ backgroundColor: densityColor(selected.density_score) }}>{selected.density_score}</span>
            </div>

            <p className="mt-2 font-mono text-[11px] text-slate-500">
              {selected.latitude.toFixed(4)}° N · {selected.longitude.toFixed(4)}° E
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {[
                [Gauge, "Speed", `${selected.average_speed} km/h`],
                [Car, "Vehicles", selected.vehicle_count.toLocaleString()],
                [Route, "Occupancy", `${Math.round(selected.occupancy * 100)}%`],
                [selected.trend === "Rising" ? TrendingUp : selected.trend === "Easing" ? TrendingDown : Activity, "Trend", selected.trend]
              ].map(([Icon, label, value]) => {
                const MetricIcon = Icon as typeof Gauge;
                return (
                  <div key={label as string} className="rounded-lg border border-line bg-white/[0.025] p-3">
                    <MetricIcon className="h-4 w-4 text-cyan" />
                    <p className="mt-2 text-[11px] text-slate-500">{label as string}</p>
                    <p className="text-sm font-semibold text-white">{value as string}</p>
                  </div>
                );
              })}
            </div>

            {layers.predictions && selectedPredictions.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Activity className="h-3.5 w-3.5 text-cyan" /> Predictive risk</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {selectedPredictions.map((item) => (
                    <div key={item.horizon_minutes} className="rounded-md border border-line p-2 text-center">
                      <p className="text-[10px] text-slate-500">{item.horizon_minutes} min</p>
                      <p className="mt-1 font-semibold text-amber">{Math.round(item.hotspot_probability * 100)}%</p>
                      <p className="text-[10px] text-slate-500">{item.predicted_density} density</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layers.violations && selectedViolations.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Camera className="h-3.5 w-3.5 text-amber" /> Camera enforcement</p>
                <div className="mt-2 space-y-2">
                  {selectedViolations.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-xs">
                      <span className="text-slate-300">{item.type} · {item.camera_id}</span>
                      <span className="font-semibold text-amber">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {layers.recommendations && selectedRecommendations.map((item) => (
              <div key={item.id} className="mt-5 rounded-lg border border-cyan/20 bg-cyan/[0.06] p-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-cyan"><AlertTriangle className="h-3.5 w-3.5" /> {item.type}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.action}</p>
                <p className="mt-2 text-[11px] text-slate-500">{item.expected_improvement} · {item.estimated_time_saved}</p>
              </div>
            ))}
          </aside>
        )}
      </div>
    </section>
  );
}
