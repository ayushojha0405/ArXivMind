import os

from app.core.llm_router import LLMRouter
from langchain_core.output_parsers import StrOutputParser
from .prompt_builder import PromptBuilder


class AnswerGenerator:
    def __init__(self):
        self.router = LLMRouter()
        self.prompt_builder = PromptBuilder()
        self._chain = None

    def _get_chain(self, context_length: int):
        llm = self.router.get_llm(task_type="qa", context_length=context_length)
        return self.prompt_builder.get_prompt() | llm | StrOutputParser()

    def generate(self, context, question):
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated answer: Based on the context provided..."
            )

        try:
            chain = self._get_chain(len(context))
            return chain.invoke({"context": context, "question": question})
        except Exception as e:
            return f"Error generating answer: {str(e)}"

    async def generate_async(self, context, question):
        if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your-key-here":
            return (
                "Note: GEMINI_API_KEY is not set. Please set it in the .env file to enable free AI generation.\n\n"
                "Simulated answer: Based on the context provided..."
            )

        try:
            chain = self._get_chain(len(context))
            return await chain.ainvoke({"context": context, "question": question})
        except Exception as e:
            return f"Error generating answer: {str(e)}"
