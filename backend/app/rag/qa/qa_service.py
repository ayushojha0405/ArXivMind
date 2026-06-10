from app.rag.retrieval.search_service import SearchService
from .context_builder import ContextBuilder
from .answer_generator import AnswerGenerator

class QAService:
    def __init__(self):
        self.search_service = SearchService()
        self.context_builder = ContextBuilder()
        self.answer_generator = AnswerGenerator()

    def answer_question(self, question: str, context_paper_id: str = None):
        search_results = []
        
        # 1. Retrieve top chunks/documents
        # If a context paper is specified, fetch chunks from that exact paper first
        if context_paper_id:
            context_results = self.search_service.search(
                query=question, 
                top_k=3, 
                filter_paper_id=context_paper_id,
                unique_papers=False
            )
            search_results.extend(context_results)
            
        # Also fetch global results across all papers in case the question asks for other related papers
        global_results = self.search_service.search(
            query=question,
            top_k=5,
            filter_paper_id=None,
            unique_papers=True
        )
        
        # Merge global results without duplicating the context paper
        seen_paper_ids = {res["paper_id"] for res in search_results}
        for res in global_results:
            if res["paper_id"] not in seen_paper_ids:
                search_results.append(res)
                seen_paper_ids.add(res["paper_id"])
        # 2. Build context
        context = self.context_builder.build_context(search_results)
        
        # 3. Generate answer
        answer = self.answer_generator.generate(context=context, question=question)
        
        return {
            "question": question,
            "answer": answer,
            "sources": search_results
        }
