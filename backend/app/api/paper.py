from fastapi import APIRouter, HTTPException, Depends
from app.schemas.paper import PaperDetail
from app.rag.retrieval.vector_store import VectorStore

router = APIRouter()

vector_store_instance = VectorStore()

def get_vector_store():
    return vector_store_instance

@router.get("/all")
def get_all_papers(store: VectorStore = Depends(get_vector_store)):
    try:
        results = store.collection.get(include=["metadatas"])
        if not results or not results["metadatas"]:
            return []
            
        papers = {}
        for meta in results["metadatas"]:
            paper_id = meta.get("paper_id")
            if paper_id and paper_id not in papers:
                papers[paper_id] = {
                    "paper_id": paper_id,
                    "title": meta.get("title", f"Paper {paper_id}")
                }
                
        return list(papers.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{paper_id}", response_model=PaperDetail)
def get_paper_details(paper_id: str, store: VectorStore = Depends(get_vector_store)):
    try:
        results = store.collection.get(
            where={"paper_id": paper_id},
            include=["metadatas", "documents"]
        )
        if not results or not results["documents"]:
            raise HTTPException(status_code=404, detail="Paper not found")
        
        metadata = results["metadatas"][0]
        document = "\n\n".join(results["documents"])
        
        return PaperDetail(
            paper_id=paper_id,
            categories=metadata.get("categories", ""),
            update_date=metadata.get("update_date", ""),
            title=metadata.get("title", f"Paper {paper_id}"),
            abstract=document[:1000] + "..." if len(document) > 1000 else document,
            authors=metadata.get("authors", "Unknown")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
