class TriageAgent:
    def analyze(self, bug_report: str):
        """
        Analyze the bug report and classify:
        - Severity
        - Priority
        - Component
        - Confidence
        - Reasoning
        """

        text = bug_report.lower()

        severity = "Low"
        priority = "P4"
        component = "General"
        confidence = 0.60
        reasoning = []

        # ==================================================
        # Severity Classification
        # ==================================================

        # Timeout / Performance Issues (Check FIRST)
        if any(word in text for word in [
            "timeout",
            "sockettimeoutexception",
            "delay",
            "slow",
            "latency"
        ]):
            severity = "Medium"
            priority = "P2"
            confidence = 0.88
            reasoning.append("Performance or network issue detected.")

        # Critical Runtime Exceptions
        elif any(word in text for word in [
            "crash",
            "fatal",
            "failed",
            "nullpointerexception",
            "indexoutofboundsexception",
            "sqlexception",
            "filenotfoundexception",
            "outofmemoryerror",
            "stackoverflowerror"
        ]):
            severity = "High"
            priority = "P1"
            confidence = 0.95
            reasoning.append("Critical runtime exception detected.")

        # Generic Exception / Error
        elif "exception" in text or "error" in text:
            severity = "Medium"
            priority = "P2"
            confidence = 0.85
            reasoning.append("Application exception detected.")

        # UI Issues
        elif any(word in text for word in [
            "alignment",
            "font",
            "button",
            "color",
            "ui",
            "layout"
        ]):
            severity = "Low"
            priority = "P4"
            confidence = 0.80
            reasoning.append("User interface issue detected.")

        else:
            reasoning.append("No critical indicators found.")

        # ==================================================
        # Component Classification
        # ==================================================

        # Authentication
        if any(word in text for word in [
            "login",
            "password",
            "authentication",
            "session",
            "credential",
            "username"
        ]):
            component = "Authentication"

        # Database
        elif any(word in text for word in [
            "database",
            "mysql",
            "sql",
            "query"
        ]):
            component = "Database"

        # Network (Check BEFORE API)
        elif any(word in text for word in [
            "network",
            "socket",
            "timeout",
            "connection"
        ]):
            component = "Network"

        # File System
        elif any(word in text for word in [
            "file",
            "pdf",
            "log",
            "directory",
            "config.properties"
        ]):
            component = "File System"

        # API
        elif any(word in text for word in [
            "api",
            "endpoint",
            "request",
            "response"
        ]):
            component = "API"

        # Email
        elif any(word in text for word in [
            "email",
            "smtp"
        ]):
            component = "Email Service"

        return {
            "severity": severity,
            "priority": priority,
            "component": component,
            "confidence": confidence,
            "reasoning": " ".join(reasoning)
        }