from app.agents.triage_agent import TriageAgent

agent = TriageAgent()

bug_report = """
Login throws NullPointerException when user clicks login.
"""

result = agent.analyze(bug_report)

print(result)