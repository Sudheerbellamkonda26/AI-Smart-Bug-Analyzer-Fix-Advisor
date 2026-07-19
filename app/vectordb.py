import chromadb

import pandas as pd

from sentence_transformers import SentenceTransformer



print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")



print("Loading dataset...")

data = pd.read_csv("datasets/bug_reports.csv")



print(f"Loaded {len(data)} bug reports")



print("Connecting to ChromaDB...")

client = chromadb.PersistentClient(path="chroma_db")



collection = client.get_or_create_collection("bug_reports")



print("Adding documents...")



for _, row in data.iterrows():

    document = f"{row['title']} {row['description']}"

    embedding = model.encode(document).tolist()



    collection.add(

        ids=[row["bug_id"]],

        embeddings=[embedding],

        documents=[document],

        metadatas=[{

            "solution": row["resolution"], 

            "severity": row["severity"],

            "component": row["component"]

        }]

    )



print("Done!")

print("Total documents:", collection.count())