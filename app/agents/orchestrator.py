from app.agents.triage_agent import TriageAgent
from app.agents.log_analysis_agent import LogAnalysisAgent
from app.agents.root_cause_agent import RootCauseAgent
from app.agents.fix_agent import FixRecommendationAgent


class BugAnalysisOrchestrator:

    def __init__(self):
        self.triage_agent = TriageAgent()
        self.log_agent = LogAnalysisAgent()
        self.root_cause_agent = RootCauseAgent()
        self.fix_agent = FixRecommendationAgent()

    def analyze_bug(self, bug_report):

        # Agent 1 - Triage
        triage = self.triage_agent.analyze(bug_report)

        # Agent 2 - Log Analysis
        log_analysis = self.log_agent.analyze(bug_report)

        # Agent 3 - Root Cause
        root_cause = self.root_cause_agent.analyze(
            bug_report,
            log_analysis
        )

        # Agent 4 - AI Fix Recommendation
        fix = self.fix_agent.analyze(
            bug_text=bug_report,
            root_cause=root_cause,
            triage=triage,
            log_analysis=log_analysis,
            similar_bugs=[]
        )

        return {
            "triage": triage,
            "log_analysis": log_analysis,
            "root_cause": root_cause,
            "fix_recommendation": fix
        }