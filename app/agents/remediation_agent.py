import json

from app.services.llm_service import generate_fix_recommendation


class RemediationAgent:

    def analyze(
        self,
        bug_text,
        root_cause,
        triage,
        log_analysis,
        similar_bugs,
    ):

        try:

            recommendation = generate_fix_recommendation(
                bug_report=bug_text,
                triage=triage,
                log_analysis=log_analysis,
                root_cause=root_cause,
                similar_bugs=similar_bugs,
            )

            return recommendation

        except Exception:

            return {
                "summary": "Unable to generate remediation.",
                "recommended_fix": "Review the application logs and investigate the reported root cause.",
                "steps": [
                    "Review stack trace",
                    "Inspect the affected module",
                    "Apply appropriate validation"
                ],
                "code_snippet": "",
                "best_practice": "Improve exception handling and input validation.",
                "confidence": 0.50
            }