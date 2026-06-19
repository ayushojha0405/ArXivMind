from app.core.cache import search_cache
from app.rag.retrieval.retriever import Retriever


class SearchService:

    def __init__(self):
        self.retriever = Retriever()

    @staticmethod
    def _format_results(results, unique_papers=True, top_k=20):
        formatted_results = []
        seen_paper_ids = set()

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        for doc, metadata, distance in zip(documents, metadatas, distances):
            paper_id = metadata["paper_id"]

            if unique_papers:
                if paper_id in seen_paper_ids:
                    continue
                seen_paper_ids.add(paper_id)

            formatted_results.append(
                {
                    "paper_id": paper_id,
                    "categories": metadata.get("categories", ""),
                    "update_date": metadata.get("update_date", ""),
                    "title": metadata.get("title", ""),
                    "score": round(1 - distance, 4),
                    "preview": doc[:300],
                }
            )

            if len(formatted_results) >= top_k:
                break

        return formatted_results

    def search(self, query, top_k=20, filter_paper_id=None, unique_papers=True):
        cache_key = (query.strip().lower(), top_k, filter_paper_id, unique_papers)
        cached = search_cache.get(cache_key)
        if cached is not None:
            return cached

        where_clause = {"paper_id": filter_paper_id} if filter_paper_id else None
        fetch_k = top_k * 3 if unique_papers else top_k

        results = self.retriever.search(
            query=query,
            top_k=fetch_k,
            where=where_clause,
        )

        formatted_results = self._format_results(
            results, unique_papers=unique_papers, top_k=top_k
        )
        search_cache.set(cache_key, formatted_results)
        return formatted_results

    async def search_async(self, query, top_k=20, filter_paper_id=None, unique_papers=True):
        cache_key = (query.strip().lower(), top_k, filter_paper_id, unique_papers)
        cached = search_cache.get(cache_key)
        if cached is not None:
            return cached

        where_clause = {"paper_id": filter_paper_id} if filter_paper_id else None
        fetch_k = top_k * 3 if unique_papers else top_k

        results = await self.retriever.search_async(
            query=query,
            top_k=fetch_k,
            where=where_clause,
        )

        formatted_results = self._format_results(
            results, unique_papers=unique_papers, top_k=top_k
        )
        search_cache.set(cache_key, formatted_results)
        return formatted_results

    def search_chunks(self, query, top_k=20, filter_paper_id=None):
        """Return top chunk matches (no paper deduplication) for RAG context."""
        where_clause = {"paper_id": filter_paper_id} if filter_paper_id else None
        results = self.retriever.search(
            query=query,
            top_k=top_k,
            where=where_clause,
        )
        return self._format_results(results, unique_papers=False, top_k=top_k)
