import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertTriangle,
  Bug,
  Cpu,
  Download,
  FileText,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";

export default function AnalysisResults({ result }) {
  if (!result) return null;

  const {
    submitted_bug,
    analysis,
    similar_bugs = [],
  } = result;

  const triage = analysis?.triage || {};
  const logAnalysis = analysis?.log_analysis || {};
  const rootCause = analysis?.root_cause || {};
  const duplicateDetection =
    analysis?.duplicate_detection || {};
  const fixRecommendation =
    analysis?.fix_recommendation || {};

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

  const downloadReport = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Smart Bug Analyzer Report", 15, 20);

  doc.setFontSize(12);
  doc.text(`Severity: ${triage.severity || "-"}`, 15, 35);
  doc.text(`Priority: ${triage.priority || "-"}`, 15, 45);
  doc.text(`Component: ${triage.component || "-"}`, 15, 55);

  autoTable(doc, {
    startY: 70,
    head: [["Section", "Details"]],
    body: [
      ["Submitted Bug", submitted_bug || "-"],
      ["Exception", logAnalysis.exception_type || "-"],
      ["Failure Point", logAnalysis.failure_point || "-"],
      ["Root Cause", rootCause.root_cause || "-"],
      [
        "Recommendation",
        fixRecommendation.recommendation || "-"
      ],
    ],
  });

  doc.save("Bug_Report.pdf");
};
  return (
    <div className="space-y-8 mt-10">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">

        <div>

          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">

            <Sparkles
              size={34}
              className="text-cyan-400"
            />

            Analysis Report

          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            AI Generated Bug Investigation
          </p>

        </div>

        <button
          onClick={downloadReport}
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >

          <Download size={20} />

          Download Report

        </button>

      </div>

      {/* ================= SUBMITTED BUG ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-5">

          <FileText
            size={30}
            className="text-cyan-400"
          />

          Submitted Bug

        </h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

          <p className="text-slate-300 whitespace-pre-wrap leading-8">

            {submitted_bug}

          </p>

        </div>

      </div>
            {/* ================= TRIAGE ANALYSIS ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-cyan-500 transition-all duration-300">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">

          <ShieldAlert
            size={30}
            className="text-orange-400"
          />

          Triage Analysis

        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Severity
            </p>

            <span
              className={`inline-block px-5 py-2 rounded-full font-semibold text-white ${severityColor(
                triage.severity
              )}`}
            >
              {triage.severity || "Unknown"}
            </span>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Priority
            </p>

            <p className="text-2xl font-bold text-white">

              {triage.priority || "N/A"}

            </p>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Component
            </p>

            <p className="text-xl text-white">

              {triage.component || "Unknown"}

            </p>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Confidence
            </p>

            <p className="text-cyan-400 text-xl font-bold">

              {((triage.confidence || 0) * 100).toFixed(1)}%

            </p>

          </div>

        </div>

        <div className="mt-8">

          <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
            Reasoning
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

            <p className="text-slate-300 leading-8">

              {triage.reasoning || "No reasoning available."}

            </p>

          </div>

        </div>

      </div>
            {/* ================= LOG ANALYSIS ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-cyan-500 transition-all duration-300">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">

          <Cpu
            size={30}
            className="text-blue-400"
          />

          Log Analysis

        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Exception Type
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

              <p className="text-white text-lg">

                {logAnalysis.exception_type || "Not Available"}

              </p>

            </div>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Failure Point
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">

              <p className="text-white text-lg">

                {logAnalysis.failure_point || "Not Available"}

              </p>

            </div>

          </div>

        </div>

        <div className="mt-8">

          <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
            Stack Trace Summary
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

            <p className="text-slate-300 leading-8">

              {logAnalysis.summary || "No summary available."}

            </p>

          </div>

        </div>

      </div>

      {/* ================= ROOT CAUSE ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-red-500 transition-all duration-300">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">

          <Bug
            size={30}
            className="text-red-400"
          />

          Root Cause Analysis

        </h2>

        <div className="space-y-6">

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
              Root Cause
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <p className="text-slate-300 leading-8">

                {rootCause.root_cause || "No root cause identified."}

              </p>

            </div>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
              Confidence Score
            </p>

            <div className="flex items-center gap-4">

              <span className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold">

                {((rootCause.confidence || 0) * 100).toFixed(1)}%

              </span>

              <div className="flex-1 h-3 bg-slate-700 rounded-full">

                <div
                  className="h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                  style={{
                    width: `${(rootCause.confidence || 0) * 100}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* ================= SIMILAR HISTORICAL BUGS ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-cyan-500 transition-all duration-300">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

          <h2 className="text-3xl font-bold text-white flex items-center gap-3">

            <AlertTriangle
              size={30}
              className="text-yellow-400"
            />

            Similar Historical Bugs

          </h2>

          <span className="bg-cyan-600 text-white px-4 py-2 rounded-full font-semibold">

            {similar_bugs.length} Found

          </span>

        </div>

        {similar_bugs.length > 0 ? (

          <div className="space-y-6">

            {similar_bugs.map((bug, index) => (

              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300"
              >

                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                  <div>

                    <h3 className="text-2xl font-bold text-cyan-400">

                      {bug.title}

                    </h3>

                    <p className="text-slate-400 mt-1">

                      Historical Bug #{bug.bug_id}

                    </p>

                  </div>

                  <span className="bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold">

                    {bug.similarity}%

                  </span>

                </div>

                <div className="mt-6">

                  <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
                    Description
                  </p>

                  <p className="text-slate-300 leading-8">

                    {bug.description}

                  </p>

                </div>

                <div className="flex flex-wrap gap-3 mt-6">

                  <span className="bg-red-600 text-white px-4 py-2 rounded-full">

                    {bug.severity}

                  </span>

                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full">

                    {bug.component}

                  </span>

                </div>

                <div className="mt-8">

                  <div className="flex justify-between mb-2">

                    <span className="text-slate-400">

                      Similarity Score

                    </span>

                    <span className="text-white font-semibold">

                      {bug.similarity}%

                    </span>

                  </div>

                  <div className="w-full h-3 bg-slate-700 rounded-full">

                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{
                        width: `${bug.similarity}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="mt-8 bg-slate-950 border border-slate-700 rounded-xl p-5">

                  <h4 className="text-green-400 font-bold text-lg mb-3">

                    Previous Resolution

                  </h4>

                  <p className="text-slate-300 leading-8">

                    {bug.resolution}

                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-slate-950 border border-slate-700 rounded-xl p-10 text-center">

            <AlertTriangle
              size={48}
              className="mx-auto text-yellow-400 mb-4"
            />

            <h3 className="text-2xl font-bold text-white">

              No Similar Bugs Found

            </h3>

            <p className="text-slate-400 mt-3">

              No matching historical defects were found in the knowledge base.

            </p>

          </div>

        )}

      </div>
            {/* ================= DUPLICATE DETECTION ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-cyan-500 transition-all duration-300">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">

          <Bug
            size={30}
            className="text-cyan-400"
          />

          Duplicate Detection

        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Duplicate Count
            </p>

            <p className="text-4xl font-bold text-cyan-400">

              {duplicateDetection.duplicate_count || 0}

            </p>

          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-2">
              Status
            </p>

            <p className="text-green-400 text-xl font-bold">

              Analysis Complete

            </p>

          </div>

        </div>

      </div>

      {/* ================= AI FIX RECOMMENDATION ================= */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-lg hover:border-green-500 transition-all duration-300">

        <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-8">

          <Wrench
            size={30}
            className="text-green-400"
          />

          AI Fix Recommendation

        </h2>

        <div className="space-y-8">

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
              Recommendation
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              <p className="text-slate-300 leading-8">

                {fixRecommendation.recommendation ||
                  "No recommendation available."}

              </p>

            </div>

          </div>

          <div>

            <div className="flex justify-between mb-3">

              <span className="text-slate-400">
                AI Confidence
              </span>

              <span className="text-cyan-400 font-bold">

                {fixRecommendation.confidence || 0}%

              </span>

            </div>

            <div className="w-full h-4 bg-slate-700 rounded-full">

              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-500 to-cyan-500"
                style={{
                  width: `${fixRecommendation.confidence || 0}%`,
                }}
              />

            </div>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
              Suggested Code Changes
            </p>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto whitespace-pre-wrap text-green-300 text-sm leading-7">

{fixRecommendation.code_changes ||
"No code changes suggested."}

            </pre>

          </div>

          <div>

            <p className="uppercase tracking-wider text-xs text-slate-500 font-semibold mb-3">
              Best Practices
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

              {Array.isArray(fixRecommendation.best_practices) &&
              fixRecommendation.best_practices.length > 0 ? (

                <ul className="list-disc list-inside space-y-3 text-slate-300">

                  {fixRecommendation.best_practices.map((item, index) => (

                    <li key={index}>{item}</li>

                  ))}

                </ul>

              ) : (

                <p className="text-slate-400">

                  No best practices available.

                </p>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-lg">

        <Sparkles
          size={42}
          className="mx-auto text-cyan-400 mb-4"
        />

        <h2 className="text-3xl font-bold text-white">

          Analysis Completed Successfully

        </h2>

        <p className="text-slate-400 mt-3 text-lg max-w-3xl mx-auto">

          This report was generated using the
          <span className="text-cyan-400 font-semibold">
            {" "}AI Smart Bug Analyzer & Fix Advisor{" "}
          </span>
          powered by Multi-Agent AI, Retrieval-Augmented Generation (RAG),
          Semantic Search, and Historical Bug Analysis.

        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8">

          <span className="bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold">
            AI Powered
          </span>

          <span className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold">
            Multi-Agent
          </span>

          <span className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold">
            RAG Enabled
          </span>

          <span className="bg-orange-600 text-white px-5 py-2 rounded-full font-semibold">
            Semantic Search
          </span>

        </div>

      </div>

    </div>
  );
}