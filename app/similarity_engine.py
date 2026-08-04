results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3,
)

similar_bugs = []

if results["ids"] and len(results["ids"][0]) > 0:

    for i in range(len(results["ids"][0])):

        metadata = results["metadatas"][0][i]

        distance = results["distances"][0][i]

        similarity = max(0, round((1 - distance) * 100, 2))

        similar_bugs.append({
            "title": metadata.get("title", ""),
            "description": metadata.get("description", ""),
            "severity": metadata.get("severity", "Unknown"),
            "component": metadata.get("component", "Unknown"),
            "resolution": metadata.get("resolution", ""),
            "similarity": similarity
        })

return similar_bugs