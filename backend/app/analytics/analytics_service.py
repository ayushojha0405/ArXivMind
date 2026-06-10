from app.rag.retrieval.vector_store import VectorStore

class AnalyticsService:
    def __init__(self):
        self.vector_store = VectorStore()

    def get_category_trends(self):
        # In a production app, we would query ChromaDB for all categories and aggregate.
        # For demonstration, we return simulated trending categories.
        return [
            {"category": "cs.CL", "count": 1250, "label": "Computation and Language (NLP)"},
            {"category": "cs.CV", "count": 980, "label": "Computer Vision"},
            {"category": "cs.LG", "count": 1500, "label": "Machine Learning"},
            {"category": "cs.AI", "count": 1100, "label": "Artificial Intelligence"}
        ]

    def get_publication_trends(self):
        # Simulated publication trends over months
        return [
            {"month": "Jan", "count": 45},
            {"month": "Feb", "count": 52},
            {"month": "Mar", "count": 78},
            {"month": "Apr", "count": 110},
            {"month": "May", "count": 145},
            {"month": "Jun", "count": 180}
        ]
