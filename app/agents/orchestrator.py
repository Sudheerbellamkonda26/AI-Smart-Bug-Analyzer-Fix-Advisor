from app.agents.triage_agent import TriageAgent
from app.agents.log_analysis_agent import LogAnalysisAgent
from app.agents.root_cause_agent import RootCauseAgent
from app.agents.remediation_agent import RemediationAgent
from app.agents.duplicate_detection_agent import DuplicateDetectionAgent
from app.services.rag_service import RAGService


class BugAnalysisOrchestrator:

    def __init__(self):
        self.triage_agent = TriageAgent()
        self.log_agent = LogAnalysisAgent()
        self.root_cause_agent = RootCauseAgent()
        self.remediation_agent = RemediationAgent()
        self.rag = RAGService()
        self.duplicate_agent = DuplicateDetectionAgent()

    def analyze_bug(self, bug_report):

        # Agent 1 - Triage
        triage = self.triage_agent.analyze(bug_report)

        # Agent 2 - Log Analysis
        log_analysis = self.log_agent.analyze(bug_report)

        # Retrieve Similar Bugs (RAG)
        similar_bugs = self.rag.retrieve_similar_bugs(
            bug_report,
            top_k=3
        )

        # Agent 3 - Duplicate Detection
        duplicate_results = self.duplicate_agent.analyze(
            similar_bugs
        )

        # Agent 4 - Root Cause
        root_cause = self.root_cause_agent.analyze(
            bug_report,
            log_analysis,
            similar_bugs
        )

        # Agent 5 - AI Fix Recommendation
        fix = self.remediation_agent.analyze(
            bug_text=bug_report,
            root_cause=root_cause,
            triage=triage,
            log_analysis=log_analysis,
            similar_bugs=duplicate_results["duplicates"]
        )

        return {
            "triage": triage,
            "log_analysis": log_analysis,
            "root_cause": root_cause,
            "duplicate_detection": duplicate_results,
            "similar_bugs": similar_bugs,
            "fix_recommendation": fix
        }