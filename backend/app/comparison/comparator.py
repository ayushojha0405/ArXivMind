import os
from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompts import ComparisonPrompts

class Comparator:
    def __init__(self):
        self.router = LLMRouter()
        self.prompts = ComparisonPrompts()

    def generate_comparison(self, title_a: str, content_a: str, title_b: str, content_b: str):
        total_len = len(content_a) + len(content_b)
        self.llm = self.router.get_llm(task_type="compare", context_length=total_len)
        self.chain = self.prompts.get_prompt() | self.llm | StrOutputParser()
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\nSimulated Comparison: Both papers address NLP tasks, but Paper A focuses on architecture while Paper B focuses on dataset size."
            
        try:
            return self.chain.invoke({
                "title_a": title_a, 
                "content_a": content_a, 
                "title_b": title_b, 
                "content_b": content_b
            })
        except Exception as e:
            return f"Error generating comparison: {str(e)}"
