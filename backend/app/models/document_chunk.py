from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    embedding = Column(Vector())
    metadata_ = Column("metadata", JSONB)
