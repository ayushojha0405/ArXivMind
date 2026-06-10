from app.rag.embeddings.embedder import EmbeddingModel

model = EmbeddingModel()

embedding = model.embed_text(
    "Retrieval Augmented Generation improves factual accuracy."
)

print("Embedding Dimensions:", len(embedding))

print("\nFirst 10 values:\n")

print(embedding[:10])