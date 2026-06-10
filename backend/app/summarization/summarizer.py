import os
from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompts import SummarizationPrompts

class Summarizer:
    def __init__(self):
        self.router = LLMRouter()
        self.prompts = SummarizationPrompts()

    def generate_summary(self, paper_content: str):
        self.llm = self.router.get_llm(task_type="summarize", context_length=len(paper_content))
        self.chain = self.prompts.get_prompt() | self.llm | StrOutputParser()
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\nSimulated Summary: This paper presents novel research..."
            
        try:
            return self.chain.invoke({"paper_content": paper_content})
        except Exception as e:
            return f"Error generating summary: {str(e)}"
