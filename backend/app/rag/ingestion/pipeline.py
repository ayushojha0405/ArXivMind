from app.rag.ingestion.loader import load_papers
from app.rag.ingestion.document_builder import build_document
from app.rag.ingestion.chunker import chunk_document


def process_papers(limit=100):

    all_chunks = []

    papers = load_papers(limit=limit)

    for paper in papers:

        document = build_document(paper)

        chunks = chunk_document(document)

        all_chunks.extend(chunks)

    return all_chunks