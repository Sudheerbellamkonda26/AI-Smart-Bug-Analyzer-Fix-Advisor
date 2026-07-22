import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.agents.log_analysis_agent import LogAnalysisAgent

agent = LogAnalysisAgent()

log = """
Exception in thread "main" java.lang.NullPointerException

at com.example.auth.LoginService.login(LoginService.java:42)

at com.example.Main.main(Main.java:15)
"""

result = agent.analyze(log)

print(result)