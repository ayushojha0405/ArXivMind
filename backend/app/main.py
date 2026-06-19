# app/main.py
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.database import engine, Base, DATABASE_URL
from app.models import user, workspace, session, collections
from app.api import search, paper, qa, summarize, compare, analytics
from app.auth import routes as auth_routes
from app.collections import routes as coll_routes

from app.core.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

import logging
from urllib.parse import urlparse

# Ensure models are imported before create_all
# (models are imported above)

try:  
    parsed_url = urlparse(DATABASE_URL)
    safe_url = f"{parsed_url.scheme}://{parsed_url.username}:***@{parsed_url.hostname}:{parsed_url.port}{parsed_url.path}" if parsed_url.password else DATABASE_URL
    print(f"\n---> Connecting to database: {safe_url}")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("---> PostgreSQL connection successful.")
    print("---> Database tables initialized successfully.\n")
except Exception as e:
    print(f"\n---> Failed to initialize database: {e}\n")

app = FastAPI(title="ArXivMind API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Configure CORS for frontend
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
    return {"status": "running"}