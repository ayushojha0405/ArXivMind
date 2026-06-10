import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers_clean.jsonl"

with open(FILE, "r", encoding="utf-8") as f:
    first = json.loads(f.readline())

print(first)