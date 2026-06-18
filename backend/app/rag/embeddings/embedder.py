import os
import requests

class EmbeddingModel:
    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5"
        token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
        self.headers = {"Authorization": f"Bearer {token}"}

    def embed_text(self, text):
        response = requests.post(self.api_url, headers=self.headers, json={"inputs": text})
        if response.status_code == 200:
            res = response.json()
            if isinstance(res, list) and len(res) > 0 and isinstance(res[0], list):
                return res[0]
            return res
        else:
            raise Exception(f"HF API Error: {response.text}")