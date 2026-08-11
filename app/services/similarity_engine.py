import math

import chromadb
from sentence_transformers import SentenceTransformer


class SimilarityEngine:

    def __init__(self):

        # ==========================================
        # Load Embedding Model
        # ==========================================

        print("Loading Sentence Transformer model...")

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        # ==========================================
        # Connect to ChromaDB
        # ==========================================

        client = chromadb.PersistentClient(
            path="chroma_db"
        )

        self.collection = client.get_or_create_collection(
            name="bug_reports"
        )

        print("Similarity Engine initialized.")

    # ==========================================
    # Cosine Similarity
    # ==========================================

    def cosine_similarity(
        self,
        vector_a,
        vector_b
    ):
        """
        Calculate cosine similarity between
        two embedding vectors.
        """

        if vector_a is None or vector_b is None:
            return 0.0

        if len(vector_a) == 0 or len(vector_b) == 0:
            return 0.0

        dot_product = sum(
            a * b
            for a, b in zip(
                vector_a,
                vector_b
            )
        )

        magnitude_a = math.sqrt(
            sum(
                a * a
                for a in vector_a
            )
        )

        magnitude_b = math.sqrt(
            sum(
                b * b
                for b in vector_b
            )
        )

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        similarity = (
            dot_product
            / (magnitude_a * magnitude_b)
        )

        # Numerical safety
        similarity = max(
            -1.0,
            min(1.0, similarity)
        )

        return similarity

    # ==========================================
    # Find Similar Bugs
    # ==========================================

    def find_similar_bugs(
        self,
        bug_text,
        top_k=3
    ):
        """
        Find historically similar bugs using
        cosine similarity between embeddings.
        """

        # ==========================================
        # Validate Input
        # ==========================================

        if not bug_text or not str(bug_text).strip():

            print(
                "Similarity Engine: Empty bug text."
            )

            return []

        # ==========================================
        # Generate Query Embedding
        # ==========================================

        query_embedding = self.model.encode(
            str(bug_text),
            normalize_embeddings=True
        )

        # ==========================================
        # Get Knowledge Base
        # ==========================================

        results = self.collection.get(
            include=[
                "embeddings",
                "documents",
                "metadatas"
            ]
        )

        ids = results.get(
            "ids",
            []
        )

        embeddings = results.get(
            "embeddings",
            []
        )

        documents = results.get(
            "documents",
            []
        )

        metadatas = results.get(
            "metadatas",
            []
        )

        print(
            "\n========== SIMILARITY ENGINE =========="
        )

        print(
            f"Knowledge base size: {len(ids)}"
        )

        # ==========================================
        # Calculate Similarity
        # ==========================================

        scored_bugs = []

        for bug_id, embedding, document, metadata in zip(
            ids,
            embeddings,
            documents,
            metadatas
        ):

            # ChromaDB may return embeddings as
            # NumPy arrays. Do not use:
            #
            # if not embedding
            #
            # because NumPy arrays cannot be
            # evaluated directly as booleans.

            if embedding is None:
                continue

            if len(embedding) == 0:
                continue

            metadata = metadata or {}

            similarity = self.cosine_similarity(
                query_embedding,
                embedding
            )

            # Convert cosine similarity to percentage
            similarity_percentage = round(
                max(0.0, similarity) * 100,
                2
            )

            scored_bugs.append({

                "bug_id": bug_id,

                "title": metadata.get(
                    "title",
                    "Unknown Bug"
                ),

                "description": (
                    document
                    or metadata.get(
                        "description",
                        ""
                    )
                ),

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

                "similarity": similarity_percentage
            })

        # ==========================================
        # Sort by Highest Similarity
        # ==========================================

        scored_bugs.sort(
            key=lambda bug: bug["similarity"],
            reverse=True
        )

        similar_bugs = scored_bugs[:top_k]

        # ==========================================
        # Debug Output
        # ==========================================

        print(
            f"Retrieved {len(similar_bugs)} similar bugs"
        )

        for bug in similar_bugs:

            print(
                f"{bug['bug_id']} | "
                f"{bug['title']} | "
                f"{bug['similarity']}%"
            )

        print(
            "=======================================\n"
        )

        return similar_bugs