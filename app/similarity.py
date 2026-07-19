import chromadb
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to ChromaDB
client = chromadb.PersistentClient(path="chroma_db")
collection = client.get_collection("bug_reports")

while True:
    query = input("\nEnter Bug Description (or type exit): ")

    if query.lower() == "exit":
        break

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    print("\n===== Similar Bugs =====")

    for i in range(len(results["ids"][0])):
        print(f"\nBug ID      : {results['ids'][0][i]}")
        print(f"Description : {results['documents'][0][i]}")

        metadata = results["metadatas"][0][i]

       print(f"Severity    : {metadata.get('severity', 'N/A')}")
       print(f"Component   : {metadata.get('component', 'N/A')}")
       print(f"Solution    : {metadata.get('solution', 'No solution available')}")