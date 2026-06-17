import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Analytics } from "./pages/Analytics";
import { Dashboard } from "./pages/Dashboard";
import { LiveMap } from "./pages/LiveMap";
import { Predictions } from "./pages/Predictions";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Violations } from "./pages/Violations";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/congestion" element={<LiveMap focus="congestion" />} />
        <Route path="/violations" element={<Violations />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Settings mode="auth" />} />
        <Route path="/profile" element={<Settings mode="profile" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

