from app.rag.retrieval.vector_store import VectorStore

store = VectorStore()

print("Documents in Collection:", store.collection.count())