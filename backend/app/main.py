# app/main.py
import asyncio
import os
from contextlib import asynccontextmanager
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.database import engine, Base, DATABASE_URL
from app.models import user, workspace, session, collections
from app.api import search, paper, qa, summarize, compare, analytics
from app.auth import routes as auth_routes
from app.collections import routes as coll_routes
from app.core.limiter import limiter


def _warmup_services():
    from app.rag.retrieval.search_service import SearchService
    from app.core.llm_router import LLMRouter

    service = SearchService()
    chunk_count = service.retriever.store.collection.count()
    print(f"---> ChromaDB indexed chunks: {chunk_count}")

    if os.environ.get("GEMINI_API_KEY") and os.environ.get("GEMINI_API_KEY") != "dummy_key":
        service.retriever.embedder.embed_text("warmup")
        print("---> Embedding model warmed up.")

    LLMRouter()
    print("---> LLM router initialized.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.to_thread(_warmup_services)
    yield


try:
    parsed_url = urlparse(DATABASE_URL)
    safe_url = (
        f"{parsed_url.scheme}://{parsed_url.username}:***@{parsed_url.hostname}:{parsed_url.port}{parsed_url.path}"
        if parsed_url.password
        else DATABASE_URL
    )
    print(f"\n---> Connecting to database: {safe_url}")

    Base.metadata.create_all(bind=engine)
    print("---> PostgreSQL connection successful.")
    print("---> Database tables initialized successfully.\n")
except Exception as e:
    print(f"\n---> Failed to initialize database: {e}\n")

app = FastAPI(title="ArXivMind API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400,
)

app.include_router(search.router, prefix="/search", tags=["search"])
app.include_router(paper.router, prefix="/paper", tags=["paper"])
app.include_router(qa.router, prefix="/qa", tags=["qa"])
app.include_router(summarize.router, prefix="/summarize", tags=["summarize"])
app.include_router(compare.router, prefix="/compare", tags=["compare"])
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(coll_routes.router, prefix="/collections", tags=["collections"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])


@app.get("/health")
@app.get("/")
def root():
    from app.rag.retrieval.vector_store import VectorStore

    try:
        count = VectorStore().collection.count()
    except Exception:
        count = -1
    return {"status": "running", "indexed_chunks": count}
