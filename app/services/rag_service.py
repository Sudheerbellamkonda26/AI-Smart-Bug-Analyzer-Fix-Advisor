import chromadb
from sentence_transformers import SentenceTransformer


class RAGService:

    def __init__(self):
        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        client = chromadb.PersistentClient(
            path="chroma_db"
        )

        self.collection = client.get_or_create_collection(
            name="bug_reports"
        )

    def add_resolved_bug(
        self,
        bug_id,
        title,
        description,
        resolution,
        severity,
        component,
    ):
        """
        Add a verified and resolved bug to the ChromaDB
        knowledge base for future RAG retrieval.
        """

        document = f"{title} {description}"

        embedding = self.model.encode(
            document
        ).tolist()

        metadata = {
            "title": title,
            "resolution": resolution,
            "solution": resolution,
            "severity": severity,
            "component": component,
            "source": "verified_resolved_bug",
        }

        self.collection.upsert(
            ids=[bug_id],
            embeddings=[embedding],
            documents=[document],
            metadatas=[metadata],
        )

        print("\n===== KNOWLEDGE BASE GROWTH =====")
        print(f"Added resolved bug: {bug_id}")
        print(f"Title: {title}")
        print(f"Component: {component}")
        print("Successfully stored in ChromaDB.")
        print("=================================\n")

        return {
            "bug_id": bug_id,
            "title": title,
            "component": component,
            "message": "Verified resolved bug added to knowledge base.",
        }

    def retrieve_similar_bugs(
        self,
        bug_text,
        top_k=3
    ):

        embedding = self.model.encode(
            bug_text
        ).tolist()

        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        similar_bugs = []

        ids = results.get(
            "ids",
            [[]]
        )[0]

        docs = results.get(
            "documents",
            [[]]
        )[0]

        metas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]

        for bug_id, doc, meta, distance in zip(
            ids,
            docs,
            metas,
            distances
        ):

            meta = meta or {}

            similarity = round(
                (1 - distance) * 100,
                2
            )

            similar_bugs.append({
                "bug_id": bug_id,
                "title": meta.get(
                    "title",
                    ""
                ),
                "description": doc,
                "severity": meta.get(
                    "severity",
                    ""
                ),
                "component": meta.get(
                    "component",
                    ""
                ),
                "resolution": meta.get(
                    "resolution",
                    meta.get(
                        "solution",
                        ""
                    )
                ),
                "similarity": similarity,
            })

        # Debug output
        print("\n===== RAG DEBUG =====")
        print(results)
        print(similar_bugs)
        print("=====================\n")

        return similar_bugs