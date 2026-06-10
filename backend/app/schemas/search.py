from pydantic import BaseModel
from typing import List
from .paper import PaperResult

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchResponse(BaseModel):
    query: str
    results: List[PaperResult]
    total_found: int
