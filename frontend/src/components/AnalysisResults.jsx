import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  FileText,
} from "lucide-react";
import {
  generatePDF,
  generateMarkdown,
} from "../utils/reportGenerator";
export default function AnalysisResults({ result }) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;

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
  const copyCode = async () => {
  const code = result.analysis?.fix_recommendation?.code_snippet;

  if (!code) return;

  await navigator.clipboard.writeText(code);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
  return (
    <div className="mt-10 space-y-6">

      {/* Header */}
      {/* Header */}

<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

  <div>
    <h1 className="text-3xl font-bold text-white">
      📊 Analysis Report
    </h1>

    {result.timestamp && (
      <p className="text-slate-400 text-sm mt-2">
        🕒 {result.timestamp}
      </p>
    )}
  </div>

  <div className="flex gap-3">

    <button
      onClick={() => generatePDF(result)}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white font-semibold transition"
    >
      <Download size={18} />
      PDF Report
    </button>
     
     <button
  onClick={() => generateMarkdown(result)}
  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl text-white font-semibold transition"
>
  <FileText size={18} />
  Markdown Report
</button>

  </div>

</div>

      {/* ====================== TRIAGE ====================== */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-blue-400 mb-6">
          🩺 Triage Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Severity</p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white ${severityColor(
                result.analysis?.triage?.severity
              )}`}
            >
              {result.analysis?.triage?.severity || "N/A"}
            </span>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Priority</p>
            <p className="text-lg font-semibold">
              {result.analysis?.triage?.priority || "N/A"}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Component</p>
            <p className="text-lg font-semibold">
              {result.analysis?.triage?.component || "N/A"}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Confidence</p>
            <p className="text-lg font-semibold">
              {result.analysis?.triage?.confidence || "N/A"}
            </p>
          </div>

        </div>

      </div>

      {/* ====================== LOG ANALYSIS ====================== */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-green-400 mb-6">
          📋 Log Analysis
        </h2>

        <div className="space-y-4">

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Exception Type</p>

            <p className="text-white font-semibold">
              {result.analysis?.log_analysis?.exception_type || "N/A"}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Failure Point</p>

            <p className="text-white">
              {result.analysis?.log_analysis?.failure_point || "N/A"}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400">Code Path</p>

            <p className="text-white break-all">
              {result.analysis?.log_analysis?.code_path || "N/A"}
            </p>
          </div>

        </div>

      </div>

      {/* ====================== ROOT CAUSE ====================== */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-red-400 mb-6">
          🧠 Root Cause
        </h2>

        <div className="bg-slate-800 rounded-lg p-5">

          <p className="text-slate-300 leading-8">
            {result.analysis?.root_cause?.root_cause || "N/A"}
          </p>

          <div className="mt-5">

            <span className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm">
              Confidence:{" "}
              {result.analysis?.root_cause?.confidence || "N/A"}
            </span>

          </div>

        </div>

      </div> 
      {/* ====================== FIX RECOMMENDATION ====================== */}
<div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">

  <h2 className="text-2xl font-bold text-cyan-400 mb-6">
    🛠 AI Fix Recommendation
  </h2>

  <div className="space-y-6">

    {/* Summary */}

    <div className="bg-slate-800 rounded-lg p-4">

      <h3 className="text-slate-400 font-semibold">
        Summary
      </h3>

      <p className="text-white mt-2 leading-7">
        {result.analysis?.fix_recommendation?.summary}
      </p>

    </div>

    {/* Recommended Fix */}

    <div className="bg-slate-800 rounded-lg p-4">

      <h3 className="text-slate-400 font-semibold">
        Recommended Fix
      </h3>

      <p className="text-white mt-2 leading-7">
        {result.analysis?.fix_recommendation?.recommended_fix}
      </p>

    </div>

    {/* Confidence */}

    <div>

      <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
        Confidence :
        {" "}
      {(
        (result.analysis?.fix_recommendation?.confidence ?? 0) * 100
      ).toFixed(0)}
        %
      </span>

    </div>

    {/* Steps */}

    <div>

      <h3 className="text-slate-300 font-semibold mb-3">
        Recommended Steps
      </h3>

      <ul className="space-y-2">

        {result.analysis?.fix_recommendation?.steps?.map(
          (step, index) => (
            <li
              key={index}
              className="bg-slate-800 rounded-lg p-3 text-white"
            >
              ✅ {step}
            </li>
          )
        )}

      </ul>

    </div>

    {/* Code */}

    <div>

      <div>

  <div className="flex justify-between items-center mb-3">

    <h3 className="text-slate-300 font-semibold">
      Suggested Code
    </h3>

    <button
      onClick={copyCode}
      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm text-white transition"
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={16} />
          Copy Code
        </>
      )}
    </button>

  </div>

  <pre className="bg-gray-950 text-green-400 rounded-xl p-5 overflow-x-auto border border-slate-700 font-mono text-sm">

    <code>
      {result.analysis?.fix_recommendation?.code_snippet}
    </code>

  </pre>

</div>

    </div>

    {/* Best Practice */}

    <div className="bg-blue-950 border border-blue-700 rounded-lg p-4">

      <h3 className="text-blue-300 font-semibold">
        💡 Best Practice
      </h3>

      <p className="text-slate-200 mt-2">
        {result.analysis?.fix_recommendation?.best_practice}
      </p>

    </div>

  </div>

</div>

{/* ====================== SIMILAR BUGS ====================== */}

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          📚 Similar Bugs ({result.similar_bugs?.length || 0})
        </h2>

        {result.similar_bugs?.length > 0 ? (

          <div className="space-y-6">

            {result.similar_bugs.map((bug, index) => (

              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >

                {/* Top Row */}

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

                  <h3 className="text-xl font-bold text-white">
                    🐞 {bug.bug_id}
                  </h3>

                  <span className="bg-blue-600 px-4 py-1 rounded-full text-white text-sm font-semibold">

                    {((bug.similarity_score ?? 0) * 100).toFixed(1)}% Match

                  </span>

                </div>

                {/* Badges */}

                <div className="mt-5 flex flex-wrap gap-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${severityColor(
                      bug.severity
                    )}`}
                  >
                    {bug.severity}
                  </span>

                  <span className="bg-green-700 px-3 py-1 rounded-full text-sm text-white">
                    {bug.component}
                  </span>

                </div>

                {/* Description */}

                <div className="mt-6">

                  <h4 className="font-semibold text-slate-300">
                    Description
                  </h4>

                  <p className="text-slate-400 mt-2 leading-7">
                    {bug.description || "No description available."}
                  </p>

                </div>

                {/* Solution */}

                <div className="mt-6">

                  <h4 className="font-semibold text-blue-300">
                    💡 Suggested Solution
                  </h4>

                  <p className="text-white mt-2 leading-7">
                    {bug.solution || "No solution available."}
                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center">

            <p className="text-slate-400 text-lg">
              🔍 No similar bugs were found in the knowledge base.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}