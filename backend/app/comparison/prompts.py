from langchain_core.prompts import PromptTemplate

class ComparisonPrompts:
    def __init__(self):
        self.comparison_template = """You are an expert AI research assistant named ArXivMind.
Please compare the two research papers provided below.

Provide a structured and highly concise comparison (maximum 300 words) covering:
1. Similarities (shared concepts, domains, or techniques)
2. Differences (distinct approaches, architectures, or goals)
3. Methodology Comparison
4. Results Comparison (who achieved what, metrics differences)

Keep your sentences punchy and avoid unnecessary fluff to ensure extremely fast processing.

Paper A (Title: {title_a}):
{content_a}

---
Paper B (Title: {title_b}):
{content_b}

Comparison:
"""
        self.prompt = PromptTemplate(
            template=self.comparison_template,
            input_variables=["title_a", "content_a", "title_b", "content_b"]
        )

    def get_prompt(self):
        return self.prompt
