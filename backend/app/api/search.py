from fastapi import APIRouter, Depends, Query, Header
from app.schemas.search import SearchResponse
from app.rag.retrieval.search_service import SearchService
from app.auth.jwt_handler import verify_access_token
from app.collections.service import CollectionsService
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# Instantiate globally to prevent reloading the ML model on every request
search_service_instance = SearchService()

def get_search_service():
    return search_service_instance

@router.get("/", response_model=SearchResponse)
def search_papers(
    q: str = Query(..., description="The search query"),
    top_k: int = Query(20, description="Number of results to return"),
    search_service: SearchService = Depends(get_search_service),
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    # Optionally record search if user is authenticated
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            payload = verify_access_token(token)
            user_id = payload.get("id")
            if user_id:
                col_service = CollectionsService(db)
                col_service.record_search(user_id, q)
        except Exception:
            pass # Ignore invalid tokens for anonymous search

    results = search_service.search(query=q, top_k=top_k)
    return SearchResponse(
        query=q,
        results=results,
        total_found=len(results)
    )
