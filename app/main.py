from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from sentence_transformers import SentenceTransformer
import chromadb
import os
import json
from dotenv import load_dotenv

from app.history import get_analysis_history
from app.bug_parser import extract_text
from app.agents.orchestrator import BugAnalysisOrchestrator

app = FastAPI(title="AI Smart Bug Analyzer & Fix Advisor")
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

@app.get("/history")
def get_history():
    history = get_analysis_history()

    return {
        "count": len(history),
        "history": history
    }
@app.get("/history/{analysis_id}")
def get_analysis(analysis_id: str):
    file_path = Path("analysis") / f"{analysis_id}.json"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    with open(file_path, "r", encoding="utf-8") as file:
        analysis = json.load(file)

    return analysis
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MAX_FILE_SIZE = 200 * 1024 * 1024  # 200 MB
ALLOWED_EXTENSIONS = {".txt", ".log", ".pdf"}

# Load AI model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to ChromaDB
client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_collection("bug_reports")

# Initialize Multi-Agent Orchestrator
orchestrator = BugAnalysisOrchestrator()


@app.get("/")
def home():
    return {
        "message": "AI Smart Bug Analyzer & Fix Advisor is Running 🚀"
    }


@app.post("/submit")
async def submit_bug(
    bug_text: str = Form(""),
    file: UploadFile = File(None)
):

    extracted_text = ""

    # Handle uploaded file
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

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        extracted_text = extract_text(file_path)

    # Use either pasted text or extracted file text
    query = bug_text if bug_text else extracted_text

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide bug text or upload a valid file."
        )

    # ============================
    # Run Multi-Agent Analysis
    # ============================
    analysis = orchestrator.analyze_bug(query)

    # ============================
    # Save Analysis History
    # ============================
    os.makedirs("analysis", exist_ok=True)

    filename = datetime.now().strftime("%Y%m%d_%H%M%S.json")

    with open(os.path.join("analysis", filename), "w") as f:
        json.dump(analysis, f, indent=4)

    # ============================
    # Similarity Search (Milestone 1)
    # ============================
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3,
        include=["documents", "metadatas", "distances"]
    )

    similar_bugs = []

    for i in range(len(results["ids"][0])):

        metadata = results["metadatas"][0][i]

        similar_bugs.append({
            "bug_id": results["ids"][0][i],
            "description": results["documents"][0][i],
            "severity": metadata.get("severity"),
            "component": metadata.get("component"),
            "solution": metadata.get("solution"),
            "similarity_score": round(1 - results["distances"][0][i], 4)
        })

    return {
        "submitted_bug": query,
        "analysis": analysis,
        "similar_bugs": similar_bugs
    }
from pathlib import Path

@app.delete("/history/{analysis_id}")
def delete_analysis(analysis_id: str):
    file_path = Path("analysis") / f"{analysis_id}.json"

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    file_path.unlink()

    return {
        "message": "Analysis deleted successfully"
    }