Technical Documentation
AI Smart Bug Analyzer & Fix Advisor
1. Project Overview

AI Smart Bug Analyzer & Fix Advisor is an intelligent software defect analysis platform designed to analyze bug reports, error messages, and stack traces and provide developers with structured debugging assistance.

The system combines a multi-agent architecture, Retrieval-Augmented Generation (RAG), semantic similarity search, historical defect analysis, and Gemini AI to identify probable root causes and recommend fixes.

The platform also maintains a historical bug knowledge base so that verified resolved defects can be reused for future bug analysis.

2. Project Objectives

The main objectives of the system are:

Automatically analyze submitted bug reports.
Classify bugs based on severity, priority, and affected component.
Extract useful information from stack traces and error messages.
Identify probable root causes.
Detect similar or duplicate historical bugs.
Retrieve previous bug resolutions using semantic search.
Generate AI-powered fix recommendations.
Allow verified resolved bugs to be added to the knowledge base.
Provide defect pattern analytics through a dashboard.
Maintain analysis history for previously analyzed bugs.
3. Technology Stack
Frontend
React
Vite
Tailwind CSS
Recharts
Backend
Python
FastAPI
Uvicorn
Artificial Intelligence
Gemini AI
Google GenAI SDK
Sentence Transformers
Embedding Model
all-MiniLM-L6-v2
Vector Database
ChromaDB
Data Processing
Pandas
JSON
Python file handling
Development Tools
Visual Studio Code
Git
GitHub
4. System Architecture

The system follows a multi-agent architecture.

                    User
                     |
                     v
             Bug Submission UI
                     |
                     v
                FastAPI API
                     |
                     v
          Bug Analysis Orchestrator
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
    Triage       Log Analysis    RAG Search
     Agent          Agent            |
       |             |               v
       |             |          ChromaDB
       |             |               |
       +-------------+---------------+
                     |
                     v
             Duplicate Detection
                     |
                     v
              Root Cause Agent
                     |
                     v
             Remediation Agent
                     |
                     v
             Structured Results
                     |
          +----------+----------+
          |                     |
          v                     v
      Dashboard          Knowledge Base
                              Growth
5. Backend Architecture

The backend is implemented using FastAPI.

The main backend components are:

app/
├── agents/
├── services/
├── analytics.py
├── bug_parser.py
├── embeddings.py
├── history.py
├── load_data.py
├── main.py
├── similarity_engine.py
└── vector_store.py
6. Multi-Agent Architecture
6.1 Triage Agent

The Triage Agent analyzes the submitted bug and determines:

Severity
Priority
Affected component
Confidence
Reasoning

Example:

{
    "severity": "High",
    "priority": "P1",
    "component": "Authentication",
    "confidence": 0.95
}
6.2 Log Analysis Agent

The Log Analysis Agent processes stack traces and error messages.

It identifies information such as:

Exception type
Failure point
Code path
Error message

Example:

Exception Type: NullPointerException
Failure Point: LoginService.java:87
6.3 Root Cause Agent

The Root Cause Agent determines the probable reason behind the reported defect.

It uses:

Bug description
Log analysis
Historical similar bugs

The result contains:

Root-cause hypothesis
Confidence score
Reasoning
Supporting historical evidence
6.4 Duplicate Detection Agent

The Duplicate Detection Agent receives similar historical bugs retrieved from the vector database.

It identifies potentially duplicate or related defects and provides:

Duplicate count
Bug ID
Title
Similarity score
Severity
Component
Previous resolution
6.5 Remediation Agent

The Remediation Agent generates a recommended solution.

The recommendation may contain:

Fix summary
Recommended fix
Suggested code changes
Best practices
Confidence score

Gemini AI is used to generate intelligent recommendations when available.

7. Orchestration

The BugAnalysisOrchestrator controls the complete analysis pipeline.

The process is:

Bug Report
    ↓
Triage Agent
    ↓
Log Analysis Agent
    ↓
RAG Similarity Search
    ↓
Duplicate Detection Agent
    ↓
Root Cause Agent
    ↓
Remediation Agent
    ↓
Final Analysis Result

This ensures that information produced by earlier agents can be passed to later agents.

8. Retrieval-Augmented Generation

The project uses RAG to make historical bug information available during analysis.

The process is:

Historical Bug Dataset
        ↓
Text Preparation
        ↓
Sentence Transformer
        ↓
Vector Embedding
        ↓
ChromaDB
        ↓
Semantic Search
        ↓
Top Similar Bugs
        ↓
Root Cause / Fix Recommendation

The embedding model used is:

all-MiniLM-L6-v2
9. Semantic Similarity Engine

The similarity engine converts the submitted bug into an embedding and searches the ChromaDB knowledge base.

The system retrieves the top three historical bugs.

The similarity score is calculated from the ChromaDB distance:

similarity = (1 - distance) × 100

The results contain information such as:

Bug ID
Title
Description
Severity
Component
Resolution
Similarity Score

Example observed result:

Knowledge base size: 23
Retrieved 3 similar bugs

verified_1786194595194 | Authentication Resolved Bug | 93.39%
10. Historical Knowledge Base

The historical knowledge base contains previously known bug reports.

Each record may contain:

Bug ID
Title
Description
Stack trace
Resolution
Severity
Component

The data is embedded and stored in ChromaDB.

This allows the system to reuse historical defect knowledge during future analysis.

11. Knowledge Base Growth Mechanism

The system provides a verification mechanism for resolved bugs.

The workflow is:

Bug Analysis
     ↓
Fix Recommendation
     ↓
Developer Tests Fix
     ↓
Fix Confirmed
     ↓
Mark as Resolved
     ↓
Add Bug to Knowledge Base
     ↓
Generate Embedding
     ↓
Store in ChromaDB
     ↓
Available for Future Analysis

This allows the knowledge base to continuously grow with verified project-specific defects.

For example, an authentication NullPointerException was verified and added to the knowledge base.

After addition, the similarity engine successfully retrieved the historical bug with a high similarity score.

12. Dashboard and Defect Analytics

The project contains a dashboard for analyzing historical defect patterns.

The analytics module calculates:

Total bugs
Severity distribution
Component distribution
Root-cause distribution
Bug themes
Critical bug count
Most affected component
Most common root cause

The dashboard visualizes the results using charts.

Dashboard Charts

The dashboard contains:

Severity Chart
Component Chart
Bug Theme / Pattern Chart
Weekly Analysis Trend

Recharts is used for visualization.

13. Analysis History

The system stores completed analysis results as JSON files.

The history mechanism allows previously generated analysis results to be accessed later.

A stored analysis may contain:

Submitted Bug
Triage
Log Analysis
Root Cause
Duplicate Detection
Similar Bugs
Fix Recommendation

This allows the application to maintain a record of previous analyses.

14. Frontend

The frontend is implemented using React and Tailwind CSS.

Major frontend components include:

frontend/src/
├── components/
│   ├── AnalysisResults.jsx
│   ├── DashboardCharts.jsx
│   └── DashboardStats.jsx
│
├── pages/
│   └── Dashboard.jsx
│
└── ...

The analysis interface displays:

Triage Analysis
Log Analysis
Root Cause Analysis
Similar Historical Bugs
Duplicate Detection
AI Fix Recommendation
Knowledge Base Verification
15. AI Fix Recommendation Interface

The AI Fix Recommendation section displays:

Recommendation

Provides the recommended solution.

AI Confidence

Displays the confidence score.

Suggested Code Changes

Displays the code or configuration changes recommended by the AI.

Best Practices

Displays additional recommendations for implementing the fix safely.

16. Knowledge Base Verification Interface

After reviewing and testing a recommended fix, the developer can use:

Mark as Resolved & Add to Knowledge Base

This confirms that the fix has been tested and allows the resolved defect to become historical knowledge for future recommendations.

17. API Layer

The FastAPI backend exposes endpoints for communication with the React frontend.

The API handles:

Bug submission
Bug analysis
File upload
Analysis history
Dashboard analytics
Knowledge-base operations

The exact available endpoints should be verified against the current app/main.py implementation.

18. Installation

Clone the project repository and open the project directory.

Create a virtual environment:

python -m venv venv

Install dependencies:

pip install -r requirements.txt
19. Backend Execution

Activate the virtual environment and start the FastAPI server.

uvicorn app.main:app --reload

The backend runs on:

http://127.0.0.1:8000
20. Frontend Execution

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend is normally available at:

http://localhost:5173
21. Vector Database Initialization

The historical dataset can be loaded into ChromaDB using the vector-store process.

The project uses:

chroma_db/

as the persistent ChromaDB storage directory.

The Sentence Transformer model generates embeddings for historical bug records before they are stored.

22. Project Structure
AI-SMART-BUG-ANALYZER/
│
├── app/
│   ├── agents/
│   │   ├── duplicate_detection_agent.py
│   │   ├── log_analysis_agent.py
│   │   ├── orchestrator.py
│   │   ├── remediation_agent.py
│   │   ├── root_cause_agent.py
│   │   └── triage_agent.py
│   │
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── rag_service.py
│   │   └── similarity_engine.py
│   │
│   ├── analytics.py
│   ├── bug_parser.py
│   ├── embeddings.py
│   ├── history.py
│   ├── load_data.py
│   ├── main.py
│   └── vector_store.py
│
├── chroma_db/
├── datasets/
├── analysis/
├── docs/
│
├── frontend/
│
├── README.md
└── requirements.txt
23. Testing Summary

The system was tested using multiple bug scenarios.

Major validated areas include:

Authentication NullPointerException
Database Connection Timeout
Network/API timeout
Knowledge-base growth
Defect pattern analytics
End-to-end multi-agent execution

One authentication test successfully retrieved a verified historical bug with a similarity score of:

93.39%

A database connection test retrieved:

51.66%

The detailed test cases and observations are documented separately in:

End_to_End_Testing_Report.docx
24. Known Limitations

The current implementation has some limitations.

Semantic Similarity

Semantic similarity does not always guarantee that two bugs belong to the same functional component.

Log Parsing

The accuracy of log analysis depends on the format and completeness of the submitted stack trace.

Triage

Keyword-based classification can sometimes be affected by overlapping terms.

AI Recommendations

AI-generated recommendations may vary depending on the available historical evidence and model response.

Dataset Size

The quality of RAG retrieval depends on the size and quality of the historical bug knowledge base.

25. Future Enhancements

Possible future improvements include:

Component-aware similarity ranking
Exception-aware similarity ranking
Minimum similarity thresholds
Larger historical bug datasets
Improved stack-trace parsing
Human feedback-based ranking
More advanced evaluation metrics
Production deployment
Authentication and authorization
Cloud-based vector database
Automated monitoring and reporting

A hybrid similarity score can also be introduced:

Final Score =
Semantic Similarity
+ Component Match
+ Exception Match
+ Severity Match

This can improve the relevance of retrieved historical bugs.

26. Conclusion

The AI Smart Bug Analyzer & Fix Advisor provides an intelligent platform for software defect analysis.

The combination of multi-agent processing, RAG, semantic similarity search, historical defect knowledge, Gemini AI, and analytics allows the system to assist developers throughout the debugging process.

The knowledge-base growth mechanism further allows verified resolved bugs to become reusable knowledge for future analyses.

The project therefore provides a foundation for intelligent, historical-data-driven software defect diagnosis and fix recommendation.