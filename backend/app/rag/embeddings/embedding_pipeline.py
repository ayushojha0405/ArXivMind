from app.rag.ingestion.pipeline import process_papers
from app.rag.embeddings.embedder import EmbeddingModel
from app.rag.retrieval.vector_store import VectorStore


def store_chunks(limit=10):

    embedder = EmbeddingModel()

    store = VectorStore()

    chunks = process_papers(limit=limit)

    for idx, chunk in enumerate(chunks):

        embedding = embedder.embed_text(
            chunk.page_content
        )

        store.add_document(
            doc_id=f"chunk_{idx}",
            text=chunk.page_content,
            embedding=embedding,
            metadata=chunk.metadata
        )

    print(f"Stored {len(chunks)} chunks")