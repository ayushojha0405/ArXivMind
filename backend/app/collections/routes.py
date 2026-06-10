from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.collections import CollectionCreate, CollectionOut, SavedPaperCreate, SavedPaperOut, SearchHistoryOut
from app.collections.service import CollectionsService
from app.auth.jwt_handler import verify_access_token

router = APIRouter()

def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ")[1]
    payload = verify_access_token(token)
    return payload.get("id")

@router.get("/collections", response_model=List[CollectionOut])
def get_collections(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    return service.get_collections(user_id)

@router.post("/collections", response_model=CollectionOut)
def create_collection(data: CollectionCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    return service.create_collection(user_id, data)

@router.get("/saved", response_model=List[SavedPaperOut])
def get_saved_papers(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    return service.get_saved_papers(user_id)

@router.post("/saved", response_model=SavedPaperOut)
def save_paper(data: SavedPaperCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    return service.save_paper(user_id, data)
@router.get("/history", response_model=List[SearchHistoryOut])
def get_search_history(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    return service.get_search_history(user_id)

@router.delete("/collections/{collection_id}")
def delete_collection(collection_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    success = service.delete_collection(user_id, collection_id)
    if not success:
        raise HTTPException(status_code=404, detail="Collection not found")
    return {"message": "Collection deleted successfully"}

@router.delete("/saved/{paper_id}")
def remove_saved_paper(paper_id: str, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    success = service.remove_saved_paper(user_id, paper_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved paper not found")
    return {"message": "Saved paper removed successfully"}

@router.delete("/history")
def clear_search_history(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    service = CollectionsService(db)
    service.clear_search_history(user_id)
    return {"message": "Search history cleared successfully"}
