# tests/test_pipeline.py
from app.rag.ingestion.pipeline import process_papers

chunks = process_papers(limit=1)

print(chunks[0].metadata)
print(type(chunks[0].metadata))