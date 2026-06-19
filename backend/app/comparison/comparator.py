import os

from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompts import ComparisonPrompts


class Comparator:
    def __init__(self):
        self.router = LLMRouter()
        self.prompts = ComparisonPrompts()

    def _get_chain(self, context_length: int):
        llm = self.router.get_llm(task_type="compare", context_length=context_length)
        return self.prompts.get_prompt() | llm | StrOutputParser()

    def generate_comparison(self, title_a: str, content_a: str, title_b: str, content_b: str):
        total_len = len(content_a) + len(content_b)
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated Comparison: Both papers address NLP tasks, but Paper A focuses on architecture "
                "while Paper B focuses on dataset size."
            )

        try:
            chain = self._get_chain(total_len)
            return chain.invoke({
                "title_a": title_a,
                "content_a": content_a,
                "title_b": title_b,
                "content_b": content_b,
            })
        except Exception as e:
            return f"Error generating comparison: {str(e)}"

    async def generate_comparison_async(self, title_a: str, content_a: str, title_b: str, content_b: str):
        total_len = len(content_a) + len(content_b)
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated Comparison: Both papers address NLP tasks, but Paper A focuses on architecture "
                "while Paper B focuses on dataset size."
            )

        try:
            chain = self._get_chain(total_len)
            return await chain.ainvoke({
                "title_a": title_a,
                "content_a": content_a,
                "title_b": title_b,
                "content_b": content_b,
            })
        except Exception as e:
            return f"Error generating comparison: {str(e)}"
