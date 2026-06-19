import os
from functools import lru_cache
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class EmbeddingModel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingModel, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        self.model = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=os.environ.get("GEMINI_API_KEY", "dummy_key")
        )

    @lru_cache(maxsize=128)
    def embed_text(self, text):
        return self.model.embed_query(text)