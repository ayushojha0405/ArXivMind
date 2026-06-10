from app.rag.ingestion.pipeline import process_papers

chunks = process_papers(limit=1000)

print("Chunks:", len(chunks))