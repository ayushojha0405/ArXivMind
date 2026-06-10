from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CollectionBase(BaseModel):
    name: str

class CollectionCreate(CollectionBase):
    pass

class CollectionOut(CollectionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SavedPaperCreate(BaseModel):
    paper_id: str
    title: Optional[str] = None
    collection_id: Optional[int] = None

class SavedPaperOut(BaseModel):
    id: int
    paper_id: str
    title: Optional[str] = None
    collection_id: Optional[int] = None
    saved_at: datetime
    
    class Config:
        from_attributes = True

class SearchHistoryOut(BaseModel):
    id: int
    query: str
    searched_at: datetime
    
    class Config:
        from_attributes = True
