import chromadb
from sentence_transformers import SentenceTransformer


class RAGService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        client = chromadb.PersistentClient(path="chroma_db")
        self.collection = client.get_or_create_collection(
            name="bug_reports"
        )

    def retrieve_similar_bugs(self, bug_text, top_k=3):

        embedding = self.model.encode(bug_text).tolist()

        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        similar_bugs = []

        ids = results.get("ids", [[]])[0]
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        for bug_id, doc, meta, distance in zip(ids, docs, metas, distances):

            meta = meta or {}

            similarity = round((1 - distance) * 100, 2)

            similar_bugs.append({
                "bug_id": bug_id,
                "title": meta.get("title", ""),
                "description": doc,
                "severity": meta.get("severity", ""),
                "component": meta.get("component", ""),
                "resolution": meta.get("resolution", ""),
                "similarity": similarity,
            })

        # Debug output (inside the function)
        print("\n===== RAG DEBUG =====")
        print(results)
        print(similar_bugs)
        print("=====================\n")

        return similar_bugs