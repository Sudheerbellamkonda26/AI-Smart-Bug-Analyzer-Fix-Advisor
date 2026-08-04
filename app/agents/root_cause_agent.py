from app.services.llm_service import generate_root_cause


class RootCauseAgent:

    def analyze(
        self,
        bug_report,
        log_analysis,
        historical_bugs,
    ):

        return generate_root_cause(
            bug_report,
            log_analysis,
            historical_bugs,
        )