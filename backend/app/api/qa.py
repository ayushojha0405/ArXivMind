from fastapi import APIRouter, Depends, Request
from app.rag.qa.qa_service import QAService
from app.schemas.qa import QARequest, QAResponse
from app.core.limiter import limiter

router = APIRouter()

qa_service_instance = QAService()


def get_qa_service():
    return qa_service_instance


@router.post("/", response_model=QAResponse)
@limiter.limit("10/minute")
async def answer_question(
    request: Request,
    payload: QARequest,
    qa_service: QAService = Depends(get_qa_service),
):
    result = await qa_service.answer_question_async(
        question=payload.question,
        context_paper_id=payload.context_paper_id,
    )
    return QAResponse(
        question=result["question"],
        answer=result["answer"],
        sources=result["sources"],
    )
