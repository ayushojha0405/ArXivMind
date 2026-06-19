from app.rag.embeddings.embedding_pipeline import store_chunks
from dotenv import load_dotenv
import os

load_dotenv()

if __name__ == "__main__":
    print("Reading from dataset and populating ChromaDB...")
    store_chunks(limit=50) # Increase this limit if you want more papers
    print("Finished! The backend/chroma_db folder is now populated with your dataset vectors.")
