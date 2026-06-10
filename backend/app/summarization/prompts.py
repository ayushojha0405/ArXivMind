from langchain_core.prompts import PromptTemplate

class SummarizationPrompts:
    def __init__(self):
        self.summary_template = """You are an expert AI research assistant named ArXivMind. 
Please provide a comprehensive summary of the following research paper.
Ensure your summary includes:
1. An abstract summary (1-2 paragraphs)
2. Key contributions (bullet points)
3. Limitations (if mentioned)
4. Future work (if mentioned)

Paper Content:
{paper_content}

Summary:
"""
        self.prompt = PromptTemplate(
            template=self.summary_template,
            input_variables=["paper_content"]
        )

    def get_prompt(self):
        return self.prompt
