import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { AnalyticsPoint } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend);

export function TrendChart({ data, mode = "line" }: { data: AnalyticsPoint[]; mode?: "line" | "bar" }) {
  const chartData = {
    labels: data.map((point) => point.label),
    datasets: [
      {
        label: mode === "line" ? "Average speed" : "Traffic volume",
        data: data.map((point) => (mode === "line" ? point.average_speed : point.traffic_volume)),
        borderColor: "#55d8ff",
        backgroundColor: "rgba(85, 216, 255, 0.3)",
        tension: 0.35
      }
    ]
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.1)" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.1)" } }
    }
  };

  return <div className="h-72">{mode === "line" ? <Line data={chartData} options={options} /> : <Bar data={chartData} options={options} />}</div>;
}

