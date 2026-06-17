import type { AnalyticsPoint, DashboardSummary, Prediction, Recommendation, RoadSegment, Violation } from "../services/api";

export const fallbackSummary: DashboardSummary = {
  traffic_score: 34,
  average_speed: 21.4,
  active_incidents: 7,
  violations_today: 1462,
  emergency_alerts: 1,
  active_vehicles: 9624,
  live_cameras: 142,
  prediction_summary: "3 corridors need intervention in the next 30 minutes",
  generated_at: new Date().toISOString()
};

export const fallbackRoads: RoadSegment[] = [
  { id: "silk-board", name: "Silk Board Junction", corridor: "ORR - Hosur Road", latitude: 12.9177, longitude: 77.6238, vehicle_count: 1680, average_speed: 14.2, occupancy: 0.91, density_score: 91, congestion_level: "Severe", trend: "Rising" },
  { id: "marathahalli", name: "Marathahalli Bridge", corridor: "Outer Ring Road", latitude: 12.9569, longitude: 77.7011, vehicle_count: 1410, average_speed: 17.8, occupancy: 0.84, density_score: 84, congestion_level: "Heavy", trend: "Stable" },
  { id: "hebbal", name: "Hebbal Flyover", corridor: "Airport Corridor", latitude: 13.0358, longitude: 77.597, vehicle_count: 1180, average_speed: 19.1, occupancy: 0.79, density_score: 79, congestion_level: "Heavy", trend: "Rising" },
  { id: "koramangala", name: "Koramangala 100 ft Road", corridor: "Inner Ring Road", latitude: 12.9352, longitude: 77.6245, vehicle_count: 830, average_speed: 27.4, occupancy: 0.58, density_score: 58, congestion_level: "Moderate", trend: "Easing" }
];

export const fallbackRecommendations: Recommendation[] = [
  { id: "rec-1", type: "Signal Optimization", priority: "Critical", location: "Silk Board Junction", action: "Increase green duration by 18 seconds for outbound flow.", confidence_score: 0.93, expected_improvement: "24% reduction in queue length", estimated_time_saved: "10 mins/vehicle" },
  { id: "rec-2", type: "Diversion", priority: "High", location: "Marathahalli Bridge", action: "Activate diversion boards and route traffic via HAL Airport Road.", confidence_score: 0.88, expected_improvement: "19% reduction in queue length", estimated_time_saved: "8 mins/vehicle" }
];

export const fallbackViolations: Violation[] = [
  { id: "vio-1", type: "Helmet", location: "Tin Factory", camera_id: "BLR-CAM-331", confidence: 0.91, count: 44, priority: "High", detected_at: new Date().toISOString() },
  { id: "vio-2", type: "Signal Jump", location: "KR Puram Junction", camera_id: "BLR-CAM-447", confidence: 0.88, count: 23, priority: "Critical", detected_at: new Date().toISOString() },
  { id: "vio-3", type: "Illegal Parking", location: "Majestic", camera_id: "BLR-CAM-812", confidence: 0.84, count: 31, priority: "Medium", detected_at: new Date().toISOString() }
];

export const fallbackPredictions: Prediction[] = fallbackRoads.flatMap((road) =>
  [15, 30, 60].map((horizon) => ({
    location: road.name,
    horizon_minutes: horizon,
    predicted_density: Math.min(100, road.density_score + horizon / 8),
    hotspot_probability: Math.min(0.98, road.density_score / 105),
    expected_speed: Math.max(6, road.average_speed - horizon * 0.05),
    confidence: horizon === 60 ? 0.74 : 0.86
  }))
);

export const fallbackAnalytics: AnalyticsPoint[] = [
  { label: "06:00", traffic_volume: 21000, average_speed: 34, violations: 140, incidents: 4 },
  { label: "09:00", traffic_volume: 52000, average_speed: 16, violations: 420, incidents: 14 },
  { label: "12:00", traffic_volume: 31000, average_speed: 26, violations: 230, incidents: 7 },
  { label: "15:00", traffic_volume: 36000, average_speed: 24, violations: 260, incidents: 9 },
  { label: "18:00", traffic_volume: 54800, average_speed: 14, violations: 510, incidents: 17 },
  { label: "21:00", traffic_volume: 28000, average_speed: 30, violations: 180, incidents: 5 }
];

