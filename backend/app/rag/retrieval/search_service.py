from app.rag.retrieval.retriever import Retriever


class SearchService:

    def __init__(self):

        self.retriever = Retriever()

    def search(self, query, top_k=20, filter_paper_id=None, unique_papers=True):

        where_clause = {"paper_id": filter_paper_id} if filter_paper_id else None

        # Fetch more chunks to increase the chance of finding top_k unique papers if unique_papers is True
        fetch_k = top_k * 4 if unique_papers else top_k
        
        results = self.retriever.search(
            query=query,
            top_k=fetch_k,
            where=where_clause
        )

        formatted_results = []
        seen_paper_ids = set()

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        for doc, metadata, distance in zip(
            documents,
            metadatas,
            distances
        ):
            paper_id = metadata["paper_id"]
            
            if unique_papers:
                if paper_id in seen_paper_ids:
                    continue
                seen_paper_ids.add(paper_id)
            
            formatted_results.append(
                {
                    "paper_id": paper_id,
                    "categories": metadata.get("categories", ""),
                    "update_date": metadata.get("update_date", ""),
                    "score": round(1 - distance, 4),
                    "preview": doc[:300]
                }
            )
            
            if len(formatted_results) >= top_k:
                break

        return formatted_results