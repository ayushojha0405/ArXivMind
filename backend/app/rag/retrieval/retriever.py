import asyncio

from app.rag.embeddings.embedder import EmbeddingModel
from app.rag.retrieval.vector_store import VectorStore


class Retriever:

    def __init__(self):
        self.embedder = EmbeddingModel()
        self.store = VectorStore()

    def _query(self, query_embedding, top_k, where=None):
        kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": top_k,
        }
        if where:
            kwargs["where"] = where
        return self.store.collection.query(**kwargs)

    def search(self, query, top_k=5, where=None):
        query_embedding = self.embedder.embed_text(query)
        return self._query(query_embedding, top_k, where)

    async def search_async(self, query, top_k=5, where=None):
        query_embedding = await self.embedder.embed_text_async(query)
        return await asyncio.to_thread(self._query, query_embedding, top_k, where)
