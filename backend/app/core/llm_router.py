import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.language_models.chat_models import BaseChatModel

class LLMRouter:
    """
    Intelligent Cost-Aware LLM Router.
    Routes heavy tasks with large context windows to Google Gemini (massive context window).
    Routes lightweight conversational tasks to HuggingFace (fast, open-source models).
    """
    def __init__(self):
        # Initialize Heavyweight Model
        self.heavy_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            temperature=0.3,
            max_retries=3,
            google_api_key=os.environ.get("GEMINI_API_KEY", "dummy_key_to_prevent_crash")
        )

        # Initialize Lightweight Model
        hf_api_token = os.environ.get("HUGGINGFACEHUB_API_TOKEN")
        if hf_api_token and hf_api_token != "your-token-here":
            llm = HuggingFaceEndpoint(
                repo_id="mistralai/Mistral-7B-Instruct-v0.2",
                task="text-generation",
                max_new_tokens=512,
                top_k=50,
                temperature=0.1,
                repetition_penalty=1.03,
                huggingfacehub_api_token=hf_api_token
            )
            self.light_llm = ChatHuggingFace(llm=llm)
        else:
            self.light_llm = self.heavy_llm # Fallback to heavy if no HF token

    def get_llm(self, task_type: str, context_length: int = 0) -> BaseChatModel:
        """
        Dynamically route to the best LLM.
        :param task_type: "summarize", "compare", or "qa"
        :param context_length: Estimated length of context/documents in characters.
        """
        # Route everything to Gemini. It's fast, handles massive contexts, 
        # and avoids the unreliability of the HuggingFace free tier endpoints.
        print(f"[Router] Routing {task_type} task (Context: {context_length} chars) to Gemini (Heavyweight)")
        return self.heavy_llm
