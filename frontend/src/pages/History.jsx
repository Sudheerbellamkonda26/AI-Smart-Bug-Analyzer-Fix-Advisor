import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import {
  Search,
  Clock,
  Bug,
  Trash2,
  Eye,
  Copy,
  Download,
} from "lucide-react";

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
    } catch (err) {
      console.error(err);

      setError("Unable to load analysis history.");

      toast.error("Unable to load analysis history.");
    } finally {
      setLoading(false);
    }
  };

  const copyReport = async (item) => {
    const report = `
Exception : ${item.exception_type || "-"}
Severity  : ${item.severity || "-"}
Priority  : ${item.priority || "-"}
Component : ${item.component || "-"}

Root Cause:
${item.root_cause || "-"}

Timestamp:
${item.timestamp || "-"}
`;

    try {
      await navigator.clipboard.writeText(report);

      toast.success("Report copied!");
    } catch {
      toast.error("Unable to copy report.");
    }
  };

  const exportPDF = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Bug Analysis Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Exception : ${item.exception_type || "-"}`, 20, 40);
    doc.text(`Severity : ${item.severity || "-"}`, 20, 50);
    doc.text(`Priority : ${item.priority || "-"}`, 20, 60);
    doc.text(`Component : ${item.component || "-"}`, 20, 70);

    doc.text("Root Cause:", 20, 90);

    const lines = doc.splitTextToSize(
      item.root_cause || "-",
      170
    );

    doc.text(lines, 20, 100);

    doc.save("Analysis_Report.pdf");
  };

  const deleteAnalysis = async (id) => {
    const confirmed = window.confirm(
      "Delete this analysis?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/history/${id}`);

      toast.success("Analysis deleted.");

      fetchHistory();
    } catch (err) {
      console.error(err);

      toast.error("Unable to delete analysis.");
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

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-white">
          Analysis History
        </h1>

        <p className="text-slate-400 mt-2">
          Browse previous bug analyses.
        </p>

        <div className="relative mt-8 mb-8">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-cyan-500 transition"
          />

        </div>

        {loading && (
          <div className="text-center text-slate-400 py-20">
            Loading...
          </div>
        )}

        {error && (
          <div className="bg-red-900 p-5 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-5">
            
            <div className="flex justify-between items-center">

              <h2 className="text-lg font-semibold text-slate-300">

                Recent Analyses

              </h2>

              <p className="text-slate-500">

                {filteredHistory.length}{" "}
                {filteredHistory.length === 1
                  ? "entry"
                  : "entries"}

              </p>


          </div>
                      {filteredHistory.map((item) => (

              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300"
              >

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">

                  <div className="flex items-center gap-4">

                    <div className="bg-slate-800 p-3 rounded-xl">

                      <Bug
                        size={24}
                        className="text-cyan-400"
                      />

                    </div>

                    <div>

                      <h2 className="text-xl font-bold text-white">

                        {item.exception_type || "Unknown Exception"}

                      </h2>

                      <p className="text-slate-400">

                        {item.component || "Unknown Component"}

                      </p>

                    </div>

                  </div>

                  <div className="flex gap-2 flex-wrap">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${severityColor(
                        item.severity
                      )}`}
                    >
                      {item.severity || "Unknown"}
                    </span>

                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">

                      {item.priority || "N/A"}

                    </span>

                  </div>

                </div>

                <div className="mt-6 bg-slate-800 rounded-xl p-5">

                  <p className="text-slate-400 text-sm mb-2">

                    Root Cause

                  </p>

                  <p className="text-slate-200">

                    {item.root_cause || "No root cause available."}

                  </p>

                </div>

                <div className="mt-5 flex flex-col lg:flex-row justify-between lg:items-center gap-5">

                  <div className="flex items-center gap-2 text-slate-500 text-sm">

                    <Clock size={16} />

                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString()
                      : "Timestamp unavailable"}

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      to={`/analysis/${item.id}`}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
                    >

                      <Eye size={16} />

                      View

                    </Link>

                    <button
                      onClick={() => copyReport(item)}
                      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg text-white transition"
                    >

                      <Copy size={16} />

                      Copy

                    </button>

                    <button
                      onClick={() => exportPDF(item)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition"
                    >

                      <Download size={16} />

                      PDF

                    </button>

                    <button
                      onClick={() => deleteAnalysis(item.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
                    >

                      <Trash2 size={16} />

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            ))}

            {filteredHistory.length === 0 && (

              <div className="bg-slate-900 border border-slate-800 rounded-2xl py-20 text-center">

                <Search
                  size={48}
                  className="mx-auto text-slate-600 mb-5"
                />

                <h2 className="text-2xl font-bold text-white">

                  No Analysis Found

                </h2>

                <p className="text-slate-400 mt-3">

                  Try another search keyword.

                </p>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );
}