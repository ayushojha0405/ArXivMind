from pydantic import BaseModel
from typing import List, Any
from app.schemas.paper import PaperResult

class QARequest(BaseModel):
    question: str
    context_paper_id: str | None = None

class QAResponse(BaseModel):
    question: str
    answer: str
    sources: List[PaperResult]
