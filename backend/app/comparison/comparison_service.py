import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.rag.retrieval.vector_store import VectorStore
from .comparator import Comparator


class ComparisonService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.comparator = Comparator()

    def _get_paper_data(self, paper_id: str):
        results = self.vector_store.collection.get(
            where={"paper_id": paper_id},
            include=["documents", "metadatas"],
        )
        if not results or not results["documents"]:
            return None, None

        content = "\n\n".join(results["documents"])[:4000]
        title = (
            results["metadatas"][0].get("title", f"Paper {paper_id}")
            if results["metadatas"]
            else f"Paper {paper_id}"
        )
        return title, content

    def compare_papers(self, paper_a_id: str, paper_b_id: str):
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_a = executor.submit(self._get_paper_data, paper_a_id)
            future_b = executor.submit(self._get_paper_data, paper_b_id)
            title_a, content_a = future_a.result()
            title_b, content_b = future_b.result()

        if not content_a:
            return {"error": f"Paper A ({paper_a_id}) not found or empty."}

        if not content_b:
            return {"error": f"Paper B ({paper_b_id}) not found or empty."}

        comparison_text = self.comparator.generate_comparison(
            title_a=title_a,
            content_a=content_a,
            title_b=title_b,
            content_b=content_b,
        )

        return {
            "paper_a_id": paper_a_id,
            "title_a": title_a,
            "paper_b_id": paper_b_id,
            "title_b": title_b,
            "comparison": comparison_text,
        }

    async def compare_papers_async(self, paper_a_id: str, paper_b_id: str):
        (title_a, content_a), (title_b, content_b) = await asyncio.gather(
            asyncio.to_thread(self._get_paper_data, paper_a_id),
            asyncio.to_thread(self._get_paper_data, paper_b_id),
        )

        if not content_a:
            return {"error": f"Paper A ({paper_a_id}) not found or empty."}

        if not content_b:
            return {"error": f"Paper B ({paper_b_id}) not found or empty."}

        comparison_text = await self.comparator.generate_comparison_async(
            title_a=title_a,
            content_a=content_a,
            title_b=title_b,
            content_b=content_b,
        )

        return {
            "paper_a_id": paper_a_id,
            "title_a": title_a,
            "paper_b_id": paper_b_id,
            "title_b": title_b,
            "comparison": comparison_text,
        }
