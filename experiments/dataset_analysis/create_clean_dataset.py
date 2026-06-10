import json
from pathlib import Path
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers_dev.jsonl"
OUTPUT_FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers_clean.jsonl"

with open(INPUT_FILE, "r", encoding="utf-8") as infile, \
     open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:

    for line in tqdm(infile):
        paper = json.loads(line)

        cleaned = {
            "id": paper.get("id"),
            "title": paper.get("title", "").strip(),
            "authors": paper.get("authors", ""),
            "abstract": paper.get("abstract", "").strip(),
            "categories": paper.get("categories", ""),
            "doi": paper.get("doi"),
            "update_date": paper.get("update_date")
        }

        outfile.write(json.dumps(cleaned) + "\n")

print("Clean dataset created successfully")