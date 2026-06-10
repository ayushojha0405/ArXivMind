from app.rag.embeddings.embedder import EmbeddingModel
from app.rag.retrieval.vector_store import VectorStore


class Retriever:

    def __init__(self):

        self.embedder = EmbeddingModel()
        self.store = VectorStore()

    def search(self, query, top_k=5, where=None):

        query_embedding = self.embedder.embed_text(query)

        kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": top_k
        }
        if where:
            kwargs["where"] = where

        results = self.store.collection.query(**kwargs)

        return results