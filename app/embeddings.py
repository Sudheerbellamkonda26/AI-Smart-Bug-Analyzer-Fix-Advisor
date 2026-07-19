from sentence_transformers import SentenceTransformer
import pandas as pd

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Read dataset
data = pd.read_csv("datasets/bug_reports.csv")

# Combine title and description
documents = (
    data["title"] + ". " + data["description"]
).tolist()

# Generate embeddings
embeddings = model.encode(documents)

print(f"Generated {len(embeddings)} embeddings")
print("Embedding dimension:", len(embeddings[0]))