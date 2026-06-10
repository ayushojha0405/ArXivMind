from app.rag.retrieval.vector_store import VectorStore
from .summarizer import Summarizer

class SummaryService:
    def __init__(self):
        self.vector_store = VectorStore()
        self.summarizer = Summarizer()

    def summarize_paper(self, paper_id: str):
        # 1. Fetch paper content from ChromaDB
        results = self.vector_store.collection.get(
            where={"paper_id": paper_id},
            include=["documents", "metadatas"]
        )
        
        if not results or not results["documents"]:
            return {"error": "Paper not found."}
            
        paper_content = "\n\n".join(results["documents"])[:5000]
        metadata = results["metadatas"][0] if results["metadatas"] else {}
        
        if not paper_content:
            return {"error": "Paper content is empty."}
            
        # 2. Generate summary
        summary_text = self.summarizer.generate_summary(paper_content=paper_content)
        
        return {
            "paper_id": paper_id,
            "title": metadata.get("title", f"Paper {paper_id}"),
            "summary": summary_text
        }
