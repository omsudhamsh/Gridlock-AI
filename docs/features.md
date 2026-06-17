# Feature Documentation

## Dashboard

Shows traffic score, average speed, active vehicles, live camera count, incidents, violations, emergency alerts, predictions, and high-priority recommendations.

## Live Traffic Map

The current prototype uses a schematic density layer for monitored Bengaluru corridors. It is designed to be replaced by Leaflet or MapLibre once base maps and geospatial tiles are configured.

## Decision Recommendation Engine

Recommendations include action type, priority, location, confidence score, expected improvement, and estimated time saved.

## AI Roadmap

- Vehicle detection: YOLOv11 Nano.
- Traffic density: vehicle count, occupancy, speed, density score, congestion level.
- Prediction: 15, 30, and 60 minute congestion horizons.
- Violations: helmet, triple riding, wrong lane, illegal parking, signal jump, no seatbelt, emergency lane blocking.

