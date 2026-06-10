import json
from collections import Counter
from pathlib import Path
from tqdm import tqdm

BASE_DIR = Path(__file__).resolve().parents[2]

FILE_PATH = BASE_DIR / "datasets" / "raw" / "arxiv-metadata-oai-snapshot.json"

category_counter = Counter()

with open(FILE_PATH, "r", encoding="utf-8") as f:
    for line in tqdm(f):
        paper = json.loads(line)

        categories = paper["categories"].split()

        for cat in categories:
            category_counter[cat] += 1

print("\nTop 50 Categories:\n")

for category, count in category_counter.most_common(50):
    print(f"{category}: {count}")