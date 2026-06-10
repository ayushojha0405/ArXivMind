from app.rag.retrieval.vector_store import VectorStore
from .comparator import Comparator

class ComparisonService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.comparator = Comparator()

    def _get_paper_data(self, paper_id: str):
        results = self.vector_store.collection.get(
            where={"paper_id": paper_id},
            include=["documents", "metadatas"]
        )
        if not results or not results["documents"]:
            return None, None
            
        # Abstract and Introduction are usually within the first 4000 characters.
        # Sending 10000 characters for two papers (20k total) causes massive TTFT (Time To First Token) and generation delays.
        content = "\n\n".join(results["documents"])[:4000]
        title = results["metadatas"][0].get("title", f"Paper {paper_id}") if results["metadatas"] else f"Paper {paper_id}"
        return title, content

    def compare_papers(self, paper_a_id: str, paper_b_id: str):
        title_a, content_a = self._get_paper_data(paper_a_id)
        if not content_a:
            return {"error": f"Paper A ({paper_a_id}) not found or empty."}
            
        title_b, content_b = self._get_paper_data(paper_b_id)
        if not content_b:
            return {"error": f"Paper B ({paper_b_id}) not found or empty."}
            
        comparison_text = self.comparator.generate_comparison(
            title_a=title_a, content_a=content_a,
            title_b=title_b, content_b=content_b
        )
        
        return {
            "paper_a_id": paper_a_id,
            "title_a": title_a,
            "paper_b_id": paper_b_id,
            "title_b": title_b,
            "comparison": comparison_text
        }
