import { useEffect, useState } from "react";
import API from "../services/api";
import { Search, Clock, Bug, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/history");

      setHistory(response.data.history || []);
    } catch (error) {
      console.error("History error:", error);
      setError("Unable to load analysis history.");
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (severity) => {
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

  const filteredHistory = history.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.exception_type?.toLowerCase().includes(query) ||
      item.component?.toLowerCase().includes(query) ||
      item.severity?.toLowerCase().includes(query) ||
      item.priority?.toLowerCase().includes(query) ||
      item.root_cause?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Analysis History
            </h1>

            <p className="text-slate-400 mt-2">
              Browse and search previously analyzed bugs.
            </p>
          </div>

          {/* Search */}

          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exception, component, severity, root cause..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          {!loading && !error && (
            <p className="text-slate-400 mb-5">
              Showing {filteredHistory.length} of {history.length} analyses
            </p>
          )}

          {loading && (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-slate-400 mt-4">
                Loading analysis history...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl p-5 text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">

              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition"
                >

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div className="flex items-center gap-3">

                      <div className="bg-slate-800 p-3 rounded-lg">
                        <Bug className="text-blue-400" size={22} />
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {item.exception_type || "Unknown Exception"}
                        </h2>

                        <p className="text-slate-400 text-sm">
                          {item.component || "Unknown Component"}
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${severityColor(
                          item.severity
                        )}`}
                      >
                        {item.severity || "Unknown"}
                      </span>

                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {item.priority || "N/A"}
                      </span>

                    </div>

                  </div>

                  <div className="mt-5 bg-slate-800 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">
                      Root Cause
                    </p>

                    <p className="text-slate-200">
                      {item.root_cause || "No root cause available."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock size={16} />

                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "Timestamp unavailable"}
                    </div>

                   <Link
                     to={`/analysis/${item.id}`}
                     className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                  >
                   <div className="flex gap-3">

                   <Link
                     to={`/analysis/${item.id}`}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                   >
                    View
                  </Link>

                  <button
                    onClick={() => deleteAnalysis(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                 >
                  <Trash2 size={16} />
                   Delete
                 </button>

                 </div>
                 </Link>

                  </div>

                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center bg-slate-900 border border-slate-800 rounded-xl py-16">
                  <Search
                    size={40}
                    className="mx-auto text-slate-600 mb-4"
                  />

                  <p className="text-slate-400">
                    No matching analyses found.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}