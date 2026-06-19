from fastapi import APIRouter, Depends, HTTPException, Request
from app.summarization.summary_service import SummaryService
from app.schemas.summarize import SummarizeRequest, SummarizeResponse
from app.core.limiter import limiter

router = APIRouter()

summary_service_instance = SummaryService()


def get_summary_service():
    return summary_service_instance


@router.post("/", response_model=SummarizeResponse)
@limiter.limit("10/minute")
async def summarize_paper(
    request: Request,
    payload: SummarizeRequest,
    summary_service: SummaryService = Depends(get_summary_service),
):
    result = await summary_service.summarize_paper_async(paper_id=payload.paper_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    return SummarizeResponse(
        paper_id=result["paper_id"],
        title=result["title"],
        summary=result["summary"],
    )
