import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";
import AnalysisResults from "../components/AnalysisResults";
import { exportAnalysisPDF } from "../utils/exportPDF";

export default function AnalysisDetails() {
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/history/${id}`);

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />

        <div className="max-w-6xl mx-auto p-8">

          <div className="bg-red-900 border border-red-700 rounded-xl p-6 text-white">
            {error}
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <Navbar />

      <div className="max-w-7xl mx-auto p-8">

        {/* Back Button */}

        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={18} />
          Back to History
        </Link>

        {/* Page Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white">
            Bug Analysis Report
          </h1>

          <p className="text-slate-400 mt-2">
            Complete AI-generated analysis of the selected bug report.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">

            <span className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg">
              Analysis ID: {id}
            </span>

            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              AI Smart Bug Analyzer
            </span>

          </div>

        </div>

        {/* Action Buttons */}

        <div className="flex flex-wrap gap-4 mb-8">

          <button
            onClick={() => exportAnalysisPDF(result)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Download PDF
          </button>

          <button
            onClick={() => {
              if (result) {
                navigator.clipboard.writeText(
                  JSON.stringify(result, null, 2)
                );
                toast.success("Analysis copied to clipboard!");
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            Copy JSON
          </button>

        </div>

        {/* Analysis Results */}

        <AnalysisResults result={result} />

      </div>

    </div>
  );
}