from app.rag.ingestion.loader import load_papers
from app.rag.ingestion.document_builder import build_document

paper = load_papers(limit=1)[0]

doc = build_document(paper)

print("\nPAGE CONTENT:\n")
print(doc.page_content[:500])

print("\nMETADATA:\n")
print(doc.metadata)