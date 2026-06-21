from app.rag.embeddings.embedding_pipeline import store_chunks
from dotenv import load_dotenv
import os

load_dotenv()

if __name__ == "__main__":
    from app.core.database import engine, Base, DATABASE_URL
    from app.models import document_chunk
    
    if "postgres" in DATABASE_URL:
        from sqlalchemy import text
        try:
            with engine.begin() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
                conn.execute(text("DROP TABLE IF EXISTS document_chunks CASCADE;"))
        except Exception:
            pass
    Base.metadata.create_all(bind=engine)

    print("Reading from dataset and populating Supabase...")
    store_chunks(limit=50) # Increase this limit if you want more papers
    print("Finished! The Supabase pgvector database is now populated with your dataset vectors.")
