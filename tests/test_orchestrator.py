import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.orchestrator import BugAnalysisOrchestrator

orchestrator = BugAnalysisOrchestrator()

bug = """
Login throws java.lang.NullPointerException

at com.example.auth.LoginService.login(LoginService.java:42)

at com.example.Main.main(Main.java:15)
"""

result = orchestrator.analyze_bug(bug)

print(result)