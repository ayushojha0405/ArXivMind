import os

import chromadb


class VectorStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStore, cls).__new__(cls)
            cls._instance._init()
        return cls._instance

    def _init(self):
        chroma_host = os.environ.get("CHROMA_HOST")
        if chroma_host:
            port = int(os.environ.get("CHROMA_PORT", "8000"))
            ssl = os.environ.get("CHROMA_SSL", "false").lower() == "true"
            headers = {}
            api_key = os.environ.get("CHROMA_API_KEY")
            if api_key:
                headers["Authorization"] = f"Bearer {api_key}"
            self.client = chromadb.HttpClient(
                host=chroma_host,
                port=port,
                ssl=ssl,
                headers=headers or None,
            )
        else:
            db_path = os.environ.get("CHROMA_DB_PATH", "./chroma_db")
            self.client = chromadb.PersistentClient(path=db_path)

        self.collection = self.client.get_or_create_collection(
            name="arxivmind",
            metadata={"hnsw:space": "cosine"},
        )

    def add_document(self, doc_id, text, embedding, metadata):
        clean_metadata = {
            k: str(v) if v is not None else ""
            for k, v in metadata.items()
        }
        self.collection.add(
            ids=[doc_id],
            documents=[text],
            embeddings=[embedding],
            metadatas=[clean_metadata],
        )
