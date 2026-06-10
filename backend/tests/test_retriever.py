from app.rag.retrieval.retriever import Retriever

retriever = Retriever()

results = retriever.search(
    "neural network learning"
)

print(results)