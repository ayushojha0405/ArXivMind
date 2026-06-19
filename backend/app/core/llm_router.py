import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models.chat_models import BaseChatModel

class LLMRouter:
    """
    Intelligent Cost-Aware LLM Router.
    Routes all tasks to Google Gemini (massive context window, lightning fast).
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMRouter, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        # Initialize Heavyweight Model
        self.heavy_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.3,
            max_retries=3,
            google_api_key=os.environ.get("GEMINI_API_KEY", "dummy_key_to_prevent_crash")
        )

    def get_llm(self, task_type: str, context_length: int = 0) -> BaseChatModel:
        return self.heavy_llm
