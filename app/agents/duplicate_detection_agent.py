class DuplicateDetectionAgent:

    def analyze(self, similar_bugs):

        duplicates = []

        for bug in similar_bugs:

            duplicates.append(
                {
                    "bug_id": bug["bug_id"],
                    "title": bug.get("title", ""),
                    "similarity": bug.get("similarity", 0),
                    "severity": bug.get("severity", ""),
                    "component": bug.get("component", ""),
                    "resolution_summary": bug.get("resolution", "")
                }
            )

        duplicates.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        return {
            "duplicate_count": len(duplicates),
            "duplicates": duplicates
        }