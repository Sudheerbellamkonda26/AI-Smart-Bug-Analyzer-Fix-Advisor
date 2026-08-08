from datetime import datetime
from pathlib import Path
import json
import os

import chromadb
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

from app.history import get_analysis_history
from app.analytics import get_dashboard_analytics
from app.bug_parser import extract_text
from app.agents.orchestrator import BugAnalysisOrchestrator

# ==============================
# FastAPI App
# ==============================

app = FastAPI(
    title="Creation of Intelligent Bug Diagnosis Platform with Fix Recommendation Assistance",
    description="""
An AI-powered bug diagnosis platform that leverages Multi-Agent AI,
Retrieval-Augmented Generation (RAG), ChromaDB, Semantic Search,
and Gemini AI to analyze software bugs, identify root causes,
retrieve similar historical defects, and generate intelligent
fix recommendations.
""",
    version="1.0.0",
)

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# Configuration
# ==============================

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ANALYSIS_FOLDER = "analysis"
os.makedirs(ANALYSIS_FOLDER, exist_ok=True)

MAX_FILE_SIZE = 200 * 1024 * 1024
ALLOWED_EXTENSIONS = {".txt", ".log", ".pdf"}

# ==============================
# Load AI Model
# ==============================

model = SentenceTransformer("all-MiniLM-L6-v2")

# ==============================
# ChromaDB
# ==============================

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="bug_reports"
)

# ==============================
# Multi-Agent
# ==============================

orchestrator = BugAnalysisOrchestrator()

# ==============================
# Knowledge Base Growth
# ==============================

class ResolvedBugRequest(BaseModel):
    bug_id: str
    title: str
    description: str
    resolution: str
    severity: str
    component: str

# ==============================
# Routes
# ==============================

@app.get("/")
def home():
    return {
        "message": "AI Smart Bug Analyzer & Fix Advisor is Running 🚀"
    }


@app.get("/history")
def get_history():
    history = get_analysis_history()

    return {
        "count": len(history),
        "history": history
    }
    
@app.get("/analytics")
def analytics():

    return get_dashboard_analytics()

@app.post("/knowledge-base/add")
def add_resolved_bug(request: ResolvedBugRequest):

    try:
        rag_service = orchestrator.rag

        result = rag_service.add_resolved_bug(
            bug_id=request.bug_id,
            title=request.title,
            description=request.description,
            resolution=request.resolution,
            severity=request.severity,
            component=request.component,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add bug to knowledge base: {str(e)}"
        )


@app.get("/history/{analysis_id}")
def get_analysis(analysis_id: str):

    file_path = Path(ANALYSIS_FOLDER) / f"{analysis_id}.json"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    with open(file_path, "r", encoding="utf-8") as file:
        analysis = json.load(file)

    return analysis


@app.post("/submit")
async def submit_bug(
    bug_text: str = Form(""),
    file: UploadFile = File(None)
):

    extracted_text = ""

    # ==============================
    # File Upload
    # ==============================

    if file:

        extension = os.path.splitext(file.filename)[1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Only .txt, .log and .pdf files are allowed."
            )

        content = await file.read()

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds 200 MB."
            )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        extracted_text = extract_text(file_path)

    query = bug_text if bug_text else extracted_text

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide bug text or upload a valid file."
        )

    # ==============================
    # Multi-Agent Analysis
    # ==============================

    analysis = orchestrator.analyze_bug(query)

    # ==============================
    # Save Analysis
    # ==============================

    filename = datetime.now().strftime("%Y%m%d_%H%M%S")

    with open(
        os.path.join(
            ANALYSIS_FOLDER,
            f"{filename}.json"
        ),
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            analysis,
            f,
            indent=4,
            ensure_ascii=False
        )

    # ==============================
    # Similarity Search
    # ==============================

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3,
        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    similar_bugs = []

    if results["ids"] and len(results["ids"][0]) > 0:

        for i in range(len(results["ids"][0])):

            metadata = results["metadatas"][0][i] or {}

            distance = results["distances"][0][i]

            similarity = max(
                0,
                round((1 - distance) * 100, 2)
            )

            similar_bugs.append({
                "bug_id": results["ids"][0][i],
                "title": metadata.get(
                    "title",
                    "Unknown Bug"
                ),
                "description": results["documents"][0][i],
                "severity": metadata.get(
                    "severity",
                    "Unknown"
                ),
                "component": metadata.get(
                    "component",
                    "Unknown"
                ),
                "resolution": metadata.get(
                    "resolution",
                    metadata.get(
                        "solution",
                        "No resolution available"
                    )
                ),
                "similarity": similarity
            })

    return {
        "submitted_bug": query,
        "analysis": analysis,
        "similar_bugs": similar_bugs
    }


@app.delete("/history/{analysis_id}")
def delete_analysis(analysis_id: str):

    file_path = Path(ANALYSIS_FOLDER) / f"{analysis_id}.json"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    file_path.unlink()

    return {
        "message": "Analysis deleted successfully"
    }