import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import API from "../services/api";
import AnalysisResults from "./AnalysisResults";
import LoadingSpinner from "./LoadingSpinner";
import Toast from "./Toast";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB

export default function UploadCard() {
  const [bugReport, setBugReport] = useState("");
const [selectedFile, setSelectedFile] = useState(null);
const [fileName, setFileName] = useState("");

const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [showToast, setShowToast] = useState(false);
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log("File:", file.name);
    console.log("Size:", file.size);

    if (file.size > MAX_FILE_SIZE) {
      alert("❌ File size should not exceed 200 MB.");
      e.target.value = "";
      setSelectedFile(null);
      setFileName("");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  // Send data to backend
  const handleAnalyze = async () => {
    if (!bugReport.trim() && !selectedFile) {
      alert("Please enter a bug report or upload a file.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();

      formData.append("bug_text", bugReport);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await API.post("/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("========== API RESPONSE ==========");
      console.log(response.data);

      if (!response.data.analysis) {
        alert("No analysis returned from backend.");
        return;
      }

      setResult({
        ...response.data,
        timestamp: new Date().toLocaleString(),
      });
      setShowToast(true);

      console.log("RESULT STATE:");
console.log({
  ...response.data,
  timestamp: new Date().toLocaleString(),
});

      setTimeout(() => {
      setShowToast(false);
      }, 3000);

    } catch (error) {
      console.log("========== ERROR ==========");
      console.log(error);

      if (error.response) {
        alert(error.response.data.detail || "Backend Error");
      } else if (error.request) {
        alert("No response received from backend.");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setBugReport("");
    setSelectedFile(null);
    setFileName("");
    setResult(null);

    const fileInput = document.getElementById("bug-file");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
      {showToast && (
  <Toast message="Analysis completed successfully!" />
)}

      <h2 className="text-3xl font-bold text-white mb-2">
        Submit Bug Report
      </h2>

      <p className="text-slate-400 mb-6">
        Paste your bug description or upload a log file.
      </p>

      <textarea
        rows={8}
        value={bugReport}
        onChange={(e) => setBugReport(e.target.value)}
        placeholder="Paste stack trace, exception or bug description..."
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-6 border-2 border-dashed border-blue-500 rounded-xl p-8 text-center hover:bg-slate-800 transition">

        <Upload
          className="mx-auto text-blue-500 mb-4"
          size={45}
        />

        <h3 className="text-xl font-semibold text-white">
          Drag & Drop or Click to Upload
        </h3>

        <p className="text-slate-400 mt-2">
          Supported Formats:
          <span className="text-white font-medium">
            {" "}
            .txt, .log, .pdf
          </span>
        </p>

        <p className="text-slate-400 text-sm mt-1">
          Maximum File Size:
          <span className="text-red-400 font-semibold">
            {" "}
            200 MB
          </span>
        </p>

        <p className="text-yellow-400 text-xs mt-2">
          ⚠ Files larger than 200 MB will be rejected.
        </p>

        <input
          id="bug-file"
          type="file"
          accept=".txt,.log,.pdf"
          onChange={handleFileChange}
          className="mt-5 text-white"
        />

        {fileName && (
          <div className="mt-5 flex justify-center items-center gap-2 text-green-400">
            <FileText size={18} />
            <span>{fileName}</span>
          </div>
        )}

      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl py-4 text-lg font-semibold text-white transition flex justify-center items-center gap-2"
      >
        {loading && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}

        {loading ? "Analyzing Bug..." : "🚀 Analyze Bug"}
      </button>

      {loading ? (
  <LoadingSpinner />
) : (
  result && <AnalysisResults result={result} />
)}

      <button
        onClick={handleReset}
        className="w-full mt-4 bg-slate-700 hover:bg-slate-600 rounded-xl py-3 text-white font-semibold transition"
      >
        🔄 Reset Analysis
      </button>

    </div>
  );
}