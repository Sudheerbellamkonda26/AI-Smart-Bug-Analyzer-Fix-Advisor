import json
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parent.parent
ANALYSIS_DIR = BASE_DIR / "analysis"


def get_analysis_history(limit=50):
    """
    Return lightweight summaries of previous analyses.
    """

    history = []

    if not ANALYSIS_DIR.exists():
        return history

    files = sorted(
    [
        file
        for file in ANALYSIS_DIR.glob("*.json")
        if file.stem != "latest_analysis"
    ],
    key=lambda file: file.stat().st_mtime,
    reverse=True
    )

    # Only process the latest files
    for file in files[:limit]:

        try:
            with file.open("r", encoding="utf-8") as f:
                data = json.load(f)

            triage = data.get("triage", {})
            log_analysis = data.get("log_analysis", {})
            root_cause = data.get("root_cause", {})

            try:
                parsed_time = datetime.strptime(
                    file.stem,
                    "%Y%m%d_%H%M%S"
                )

                timestamp = parsed_time.isoformat()

            except ValueError:
                timestamp = None

            history.append({
                "id": file.stem,
                "timestamp": timestamp,

                "severity": triage.get("severity", "Unknown"),
                "priority": triage.get("priority", "Unknown"),
                "component": triage.get("component", "Unknown"),

                "exception_type": log_analysis.get(
                    "exception_type",
                    "Unknown"
                ),

                "root_cause": root_cause.get(
                    "root_cause",
                    "Unknown"
                )
            })

        except (json.JSONDecodeError, OSError) as error:
            print(
                f"Skipping history file {file.name}: {error}"
            )

    return history