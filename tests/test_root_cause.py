import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.root_cause_agent import RootCauseAgent

agent = RootCauseAgent()

bug = """
java.lang.NullPointerException
at LoginService.login(LoginService.java:42)
"""

log = {
    "exception_type": "NullPointerException"
}

result = agent.analyze(bug, log)

print(result)