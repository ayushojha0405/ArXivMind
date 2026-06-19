from langchain_core.documents import Document


def build_document(paper):

    content = (
        f"Title: {paper['title']}\n\n"
        f"Authors: {paper['authors']}\n\n"
        f"Abstract:\n{paper['abstract']}"
    )

    metadata = {
        "paper_id": str(paper["id"]),
        "title": str(paper["title"]),
        "authors": str(paper["authors"]),
        "categories": str(paper["categories"]),
        "doi": str(paper["doi"] or ""),
        "update_date": str(paper["update_date"] or ""),
    }

    return Document(
        page_content=content,
        metadata=metadata,
    )
