from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from sentence_transformers import SentenceTransformer
import chromadb
import shutil
import os

from app.parser import extract_text

app = FastAPI(title="AI Smart Bug Analyzer & Fix Advisor")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MAX_FILE_SIZE = 200 * 1024 * 1024  # 200 MB
ALLOWED_EXTENSIONS = {".txt", ".log", ".pdf"}

# Load AI model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to ChromaDB
client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_collection("bug_reports")


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

    query = bug_text if bug_text else extracted_text

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide bug text or upload a valid file."
        )

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
            "solution": metadata.get("solution")
        })

    return {
        "submitted_bug": query,
        "similar_bugs": similar_bugs
    }