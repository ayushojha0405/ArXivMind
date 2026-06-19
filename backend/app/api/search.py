from fastapi import APIRouter, Depends, Query, Header, BackgroundTasks
from app.schemas.search import SearchResponse
from app.rag.retrieval.search_service import SearchService
from app.auth.jwt_handler import verify_access_token
from app.collections.service import CollectionsService
from app.core.database import SessionLocal

router = APIRouter()

search_service_instance = SearchService()


def get_search_service():
    return search_service_instance


def run_record_search(token: str, q: str):
    db = SessionLocal()
    try:
        payload = verify_access_token(token)
        user_id = payload.get("id")
        if user_id:
            col_service = CollectionsService(db)
            col_service.record_search(user_id, q)
    except Exception:
        pass
    finally:
        db.close()


@router.get("/", response_model=SearchResponse)
async def search_papers(
    background_tasks: BackgroundTasks,
    q: str = Query(..., description="The search query"),
    top_k: int = Query(20, description="Number of results to return"),
    search_service: SearchService = Depends(get_search_service),
    authorization: str = Header(None),
):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        background_tasks.add_task(run_record_search, token, q)

    results = await search_service.search_async(query=q, top_k=top_k)
    return SearchResponse(
        query=q,
        results=results,
        total_found=len(results),
    )
