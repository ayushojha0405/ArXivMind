from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers.jsonl"
OUTPUT_FILE = BASE_DIR / "datasets" / "processed" / "ai_research_papers_dev.jsonl"

LIMIT = 50000

count = 0

with open(INPUT_FILE, "r", encoding="utf-8") as infile, \
     open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:

    for line in infile:
        outfile.write(line)
        count += 1

        if count >= LIMIT:
            break

print(f"Saved {count} papers")