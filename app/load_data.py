import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Create ChromaDB client
client = chromadb.PersistentClient(path="chroma_db")

# Create or get collection
collection = client.get_or_create_collection(
    name="bug_reports"
)

# Load dataset
df = pd.read_csv("datasets/bug_reports.csv")

# (Optional) Clear existing data before reloading
existing = collection.count()
if existing > 0:
    ids = collection.get()["ids"]
    if ids:
        collection.delete(ids=ids)

# Add bugs to ChromaDB
for _, bug in df.iterrows():

    embedding = model.encode(
        str(bug["description"])
    ).tolist()

    collection.add(
        ids=[str(bug["bug_id"])],
        embeddings=[embedding],
        documents=[str(bug["description"])],
        metadatas=[{
            "title": str(bug["title"]),
            "severity": str(bug["severity"]),
            "component": str(bug["component"]),
            "resolution": str(bug["resolution"])
        }]
    )

print(f"Loaded {collection.count()} bug reports into ChromaDB.")