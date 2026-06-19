from app.rag.ingestion.pipeline import process_papers
from app.rag.embeddings.embedder import EmbeddingModel
from app.rag.retrieval.vector_store import VectorStore

BATCH_SIZE = 32


def store_chunks(limit=10):

    embedder = EmbeddingModel()
    store = VectorStore()
    chunks = process_papers(limit=limit)

    for batch_start in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[batch_start : batch_start + BATCH_SIZE]
        texts = [chunk.page_content for chunk in batch]
        embeddings = embedder.model.embed_documents(texts)

        for idx, (chunk, embedding) in enumerate(zip(batch, embeddings)):
            global_idx = batch_start + idx
            store.add_document(
                doc_id=f"chunk_{global_idx}",
                text=chunk.page_content,
                embedding=embedding,
                metadata=chunk.metadata,
            )

    print(f"Stored {len(chunks)} chunks")
