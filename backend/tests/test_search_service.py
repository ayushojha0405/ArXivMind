from app.rag.retrieval.search_service import SearchService

service = SearchService()

results = service.search(
    "neural network learning"
)

for result in results:

    print("\n")
    print(result)