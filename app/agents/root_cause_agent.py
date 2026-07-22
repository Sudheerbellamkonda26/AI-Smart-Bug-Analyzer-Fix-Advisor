class RootCauseAgent:

    def analyze(self, bug_report: str, log_analysis: dict):

        exception = log_analysis.get("exception_type")
        bug_text = bug_report.lower()

        # Null Pointer
        if exception == "NullPointerException":
            return {
                "root_cause": "A null object is being accessed before initialization.",
                "confidence": 0.96
            }

        # Index Error
        elif exception == "IndexOutOfBoundsException":
            return {
                "root_cause": "The code is accessing an invalid array or list index.",
                "confidence": 0.95
            }

        # Database
        elif exception == "SQLException":
            return {
                "root_cause": "Database query or connection failure.",
                "confidence": 0.93
            }

        # File Missing
        elif exception == "FileNotFoundException":
            return {
                "root_cause": "Required file is missing or the specified file path is incorrect.",
                "confidence": 0.94
            }

        # Network Timeout
        elif exception == "SocketTimeoutException" or "timeout" in bug_text:
            return {
                "root_cause": "Operation exceeded the allowed execution time due to a network or service delay.",
                "confidence": 0.90
            }

        # Authentication
        elif (
            "authentication" in bug_text
            or "login" in bug_text
            or "invalid username" in bug_text
            or "invalid password" in bug_text
        ):
            return {
                "root_cause": "Authentication failed due to invalid credentials or user validation failure.",
                "confidence": 0.92
            }

        # Default
        return {
            "root_cause": "Unable to determine the exact root cause from the available information.",
            "confidence": 0.50
        }