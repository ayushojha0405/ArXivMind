from app.rag.ingestion.loader import load_papers
from app.rag.ingestion.document_builder import build_document
from app.rag.ingestion.chunker import chunk_document

paper = load_papers(limit=1)[0]

document = build_document(paper)

print("DOCUMENT LENGTH:", len(document.page_content))

chunks = chunk_document(document)

print(f"\nTotal Chunks: {len(chunks)}\n")

for i, chunk in enumerate(chunks):
    print(f"\nChunk {i+1}")
    print("=" * 60)
    print("Length:", len(chunk.page_content))
    print(chunk.page_content[:500])