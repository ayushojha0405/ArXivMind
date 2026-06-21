import asyncio

from app.rag.retrieval.search_service import SearchService
from .context_builder import ContextBuilder
from .answer_generator import AnswerGenerator


class QAService:
    def __init__(self):
        self.search_service = SearchService()
        self.context_builder = ContextBuilder()
        self.answer_generator = AnswerGenerator()

    def _build_search_results(self, question: str, context_paper_id: str = None):
        """Single vector search, then split results for context vs global papers."""
        chunks = self.search_service.search_chunks(query=question, top_k=20)

        if context_paper_id:
            context_results = self.search_service.search_chunks(
                query=question, top_k=3, filter_paper_id=context_paper_id
            )
            global_results = []
            seen = {context_paper_id}
            for chunk in chunks:
                pid = chunk["paper_id"]
                if pid not in seen:
                    global_results.append(chunk)
                    seen.add(pid)
                    if len(global_results) >= 5:
                        break
            return context_results + global_results

        unique_results = []
        seen = set()
        for chunk in chunks:
            pid = chunk["paper_id"]
            if pid not in seen:
                unique_results.append(chunk)
                seen.add(pid)
                if len(unique_results) >= 5:
                    break
        return unique_results

    def answer_question(self, question: str, context_paper_id: str = None):
        search_results = self._build_search_results(question, context_paper_id)
        context = self.context_builder.build_context(search_results)
        answer = self.answer_generator.generate(context=context, question=question)
        return {
            "question": question,
            "answer": answer,
            "sources": search_results,
        }

    async def answer_question_async(self, question: str, context_paper_id: str = None):
        search_results = await asyncio.to_thread(
            self._build_search_results, question, context_paper_id
        )
        context = self.context_builder.build_context(search_results)
        answer = await self.answer_generator.generate_async(context=context, question=question)
        return {
            "question": question,
            "answer": answer,
            "sources": search_results,
        }
