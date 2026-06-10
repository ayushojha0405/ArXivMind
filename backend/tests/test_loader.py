from app.rag.ingestion.loader import load_papers

papers = load_papers(limit=3)

print(f"Loaded {len(papers)} papers\n")

for paper in papers:
    print(paper["title"])
    print("-" * 50)