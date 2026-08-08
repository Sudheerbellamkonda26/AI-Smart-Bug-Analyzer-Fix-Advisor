from collections import Counter
from pathlib import Path
import json

ANALYSIS_FOLDER = Path("analysis")


def get_dashboard_analytics():
    severity_counter = Counter()
    component_counter = Counter()
    root_cause_counter = Counter()
    theme_counter = Counter()

    total_bugs = 0

    if not ANALYSIS_FOLDER.exists():
        return {
            "total_bugs": 0,
            "severity_distribution": {},
            "component_distribution": {},
            "root_cause_distribution": {},
            "bug_themes": {},
            "critical_bugs": 0,
            "most_affected_component": "N/A",
            "most_common_root_cause": "N/A",
        }

    component_theme_map = {
        "Authentication": "Authentication Issues",
        "Database": "Database Problems",
        "Network": "Network & Connectivity",
        "API": "API Failures",
        "File System": "File Handling",
        "Email Service": "Email Service Issues",
        "General": "General Application Issues",
    }

    for file in ANALYSIS_FOLDER.glob("*.json"):
        try:
            with open(file, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Read analysis data
            triage = data.get("triage", {})
            root = data.get("root_cause", {})

            severity = triage.get("severity", "Unknown")
            component = triage.get("component", "Unknown")

            hypothesis = root.get("hypothesis", "").lower()

            if "null" in hypothesis:
                cause = "Null Pointer"

            elif "database" in hypothesis or "sql" in hypothesis:
                cause = "Database Connection"

            elif (
                "authentication" in hypothesis
                or "login" in hypothesis
                or "user" in hypothesis
            ):
                cause = "Authentication"

            elif (
                "timeout" in hypothesis
                or "network" in hypothesis
                or "socket" in hypothesis
            ):
                cause = "Network Issue"

            elif "file" in hypothesis:
                cause = "File Handling"

            elif "memory" in hypothesis:
                cause = "Memory Issue"

            elif "api" in hypothesis:
                cause = "API Failure"

            elif hypothesis:
                cause = "Other"

            else:
                cause = "Unknown"

            # Update counters
            severity_counter[severity] += 1
            component_counter[component] += 1
            root_cause_counter[cause] += 1

            theme = component_theme_map.get(component, "Other")
            theme_counter[theme] += 1

            total_bugs += 1

        except Exception as e:
            print(f"Error reading {file.name}: {e}")
            continue

    return {
        "total_bugs": total_bugs,
        "severity_distribution": dict(severity_counter),
        "component_distribution": dict(component_counter),
        "root_cause_distribution": dict(root_cause_counter),
        "bug_themes": dict(theme_counter),
        "critical_bugs": severity_counter.get("Critical", 0),
        "most_affected_component": (
            component_counter.most_common(1)[0][0]
            if component_counter
            else "N/A"
        ),
        "most_common_root_cause": (
            root_cause_counter.most_common(1)[0][0]
            if root_cause_counter
            else "N/A"
        ),
    }