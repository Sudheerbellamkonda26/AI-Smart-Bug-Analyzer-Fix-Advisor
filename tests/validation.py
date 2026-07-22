import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.orchestrator import BugAnalysisOrchestrator

# Initialize Orchestrator
orchestrator = BugAnalysisOrchestrator()

# ==========================================================
# Validation Test Cases
# ==========================================================

test_cases = [

    {
        "name": "Null Pointer Exception",
        "bug": """
        Login throws java.lang.NullPointerException
        at com.example.auth.LoginService.login(LoginService.java:42)
        """,
        "expected": {
            "severity": "High",
            "component": "Authentication",
            "exception": "NullPointerException",
            "root": "null"
        }
    },

    {
        "name": "Database Timeout",
        "bug": """
        Database connection timeout while fetching user details.
        """,
        "expected": {
            "severity": "Medium",
            "component": "Database",
            "exception": None,
            "root": "operation"
        }
    },

    {
        "name": "UI Alignment Issue",
        "bug": """
        Button alignment issue on dashboard page.
        """,
        "expected": {
            "severity": "Low",
            "component": "General",
            "exception": None,
            "root": ""
        }
    },

    {
        "name": "Index Out Of Bounds",
        "bug": """
        java.lang.IndexOutOfBoundsException
        at java.util.ArrayList.get(ArrayList.java:435)
        """,
        "expected": {
            "severity": "High",
            "component": "General",
            "exception": "IndexOutOfBoundsException",
            "root": "index"
        }
    },

    {
        "name": "File Not Found",
        "bug": """
        java.io.FileNotFoundException
        config.properties
        """,
        "expected": {
            "severity": "High",
            "component": "File System",
            "exception": "FileNotFoundException",
            "root": "file"
        }
    },

    {
        "name": "SQL Exception",
        "bug": """
        java.sql.SQLException
        Unable to connect to database.
        """,
        "expected": {
            "severity": "High",
            "component": "Database",
            "exception": "SQLException",
            "root": "database"
        }
    },

    {
        "name": "Socket Timeout",
        "bug": """
        java.net.SocketTimeoutException
        Request timed out while calling external API.
        """,
        "expected": {
            "severity": "Medium",
            "component": "Network",
            "exception": "SocketTimeoutException",
            "root": "operation"
        }
    },

    {
        "name": "Authentication Failure",
        "bug": """
        Authentication Failed
        Invalid username or password.
        """,
        "expected": {
            "severity": "High",
            "component": "Authentication",
            "exception": None,
            "root": "authentication"
        }
    }

]

# ==========================================================
# Validation
# ==========================================================

triage_correct = 0
log_correct = 0
root_correct = 0
overall_pass = 0

print("\n" + "=" * 75)
print("          AI SMART BUG ANALYZER - VALIDATION REPORT")
print("=" * 75)

for index, case in enumerate(test_cases, start=1):

    print(f"\nTest Case {index}: {case['name']}")
    print("-" * 75)

    result = orchestrator.analyze_bug(case["bug"])

    triage = result["triage"]
    log = result["log_analysis"]
    root = result["root_cause"]

    print(f"Severity      : {triage['severity']}")
    print(f"Priority      : {triage['priority']}")
    print(f"Component     : {triage['component']}")
    print(f"Exception     : {log['exception_type']}")
    print(f"Failure Point : {log['failure_point']}")
    print(f"Root Cause    : {root['root_cause']}")
    print(f"Confidence    : {root['confidence']}")

    expected = case["expected"]

    triage_ok = (
        triage["severity"] == expected["severity"] and
        triage["component"] == expected["component"]
    )

    log_ok = (
        log["exception_type"] == expected["exception"]
    )

    if expected["root"] == "":
        root_ok = True
    else:
        root_ok = expected["root"] in root["root_cause"].lower()

    if triage_ok:
        triage_correct += 1

    if log_ok:
        log_correct += 1

    if root_ok:
        root_correct += 1

    if triage_ok and log_ok and root_ok:
        overall_pass += 1
        print("Status        : PASS")
    else:
        print("Status        : FAIL")

# ==========================================================
# Final Report
# ==========================================================

total = len(test_cases)

triage_accuracy = (triage_correct / total) * 100
log_accuracy = (log_correct / total) * 100
root_accuracy = (root_correct / total) * 100
overall_accuracy = (overall_pass / total) * 100

print("\n" + "=" * 75)
print("                    VALIDATION SUMMARY")
print("=" * 75)

print(f"Total Test Cases        : {total}")
print(f"Passed                  : {overall_pass}")
print(f"Failed                  : {total - overall_pass}")

print("-" * 75)

print(f"Triage Accuracy         : {triage_accuracy:.2f}%")
print(f"Log Analysis Accuracy   : {log_accuracy:.2f}%")
print(f"Root Cause Accuracy     : {root_accuracy:.2f}%")
print(f"Overall Validation      : {overall_accuracy:.2f}%")

print("=" * 75)

if overall_pass == total:
    print("\n🎉 Congratulations! All validation tests passed.")
else:
    print("\n⚠️ Some validation tests failed. Review the failed cases above.")