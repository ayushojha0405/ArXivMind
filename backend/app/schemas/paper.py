from pydantic import BaseModel
from typing import Optional

class PaperBase(BaseModel):
    paper_id: str
    categories: str
    update_date: str

class PaperResult(PaperBase):
    score: float
    preview: str

class PaperDetail(PaperBase):
    title: Optional[str] = None
    abstract: Optional[str] = None
    authors: Optional[str] = None
    url: Optional[str] = None
