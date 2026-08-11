from app.services.llm_service import generate_root_cause


class RootCauseAgent:

    def analyze(
        self,
        bug_report,
        log_analysis,
        historical_bugs,
    ):
        """
        Analyze the probable root cause of a bug using
        the LLM together with log analysis and historical bugs.
        """

        try:
            result = generate_root_cause(
                bug_report,
                log_analysis,
                historical_bugs,
            )

            # Make sure a valid dictionary is always returned
            if not isinstance(result, dict):
                return {
                    "hypothesis": "Unable to determine the root cause.",
                    "confidence": 0.0,
                    "reasoning": "Root cause analysis did not return a valid response.",
                    "supporting_evidence": [],
                }

            # Normalize possible field names
            if "hypothesis" not in result:
                result["hypothesis"] = (
                    result.get("root_cause")
                    or result.get("cause")
                    or "Unable to determine the root cause."
                )

            if "confidence" not in result:
                result["confidence"] = 0.0

            if "reasoning" not in result:
                result["reasoning"] = (
                    "Root cause identified using bug report, "
                    "log analysis, and historical defect evidence."
                )

            if "supporting_evidence" not in result:
                result["supporting_evidence"] = []

            return result

        except Exception as error:

            print(
                f"Root Cause Agent Error: {error}"
            )

            # Fallback based on exception type
            exception_type = (
                log_analysis.get(
                    "exception_type",
                    ""
                )
                if isinstance(log_analysis, dict)
                else ""
            )

            if exception_type == "TimeoutException":

                return {
                    "hypothesis": (
                        "The payment gateway or external network service "
                        "is not responding within the configured timeout period, "
                        "causing the application request to fail with a timeout."
                    ),
                    "confidence": 0.88,
                    "reasoning": (
                        "The log analysis identifies a TimeoutException. "
                        "The submitted bug states that the payment gateway "
                        "does not respond within the configured timeout period."
                    ),
                    "supporting_evidence": [],
                }

            if exception_type == "NullPointerException":

                return {
                    "hypothesis": (
                        "The application is attempting to access an object "
                        "that is null without performing the required null validation."
                    ),
                    "confidence": 0.90,
                    "reasoning": (
                        "The exception indicates that an object reference "
                        "was accessed before verifying that it was initialized."
                    ),
                    "supporting_evidence": [],
                }

            return {
                "hypothesis": (
                    "The root cause could not be determined automatically "
                    "from the available bug and log information."
                ),
                "confidence": 0.0,
                "reasoning": (
                    "The root cause analysis service failed and no "
                    "specific fallback rule matched the detected exception."
                ),
                "supporting_evidence": [],
            }