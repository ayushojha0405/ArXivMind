from pydantic import BaseModel

class SummarizeRequest(BaseModel):
    paper_id: str

class SummarizeResponse(BaseModel):
    paper_id: str
    title: str
    summary: str
