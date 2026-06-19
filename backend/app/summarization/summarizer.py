import os

from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompts import SummarizationPrompts


class Summarizer:
    def __init__(self):
        self.router = LLMRouter()
        self.prompts = SummarizationPrompts()

    def _get_chain(self, context_length: int):
        llm = self.router.get_llm(task_type="summarize", context_length=context_length)
        return self.prompts.get_prompt() | llm | StrOutputParser()

    def generate_summary(self, paper_content: str):
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated Summary: This paper presents novel research..."
            )

        try:
            chain = self._get_chain(len(paper_content))
            return chain.invoke({"paper_content": paper_content})
        except Exception as e:
            return f"Error generating summary: {str(e)}"

    async def generate_summary_async(self, paper_content: str):
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated Summary: This paper presents novel research..."
            )

        try:
            chain = self._get_chain(len(paper_content))
            return await chain.ainvoke({"paper_content": paper_content})
        except Exception as e:
            return f"Error generating summary: {str(e)}"
