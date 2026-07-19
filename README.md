# AI Smart Bug Analyzer & Fix Advisor

## Overview

AI Smart Bug Analyzer & Fix Advisor is a Retrieval-Augmented Generation (RAG) based application that helps developers analyze software bugs by comparing them with historical defect reports. It uses semantic search to retrieve similar bugs and suggests possible solutions.

## Features

- Submit bug reports as text
- Upload bug reports (.txt, .log, .pdf)
- Extract bug information automatically
- Generate embeddings using Sentence Transformers
- Store historical bugs in ChromaDB
- Retrieve similar bugs using semantic search
- Suggest possible resolutions based on historical defects
- REST API built with FastAPI

## Tech Stack

- Python
- FastAPI
- Sentence Transformers
- ChromaDB
- Hugging Face
- PyPDF2
- Uvicorn

## Project Structure

```
AI-Smart-Bug-Analyzer/
│
├── app/
├── datasets/
├── docs/
├── uploads/
├── chroma_db/
├── README.md
├── requirements.txt
└── .gitignore
```

## Installation

```bash
git clone <repository-url>
cd AI-Smart-Bug-Analyzer

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

## API

### POST /submit

Submit a bug report for semantic similarity search.

## Future Enhancements

- Multi-Agent Architecture
- Root Cause Analysis Agent
- Duplicate Bug Detection
- AI Fix Recommendation
- Severity Prediction
- Dashboard and Analytics

## Author

Sudheer Bellamkonda