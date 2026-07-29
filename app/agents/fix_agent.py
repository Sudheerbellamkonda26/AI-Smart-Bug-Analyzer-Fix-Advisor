import traceback

from app.services.llm_service import generate_fix_recommendation


class FixRecommendationAgent:

    def analyze(
        self,
        bug_text,
        root_cause,
        triage=None,
        log_analysis=None,
        similar_bugs=None,
    ):
        """
        Generate an AI-powered fix recommendation.
        Falls back to rule-based recommendations if the AI call fails.
        """

        print("\n========== FIX AGENT ==========")
        print("FixRecommendationAgent.analyze() called")
        print("===============================\n")

        try:
            recommendation = generate_fix_recommendation(
                bug_report=bug_text,
                triage=triage,
                log_analysis=log_analysis,
                root_cause=root_cause,
                similar_bugs=similar_bugs,
            )

            print("Returning AI recommendation.\n")

            return recommendation

        except Exception:

            print("\n============================================================")
            print("Gemini failed. Using rule-based fallback recommendation.")
            traceback.print_exc()
            print("============================================================\n")

            recommendation = {
                "summary": "",
                "recommended_fix": "",
                "steps": [],
                "code_snippet": "",
                "best_practice": "",
                "confidence": 0.90,
            }

            text = bug_text.lower()

            if "nullpointerexception" in text:

                recommendation["summary"] = (
                    "A null object is being accessed before initialization."
                )

                recommendation["recommended_fix"] = (
                    "Initialize the object before using it and perform null validation."
                )

                recommendation["steps"] = [
                    "Check object initialization.",
                    "Add null checks before access.",
                    "Review constructor or dependency injection.",
                    "Verify returned values are not null.",
                ]

                recommendation["code_snippet"] = """if (obj != null) {
    obj.method();
}"""

                recommendation["best_practice"] = (
                    "Always validate objects before accessing their methods."
                )

                recommendation["confidence"] = 0.96

            elif "timeout" in text:

                recommendation["summary"] = (
                    "The operation exceeded the allowed execution time."
                )

                recommendation["recommended_fix"] = (
                    "Optimize the slow operation and verify network/database response times."
                )

                recommendation["steps"] = [
                    "Inspect database performance.",
                    "Optimize slow queries.",
                    "Check server load.",
                    "Increase timeout only if necessary.",
                ]

                recommendation["code_snippet"] = (
                    "connection.setTimeout(30000);"
                )

                recommendation["best_practice"] = (
                    "Avoid increasing timeouts without identifying the root cause."
                )

                recommendation["confidence"] = 0.91

            else:

                recommendation["summary"] = (
                    root_cause.get("root_cause")
                    if isinstance(root_cause, dict)
                    else "Unable to determine the exact issue."
                )

                recommendation["recommended_fix"] = (
                    "Review the detected root cause and compare with similar resolved bugs."
                )

                recommendation["steps"] = [
                    "Inspect the application logs.",
                    "Review configuration.",
                    "Compare with historical bug reports.",
                    "Apply the suggested resolution.",
                ]

                recommendation["code_snippet"] = "// Suggested fix"

                recommendation["best_practice"] = (
                    "Use proper logging and exception handling to simplify debugging."
                )

                recommendation["confidence"] = 0.80

            print("Returning fallback recommendation.\n")

            return recommendation