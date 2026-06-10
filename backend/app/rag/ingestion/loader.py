import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[4]

DATASET_PATH = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "ai_research_papers_clean.jsonl"
)

def load_papers(limit=None):
    papers = []

    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            paper = json.loads(line)
            papers.append(paper)

            if limit and idx + 1 >= limit:
                break

    return papers