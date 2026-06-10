import json
from pathlib import Path
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = BASE_DIR / "datasets" / "raw" / "arxiv-metadata-oai-snapshot.json"
OUTPUT_FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers.jsonl"

AI_CATEGORIES = {
    "cs.AI",
    "cs.LG",
    "cs.CL",
    "cs.CV",
    "cs.RO",
    "cs.NE",
    "stat.ML"
}

count = 0

with open(INPUT_FILE, "r", encoding="utf-8") as infile, \
     open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:

    for line in tqdm(infile):
        paper = json.loads(line)

        paper_categories = set(paper["categories"].split())

        if AI_CATEGORIES.intersection(paper_categories):
            outfile.write(json.dumps(paper) + "\n")
            count += 1

print(f"\nSaved {count} AI papers")