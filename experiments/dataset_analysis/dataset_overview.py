import json

FILE_PATH = "../../datasets/raw/arxiv-metadata-oai-snapshot.json"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    first_line = f.readline()

paper = json.loads(first_line)

print("FIELDS:\n")

for key in paper.keys():
    print(key)

print("\n\nSAMPLE PAPER:\n")
print(paper)