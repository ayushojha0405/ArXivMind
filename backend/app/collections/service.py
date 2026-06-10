from sqlalchemy.orm import Session
from app.models.collections import Collection, SavedPaper, SearchHistory
from app.schemas.collections import CollectionCreate, SavedPaperCreate

class CollectionsService:
    def __init__(self, db: Session):
        self.db = db

    def get_collections(self, user_id: int):
        return self.db.query(Collection).filter(Collection.user_id == user_id).all()

    def create_collection(self, user_id: int, data: CollectionCreate):
        new_col = Collection(user_id=user_id, name=data.name)
        self.db.add(new_col)
        self.db.commit()
        self.db.refresh(new_col)
        return new_col

    def get_saved_papers(self, user_id: int):
        return self.db.query(SavedPaper).filter(SavedPaper.user_id == user_id).order_by(SavedPaper.saved_at.desc()).limit(100).all()

    def save_paper(self, user_id: int, data: SavedPaperCreate):
        paper = SavedPaper(
            user_id=user_id,
            paper_id=data.paper_id,
            title=data.title,
            collection_id=data.collection_id
        )
        self.db.add(paper)
        self.db.commit()
        self.db.refresh(paper)
        return paper

    def record_search(self, user_id: int, query: str):
        history = SearchHistory(user_id=user_id, query=query)
        self.db.add(history)
        self.db.commit()

    def get_search_history(self, user_id: int):
        return self.db.query(SearchHistory).filter(SearchHistory.user_id == user_id).order_by(SearchHistory.searched_at.desc()).limit(20).all()

    def delete_collection(self, user_id: int, collection_id: int):
        collection = self.db.query(Collection).filter(Collection.user_id == user_id, Collection.id == collection_id).first()
        if collection:
            self.db.delete(collection)
            self.db.commit()
            return True
        return False

    def remove_saved_paper(self, user_id: int, paper_id: str):
        # Allow multiple saves of the same paper ID to be deleted if they exist
        papers = self.db.query(SavedPaper).filter(SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id).all()
        if papers:
            for p in papers:
                self.db.delete(p)
            self.db.commit()
            return True
        return False

    def clear_search_history(self, user_id: int):
        self.db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
        self.db.commit()
        return True
