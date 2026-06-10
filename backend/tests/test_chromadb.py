from app.rag.retrieval.vector_store import VectorStore

store = VectorStore()

print("Collection Name:")
print(store.collection.name)