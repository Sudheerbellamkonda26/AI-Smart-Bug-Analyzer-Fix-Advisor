import { jsPDF } from "jspdf";

export const generatePDF = (result) => {
  const doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AI Smart Bug Analyzer & Fix Advisor", 20, y);

  y += 12;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Generated: ${result.timestamp || "N/A"}`, 20, y);

  y += 15;

  // ---------------- TRIAGE ----------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Triage Analysis", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Severity: ${result.analysis.triage.severity}`,
    20,
    y
  );

  y += 7;

  doc.text(
    `Priority: ${result.analysis.triage.priority}`,
    20,
    y
  );

  y += 7;

  doc.text(
    `Component: ${result.analysis.triage.component}`,
    20,
    y
  );

  y += 15;

  // ---------------- LOG ----------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Log Analysis", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Exception: ${result.analysis.log_analysis.exception_type}`,
    20,
    y
  );

  y += 7;

  doc.text(
    `Failure Point: ${result.analysis.log_analysis.failure_point}`,
    20,
    y
  );

  y += 15;

  // ---------------- ROOT CAUSE ----------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Root Cause", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  const rootCause = doc.splitTextToSize(
    result.analysis.root_cause.root_cause,
    170
  );

  doc.text(rootCause, 20, y);

  y += rootCause.length * 7 + 10;

  // ---------------- FIX ----------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("AI Fix Recommendation", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  const fix = doc.splitTextToSize(
    result.analysis.fix_recommendation.recommended_fix,
    170
  );

  doc.text(fix, 20, y);

  y += fix.length * 7 + 8;

  doc.text("Recommended Steps:", 20, y);

  y += 7;

  result.analysis.fix_recommendation.steps.forEach((step) => {
    doc.text(`• ${step}`, 25, y);
    y += 7;
  });

  y += 8;

  // ---------------- SIMILAR BUGS ----------------

  doc.setFont("helvetica", "bold");

  doc.text("Similar Bugs", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  result.similar_bugs.forEach((bug) => {
    doc.text(
      `${bug.bug_id} - ${bug.component}`,
      20,
      y
    );

    y += 6;

    const desc = doc.splitTextToSize(
      bug.description,
      160
    );

    doc.text(desc, 25, y);

    y += desc.length * 6 + 6;
  });

  doc.save("Bug_Analysis_Report.pdf");
};

export const generateMarkdown = (result) => {
  if (!result) return;

  const triage = result.analysis?.triage || {};
  const log = result.analysis?.log_analysis || {};
  const rootCause = result.analysis?.root_cause || {};
  const fix = result.analysis?.fix_recommendation || {};
  const similarBugs = result.similar_bugs || [];

  const steps =
    fix.steps?.length > 0
      ? fix.steps.map((step) => `- ${step}`).join("\n")
      : "- No recommended steps available.";

  const bugs =
    similarBugs.length > 0
      ? similarBugs
          .map(
            (bug) => `
### ${bug.bug_id || "Unknown Bug"}

- **Severity:** ${bug.severity || "N/A"}
- **Component:** ${bug.component || "N/A"}
- **Similarity:** ${Math.max(
              0,
              (bug.similarity_score ?? 0) * 100
            ).toFixed(1)}%

**Description**

${bug.description || "No description available."}

**Solution**

${bug.solution || "No solution available."}
`
          )
          .join("\n")
      : "No similar bugs were found.";

  const markdown = `# AI Smart Bug Analyzer & Fix Advisor

**Generated:** ${result.timestamp || new Date().toLocaleString()}

---

## Submitted Bug

\`\`\`text
${result.submitted_bug || "No bug report available."}
\`\`\`

---

## Triage Analysis

| Field | Value |
|---|---|
| Severity | ${triage.severity || "N/A"} |
| Priority | ${triage.priority || "N/A"} |
| Component | ${triage.component || "N/A"} |
| Confidence | ${triage.confidence ?? "N/A"} |

### Reasoning

${triage.reasoning || "N/A"}

---

## Log Analysis

- **Exception Type:** ${log.exception_type || "N/A"}
- **Failure Point:** ${log.failure_point || "N/A"}
- **Code Path:** ${log.code_path || "N/A"}
- **Error Message:** ${log.error_message || "N/A"}

---

## Root Cause

${rootCause.root_cause || "N/A"}

**Confidence:** ${rootCause.confidence ?? "N/A"}

---

## AI Fix Recommendation

### Summary

${fix.summary || "N/A"}

### Recommended Fix

${fix.recommended_fix || "N/A"}

### Recommended Steps

${steps}

### Suggested Code

\`\`\`
${fix.code_snippet || "// No code suggestion available"}
\`\`\`

### Best Practice

${fix.best_practice || "N/A"}

**Confidence:** ${
    fix.confidence != null
      ? `${(fix.confidence * 100).toFixed(0)}%`
      : "N/A"
  }

---

## Similar Bugs

${bugs}

---

*Generated by AI Smart Bug Analyzer & Fix Advisor*
`;

  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Bug_Analysis_Report.md";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};