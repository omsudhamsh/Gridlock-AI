import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 8000
});

export interface DashboardSummary {
  traffic_score: number;
  average_speed: number;
  active_incidents: number;
  violations_today: number;
  emergency_alerts: number;
  active_vehicles: number;
  live_cameras: number;
  prediction_summary: string;
  generated_at: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  corridor: string;
  latitude: number;
  longitude: number;
  vehicle_count: number;
  average_speed: number;
  occupancy: number;
  density_score: number;
  congestion_level: string;
  trend: string;
}

export interface Recommendation {
  id: string;
  type: string;
  priority: string;
  location: string;
  action: string;
  confidence_score: number;
  expected_improvement: string;
  estimated_time_saved: string;
}

export interface Violation {
  id: string;
  type: string;
  location: string;
  camera_id: string;
  confidence: number;
  count: number;
  priority: string;
  detected_at: string;
}

export interface Prediction {
  location: string;
  horizon_minutes: number;
  predicted_density: number;
  hotspot_probability: number;
  expected_speed: number;
  confidence: number;
}

export interface AnalyticsPoint {
  label: string;
  traffic_volume: number;
  average_speed: number;
  violations: number;
  incidents: number;
}

export const gridlockApi = {
  summary: async () => (await api.get<DashboardSummary>("/api/dashboard/summary")).data,
  roads: async () => (await api.get<RoadSegment[]>("/api/traffic/segments")).data,
  recommendations: async () => (await api.get<Recommendation[]>("/api/intelligence/recommendations")).data,
  predictions: async () => (await api.get<Prediction[]>("/api/intelligence/predictions")).data,
  violations: async () => (await api.get<Violation[]>("/api/violations")).data,
  analytics: async () => (await api.get<AnalyticsPoint[]>("/api/analytics/traffic-trends")).data
};

