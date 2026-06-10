from fastapi import APIRouter, Depends, Query, Request
from pydantic import BaseModel
from app.rag.qa.qa_service import QAService
from app.schemas.qa import QARequest, QAResponse
from app.core.limiter import limiter

router = APIRouter()

# Instantiate globally to prevent reloading the ML model on every request
qa_service_instance = QAService()

def get_qa_service():
    return qa_service_instance

@router.post("/", response_model=QAResponse)
@limiter.limit("10/minute")
def answer_question(
    request: Request,
    payload: QARequest,
    qa_service: QAService = Depends(get_qa_service)
):
    result = qa_service.answer_question(
        question=payload.question, 
        context_paper_id=payload.context_paper_id
    )
    return QAResponse(
        question=result["question"],
        answer=result["answer"],
        sources=result["sources"]
    )
