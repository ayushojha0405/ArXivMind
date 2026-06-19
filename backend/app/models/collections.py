from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.core.database import Base


class Collection(Base):
    __tablename__ = "collections"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SavedPaper(Base):
    __tablename__ = "saved_papers"
    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    paper_id = Column(String, nullable=False)
    title = Column(String, nullable=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (Index("ix_saved_papers_user_paper", "user_id", "paper_id"),)


class SearchHistory(Base):
    __tablename__ = "search_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    query = Column(String, nullable=False)
    searched_at = Column(DateTime(timezone=True), server_default=func.now())
