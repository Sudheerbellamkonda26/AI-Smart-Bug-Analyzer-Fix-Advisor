import re


class LogAnalysisAgent:

    def analyze(self, log_text: str):
        """
        Extract structured information from stack traces and error logs.
        """

        result = {
            "exception_type": None,
            "failure_point": None,
            "code_path": None,
            "error_message": None
        }

        # -----------------------------
        # Exception / Error Type
        # -----------------------------
        exception_pattern = r'([A-Za-z0-9_.]*(Exception|Error))'
        exception_match = re.search(exception_pattern, log_text)

        if exception_match:
            exception = exception_match.group(1).split(".")[-1]
            result["exception_type"] = exception

        # -----------------------------
        # Failure Point
        # Example:
        # LoginService.java:42
        # -----------------------------
        failure_pattern = r'([A-Za-z0-9_]+\.java:\d+)'
        failure_match = re.search(failure_pattern, log_text)

        if failure_match:
            result["failure_point"] = failure_match.group(1)

        # -----------------------------
        # Code Path
        # Example:
        # com.example.auth.LoginService.login
        # -----------------------------
        code_pattern = r'at\s+([A-Za-z0-9_.$]+)\('
        code_match = re.search(code_pattern, log_text)

        if code_match:
            result["code_path"] = code_match.group(1)

        # -----------------------------
        # Error Message
        # First non-empty line of the log
        # -----------------------------
        for line in log_text.splitlines():
            line = line.strip()
            if line:
                result["error_message"] = line
                break

        return result