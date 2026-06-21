import threading
from app.core.database import SessionLocal
from app.models.document_chunk import DocumentChunk

class PgCollection:
    def count(self):
        with SessionLocal() as db:
            return db.query(DocumentChunk).count()
            
    def query(self, query_embeddings, n_results=5, where=None):
        query_embedding = query_embeddings[0]
        
        with SessionLocal() as db:
            query = db.query(
                DocumentChunk, 
                DocumentChunk.embedding.cosine_distance(query_embedding).label("distance")
            )
            
            if where:
                for k, v in where.items():
                    query = query.filter(DocumentChunk.metadata_[k].astext == str(v))
            
            results = query.order_by("distance").limit(n_results).all()
            
            documents = [[r.DocumentChunk.text for r in results]]
            metadatas = [[r.DocumentChunk.metadata_ for r in results]]
            distances = [[r.distance for r in results]]
            
            return {
                "documents": documents,
                "metadatas": metadatas,
                "distances": distances
            }

class VectorStore:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(VectorStore, cls).__new__(cls)
                cls._instance._init()
        return cls._instance

    def _init(self):
        self.collection = PgCollection()

    def add_document(self, doc_id, text, embedding, metadata):
        clean_metadata = {
            k: str(v) if v is not None else ""
            for k, v in metadata.items()
        }
        with SessionLocal() as db:
            chunk = db.query(DocumentChunk).filter_by(id=doc_id).first()
            if not chunk:
                chunk = DocumentChunk(
                    id=doc_id, 
                    text=text, 
                    embedding=embedding, 
                    metadata_=clean_metadata
                )
                db.add(chunk)
            else:
                chunk.text = text
                chunk.embedding = embedding
                chunk.metadata_ = clean_metadata
            db.commit()
