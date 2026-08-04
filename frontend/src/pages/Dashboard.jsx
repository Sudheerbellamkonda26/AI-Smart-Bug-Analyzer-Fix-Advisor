import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";
import DashboardCharts from "../components/DashboardCharts";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/history");

      setHistory(response.data.history || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const refreshDashboard = () => {
    fetchHistory();
  };

  // =========================
  // CALCULATE STATS
  // =========================
  const today = new Date().toLocaleDateString();

const todayCount = history.filter(
  (item) =>
    item.timestamp &&
    new Date(item.timestamp).toLocaleDateString() === today
).length;
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
      const severity =
        item.severity?.toLowerCase() || "unknown";

      if (severityCounts[severity] !== undefined) {
        severityCounts[severity]++;
      } else {
        severityCounts.unknown++;
      }

      const component =
        item.component || "Unknown";

      components[component] =
        (components[component] || 0) + 1;
    });

    return {
      total: history.length,
      severityCounts,
      components,
      componentCount: Object.keys(components).length,
      todayCount,
    };
  }, [history]);

  const recentAnalyses = history.slice(0, 5);

  // =========================
  // TREND DATA
  // =========================

  const trendData = history.reduce((acc, item) => {
    if (!item.timestamp) return acc;

    const day = new Date(
      item.timestamp
    ).toLocaleDateString();

    const existing = acc.find(
      (d) => d.day === day
    );

    if (existing) {
      existing.analyses++;
    } else {
      acc.push({
        day,
        analyses: 1,
      });
    }

    return acc;
  }, []);
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

        <div className="flex justify-center items-center h-[80vh]">

          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-950">

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Banner */}

        <div className="mb-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white">

          <h2 className="text-3xl font-bold">
            AI Smart Bug Analyzer
          </h2>

          <p className="mt-2 opacity-90">
            Multi-Agent AI powered defect analysis dashboard.
          </p>

        </div>

        {/* Header */}

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold text-white">
              Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Overview of bug analyses and detected issues.
            </p>

          </div>

          <button
            onClick={refreshDashboard}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {error && (
          <div className="mb-8 bg-red-900 border border-red-700 rounded-xl p-5 text-red-200">
            {error}
          </div>
        )}

        {history.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center mb-8">

            <h2 className="text-2xl font-bold text-white">
              No Analyses Yet
            </h2>

            <p className="text-slate-400 mt-3">
              Submit your first bug report to populate the dashboard.
            </p>

          </div>
        )}
                {/* =========================
            DASHBOARD STAT CARDS
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

  {/* Total */}
  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
    <h3 className="text-slate-400">Total Analyses</h3>
    <p className="text-4xl font-bold text-blue-400">{stats.total}</p>
  </div>

  {/* Critical */}
  <div className="bg-slate-900 rounded-xl p-6 border border-red-800">
    <h3 className="text-slate-400">Critical Bugs</h3>
    <p className="text-4xl font-bold text-red-500">
      {stats.severityCounts.critical}
    </p>
  </div>

  {/* High */}
  <div className="bg-slate-900 rounded-xl p-6 border border-orange-700">
    <h3 className="text-slate-400">High Severity</h3>
    <p className="text-4xl font-bold text-orange-400">
      {stats.severityCounts.high}
    </p>
  </div>

  {/* Components */}
  <div className="bg-slate-900 rounded-xl p-6 border border-purple-700">
    <h3 className="text-slate-400">Components</h3>
    <p className="text-4xl font-bold text-purple-400">
      {stats.componentCount}
    </p>
  </div>

  {/* Today */}
  <div className="bg-slate-900 rounded-xl p-6 border border-green-700">
    <h3 className="text-slate-400">Today's Analyses</h3>
    <p className="text-4xl font-bold text-green-400">
      {stats.todayCount}
    </p>
  </div>

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

                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
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
            DASHBOARD CHARTS
        ========================= */}

        <DashboardCharts
          severityCounts={stats.severityCounts}
          components={stats.components}
          historyData={trendData}
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
                Latest analyzed bug reports
              </p>

            </div>

            <Clock className="text-slate-500" />

          </div>

          <div className="space-y-3">

            {recentAnalyses.length > 0 ? (

              recentAnalyses.map((item, index) => (

                <div
                  key={item.id || index}
                  className="bg-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                >

                  <div>

                    <p className="text-white font-semibold">
                      {item.exception_type || "Unknown Exception"}
                    </p>

                    <p className="text-slate-400 text-sm mt-1">
                      {item.component || "Unknown Component"}
                    </p>

                  </div>

                  <div className="flex items-center gap-3 flex-wrap">

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

              <div className="text-center py-8 text-slate-500">
                No recent analyses available.
              </div>

            )}

          </div>

        </section>
                {/* Footer */}

        <div className="mt-10 text-center text-slate-500 text-sm">
          AI Smart Bug Analyzer & Fix Advisor • Multi-Agent AI Platform • Infosys Springboard Internship
        </div>

        <Footer />

      </main>

    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({ title, value, icon }) {
  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 hover:scale-105 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-white mt-2">
            {value}
          </h2>

        </div>

        <div className="bg-cyan-600 p-4 rounded-xl shadow-lg text-white">
          {icon}
        </div>

      </div>

    </div>

  );
}
/* =========================
   SEVERITY BAR
========================= */

function SeverityBar({
  label,
  value,
  total,
}) {

  const percentage =
    total === 0
      ? 0
      : Math.round((value / total) * 100);

  return (

    <div>

      <div className="flex justify-between items-center mb-2">

        <span className="text-slate-300">
          {label}
        </span>

        <span className="text-cyan-400 font-semibold">
          {value}
        </span>

      </div>

      <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

        <div
          className="h-full bg-cyan-500 rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );
}