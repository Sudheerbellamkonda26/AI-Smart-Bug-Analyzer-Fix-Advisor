from app.agents.triage_agent import TriageAgent
from app.agents.log_analysis_agent import LogAnalysisAgent
from app.agents.root_cause_agent import RootCauseAgent
from app.agents.remediation_agent import RemediationAgent
from app.agents.duplicate_detection_agent import DuplicateDetectionAgent
from app.services.similarity_engine import SimilarityEngine


class BugAnalysisOrchestrator:

    def __init__(self):

        # ==========================================
        # Initialize Agents
        # ==========================================

        self.triage_agent = TriageAgent()

        self.log_agent = LogAnalysisAgent()

        self.root_cause_agent = RootCauseAgent()

        self.remediation_agent = RemediationAgent()

        self.duplicate_agent = DuplicateDetectionAgent()

        # ==========================================
        # Semantic Similarity Engine
        # ==========================================

        self.similarity_engine = SimilarityEngine()

    # ==============================================
    # Main Bug Analysis Pipeline
    # ==============================================

    def analyze_bug(self, bug_report):

        print("\n========== BUG ANALYSIS PIPELINE ==========")

        # ==========================================
        # Agent 1 - Triage Analysis
        # ==========================================

        print("Running Triage Agent...")

        triage = self.triage_agent.analyze(
            bug_report
        )

        # ==========================================
        # Agent 2 - Log Analysis
        # ==========================================

        print("Running Log Analysis Agent...")

        log_analysis = self.log_agent.analyze(
            bug_report
        )

        # ==========================================
        # Semantic Similarity Search
        # ==========================================

        print("Running Similarity Engine...")

        similar_bugs = self.similarity_engine.find_similar_bugs(
            bug_report,
            top_k=3
        )

        # ==========================================
        # Agent 3 - Duplicate Detection
        # ==========================================

        print("Running Duplicate Detection Agent...")

        duplicate_results = self.duplicate_agent.analyze(
            similar_bugs
        )

        # Safety check
        if not isinstance(
            duplicate_results,
            dict
        ):
            duplicate_results = {
                "duplicate_count": 0,
                "duplicates": []
            }

        duplicates = duplicate_results.get(
            "duplicates",
            []
        )

        # ==========================================
        # Agent 4 - Root Cause Analysis
        # ==========================================

        print("Running Root Cause Agent...")

        root_cause = self.root_cause_agent.analyze(
            bug_report,
            log_analysis,
            similar_bugs
        )

        # ==========================================
        # Agent 5 - AI Fix Recommendation
        # ==========================================

        print("Running Remediation Agent...")

        fix = self.remediation_agent.analyze(
            bug_text=bug_report,
            root_cause=root_cause,
            triage=triage,
            log_analysis=log_analysis,
            similar_bugs=duplicates
        )

        # ==========================================
        # Final Result
        # ==========================================

        result = {
            "triage": triage,

            "log_analysis": log_analysis,

            "root_cause": root_cause,

            "duplicate_detection": duplicate_results,

            "similar_bugs": similar_bugs,

            "fix_recommendation": fix
        }

        print("========== ANALYSIS COMPLETE ==========\n")

        return result