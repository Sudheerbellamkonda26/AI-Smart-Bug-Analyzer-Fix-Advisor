import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAnalysisPDF(result) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("AI Smart Bug Analyzer", 14, 18);

  doc.setFontSize(12);
  doc.text("Bug Analysis Report", 14, 26);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    34
  );

  autoTable(doc, {
    startY: 42,
    head: [["Field", "Value"]],
    body: [
      ["Severity", result.analysis?.triage?.severity || "-"],
      ["Priority", result.analysis?.triage?.priority || "-"],
      ["Component", result.analysis?.triage?.component || "-"],
      ["Exception", result.analysis?.log_analysis?.exception_type || "-"],
      ["Failure Point", result.analysis?.log_analysis?.failure_point || "-"],
    ],
  });

  let y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text("Root Cause", 14, y);

  y += 8;

  doc.setFontSize(11);

  doc.text(
    result.analysis?.root_cause?.root_cause || "-",
    14,
    y,
    {
      maxWidth: 180,
    }
  );

  y += 25;

  doc.setFontSize(14);
  doc.text("AI Recommendation", 14, y);

  y += 8;

  doc.setFontSize(11);

  doc.text(
    result.analysis?.fix_recommendation?.recommendation || "-",
    14,
    y,
    {
      maxWidth: 180,
    }
  );

  doc.save("AI_Bug_Analysis_Report.pdf");
}