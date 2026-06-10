import os
from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompt_builder import PromptBuilder

class AnswerGenerator:
    def __init__(self):
        self.router = LLMRouter()
        self.prompt_builder = PromptBuilder()

    def generate(self, context, question):
        self.llm = self.router.get_llm(task_type="qa", context_length=len(context))
        self.chain = self.prompt_builder.get_prompt() | self.llm | StrOutputParser()
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\nSimulated answer: Based on the context provided..."
            
        try:
            return self.chain.invoke({"context": context, "question": question})
        except Exception as e:
            return f"Error generating answer: {str(e)}"
