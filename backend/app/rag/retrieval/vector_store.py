import chromadb


class VectorStore:

    def __init__(self):

        import os
        db_path = os.environ.get("CHROMA_DB_PATH", "./chroma_db")
        self.client = chromadb.PersistentClient(
            path=db_path
        )

        self.collection = self.client.get_or_create_collection(
            name="arxivmind"
        )

    def add_document(
        self,
        doc_id,
        text,
        embedding,
        metadata
    ):

        clean_metadata = {
            k: str(v) if v is not None else ""
            for k, v in metadata.items()
        }

        self.collection.add(
            ids=[doc_id],
            documents=[text],
            embeddings=[embedding],
            metadatas=[clean_metadata]
        )