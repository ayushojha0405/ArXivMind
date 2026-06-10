from pydantic import BaseModel

class CompareRequest(BaseModel):
    paper_a_id: str
    paper_b_id: str

class CompareResponse(BaseModel):
    paper_a_id: str
    title_a: str
    paper_b_id: str
    title_b: str
    comparison: str
