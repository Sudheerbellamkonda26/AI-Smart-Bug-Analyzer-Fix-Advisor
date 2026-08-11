# 🐞 Creation of Intelligent Bug Diagnosis Platform with Fix Recommendation Assistance

An AI-powered bug analysis system that leverages **Retrieval-Augmented Generation (RAG)**, **semantic search**, and a **multi-agent architecture** to analyze software bugs, identify root causes, and retrieve similar historical defects for faster debugging.

---

## 🚀 Features

### 📥 Bug Submission
- Submit bug reports as plain text
- Upload `.txt`, `.log`, and `.pdf` files
- Automatic text extraction from uploaded files

### 🤖 Multi-Agent Analysis
- **Triage Agent**
  - Classifies severity
  - Assigns priority
  - Identifies affected component
  - Provides confidence score and reasoning

- **Log Analysis Agent**
  - Extracts exception type
  - Identifies failure point
  - Extracts code path
  - Captures error messages

- **Root Cause Agent**
  - Analyzes bug reports
  - Determines probable root cause
  - Returns confidence score

### 🔍 Semantic Similarity Search
- Sentence Transformer embeddings
- ChromaDB vector database
- Retrieves top similar historical bugs
- Displays previous solutions

### 📊 Analysis History
- Saves every analysis as JSON
- Maintains historical analysis records

### ✅ Validation Suite
- Automated validation for multiple bug scenarios
- Accuracy measurement for:
  - Triage Agent
  - Log Analysis Agent
  - Root Cause Agent

---

# 🏗 System Architecture

```
                   User
                     │
                     ▼
          FastAPI Bug Submission
                     │
      ┌──────────────┴──────────────┐
      │                             │
      ▼                             ▼
 Text Input                   File Upload
      │                             │
      └──────────────┬──────────────┘
                     ▼
        Bug Analysis Orchestrator
                     │
     ┌───────────────┼────────────────┐
     ▼               ▼                ▼
 Triage Agent   Log Analysis    Root Cause Agent
                     │
                     ▼
        Semantic Similarity Search
              (ChromaDB + RAG)
                     │
                     ▼
             Structured JSON Response
```

---

# 📂 Project Structure

```text
AI-Smart-Bug-Analyzer/
│
├── app/
│   ├── agents/
│   │   ├── triage_agent.py
│   │   ├── log_analysis_agent.py
│   │   ├── root_cause_agent.py
│   │   └── orchestrator.py
│   │
│   ├── embeddings.py
│   ├── load_data.py
│   ├── parser.py
│   ├── similarity.py
│   ├── vectordb.py
│   └── main.py
│
├── chroma_db/
├── datasets/
├── uploads/
├── analysis/
├── docs/
├── tests/
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

# ⚙️ Technology Stack

### Backend
- Python
- FastAPI
- Uvicorn

### AI & Machine Learning
- Sentence Transformers
- Hugging Face
- Retrieval-Augmented Generation (RAG)

### Vector Database
- ChromaDB

### File Processing
- PyPDF2

### Testing
- Python Validation Suite

---

# 📦 Installation

```bash
git clone <repository-url>

cd AI-Smart-Bug-Analyzer

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🌐 API Endpoints

## GET /

Health check endpoint.

### Response

```json
{
    "message": "AI Smart Bug Analyzer & Fix Advisor is Running 🚀"
}
```

---

## POST /submit

Submit a bug report for analysis.

### Supports

- Text input
- TXT files
- LOG files
- PDF files

### Response

```json
{
    "submitted_bug": "...",
    "analysis": {
        "triage": {},
        "log_analysis": {},
        "root_cause": {}
    },
    "similar_bugs": []
}
```

---

# ✅ Validation

The backend has been validated using multiple bug scenarios, including:

- NullPointerException
- IndexOutOfBoundsException
- FileNotFoundException
- SQLException
- SocketTimeoutException
- Authentication Failure
- UI Issues
- Database Timeout

---

# 🔮 Future Enhancements

- Duplicate Detection Agent
- AI Fix Recommendation Agent
- Report Generation Agent
- Interactive Dashboard
- Authentication & User Accounts
- Bug Analytics
- Docker Deployment
- CI/CD Pipeline
---

# 📸 Screenshots

## 🏠 Home Page

![Home Page]![alt text](image.png)

---

## 🤖 Analysis Results

![Analysis Results]![alt text](image-1.png)

---

## 📊 Dashboard

![Dashboard]![alt text](image-2.png)

---

## 📜 History

![History]![alt text](image-3.png)

---

---

# 👨‍💻 Author

**Sudheer Bellamkonda**

B.Tech – Artificial Intelligence & Machine Learning

AI | Machine Learning | FastAPI | RAG | Multi-Agent Systems