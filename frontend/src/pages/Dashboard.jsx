import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
} from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";
import DashboardCharts from "../components/DashboardCharts";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH HISTORY
  // =========================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/history");

        setHistory(response.data.history || []);
      } catch (err) {
        console.error("Dashboard history error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const stats = useMemo(() => {
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0,
    };

    const components = {};

    history.forEach((item) => {
      const severity = item.severity?.toLowerCase() || "unknown";

      if (severityCounts[severity] !== undefined) {
        severityCounts[severity] += 1;
      } else {
        severityCounts.unknown += 1;
      }

      const component = item.component || "Unknown";

      components[component] = (components[component] || 0) + 1;
    });

    return {
      total: history.length,
      severityCounts,
      components,
    };
  }, [history]);

  // Latest 5 analyses
  const recentAnalyses = history.slice(0, 5);

  // =========================
  // SEVERITY BADGE
  // =========================

  const severityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-600";

      case "high":
        return "bg-orange-500";

      case "medium":
        return "bg-yellow-500 text-black";

      case "low":
        return "bg-green-600";

      default:
        return "bg-slate-600";
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

          <p className="text-slate-400 mt-4">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Overview of bug analyses and detected issues.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-8 bg-red-950 border border-red-800 text-red-300 rounded-xl p-5">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS CARDS
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Total Analyses"
            value={stats.total}
            icon={<Activity size={24} />}
          />

          <StatCard
            title="Critical"
            value={stats.severityCounts.critical}
            icon={<AlertTriangle size={24} />}
          />

          <StatCard
            title="High Severity"
            value={stats.severityCounts.high}
            icon={<Bug size={24} />}
          />

          <StatCard
            title="Low Severity"
            value={stats.severityCounts.low}
            icon={<CheckCircle size={24} />}
          />

        </div>

        {/* =========================
            DISTRIBUTIONS
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Severity Distribution */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
              Severity Distribution
            </h2>

            <div className="space-y-5">

              <SeverityBar
                label="Critical"
                value={stats.severityCounts.critical}
                total={stats.total}
              />

              <SeverityBar
                label="High"
                value={stats.severityCounts.high}
                total={stats.total}
              />

              <SeverityBar
                label="Medium"
                value={stats.severityCounts.medium}
                total={stats.total}
              />

              <SeverityBar
                label="Low"
                value={stats.severityCounts.low}
                total={stats.total}
              />

            </div>

          </section>

          {/* Component Distribution */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
              Component Distribution
            </h2>

            <div className="space-y-4">

              {Object.entries(stats.components)
                .sort((a, b) => b[1] - a[1])
                .map(([component, count]) => (

                  <div
                    key={component}
                    className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3"
                  >
                    <span className="text-slate-300">
                      {component}
                    </span>

                    <span className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
                      {count}
                    </span>
                  </div>

                ))}

              {Object.keys(stats.components).length === 0 && (
                <p className="text-slate-500">
                  No component data available.
                </p>
              )}

            </div>

          </section>

        </div>

        {/* =========================
            INTERACTIVE CHARTS
        ========================= */}

        <DashboardCharts
          severityCounts={stats.severityCounts}
          components={stats.components}
        />

        {/* =========================
            RECENT ANALYSES
        ========================= */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-xl font-bold text-white">
                Recent Analyses
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Latest bug analysis activity
              </p>
            </div>

            <Clock className="text-slate-500" />

          </div>

          <div className="space-y-3">

            {recentAnalyses.length > 0 ? (

              recentAnalyses.map((item, index) => (

                <div
                  key={item.id || `${item.timestamp}-${index}`}
                  className="bg-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>

                    <p className="text-white font-semibold">
                      {item.exception_type || "Unknown Exception"}
                    </p>

                    <p className="text-slate-400 text-sm mt-1">
                      {item.component || "Unknown Component"}
                    </p>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${severityBadge(
                        item.severity
                      )}`}
                    >
                      {item.severity || "Unknown"}
                    </span>

                    <span className="text-slate-500 text-sm">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "No timestamp"}
                    </span>

                  </div>

                </div>

              ))

            ) : (

              <p className="text-slate-500 text-center py-6">
                No recent analyses available.
              </p>

            )}

          </div>

        </section>

      </main>
    </div>
  );
}

// =========================
// STAT CARD
// =========================

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {value}
          </p>
        </div>

        <div className="bg-slate-800 text-blue-400 p-3 rounded-xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

// =========================
// SEVERITY BAR
// =========================

function SeverityBar({ label, value, total }) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="text-slate-300">
          {label}
        </span>

        <span className="text-slate-400 text-sm">
          {value} ({percentage}%)
        </span>

      </div>

      <div className="w-full bg-slate-800 rounded-full h-3">

        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}