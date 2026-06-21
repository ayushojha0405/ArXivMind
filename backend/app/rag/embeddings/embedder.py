import os
from functools import lru_cache
import concurrent.futures
import threading
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class EmbeddingModel:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(EmbeddingModel, cls).__new__(cls)
                cls._instance._init()
        return cls._instance

    def _init(self):
        self.model = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001",
            google_api_key=os.environ.get("GEMINI_API_KEY", "dummy_key"),
        )

    @lru_cache(maxsize=128)
    def embed_text(self, text: str):
        print(f"DEBUG: Starting Gemini embedding for text: {text[:20]}...", flush=True)
        # Prevent Langchain from hanging Gunicorn workers by enforcing a strict 8-second timeout
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(self.model.embed_query, text)
            try:
                result = future.result(timeout=8.0)
                print("DEBUG: Gemini embedding completed successfully.", flush=True)
                return result
            except concurrent.futures.TimeoutError:
                print("DEBUG: Gemini embedding TIMED OUT after 8 seconds!", flush=True)
                # Return an empty embedding vector to allow the search to proceed gracefully
                return [0.0] * 3072
            except Exception as e:
                print(f"DEBUG: Gemini embedding FAILED with error: {e}", flush=True)
                return [0.0] * 3072

    async def embed_text_async(self, text: str):
        import asyncio
        return await asyncio.to_thread(self.embed_text, text)
