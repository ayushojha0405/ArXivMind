from fastapi import APIRouter, Depends, HTTPException, Request
from app.comparison.comparison_service import ComparisonService
from app.schemas.compare import CompareRequest, CompareResponse
from app.core.limiter import limiter

router = APIRouter()

# Instantiate globally to prevent reloading the LLM models on every request
comparison_service_instance = ComparisonService()

def get_comparison_service():
    return comparison_service_instance

@router.post("/", response_model=CompareResponse)
@limiter.limit("10/minute")
def compare_papers(
    request: Request,
    payload: CompareRequest,
    comparison_service: ComparisonService = Depends(get_comparison_service)
):
    result = comparison_service.compare_papers(
        paper_a_id=payload.paper_a_id,
        paper_b_id=payload.paper_b_id
    )
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
        
    return CompareResponse(
        paper_a_id=result["paper_a_id"],
        title_a=result["title_a"],
        paper_b_id=result["paper_b_id"],
        title_b=result["title_b"],
        comparison=result["comparison"]
    )
