class ContextBuilder:
    def build_context(self, search_results):
        """
        Takes the raw search results (list of dicts) and formats them into a single string
        context block for the LLM.
        """
        if not search_results:
            return "No context available."
            
        context_parts = []
        for i, res in enumerate(search_results):
            paper_id = res.get("paper_id", f"Doc {i+1}")
            preview = res.get("preview", "")
            context_parts.append(f"--- Document: {paper_id} ---\n{preview}\n")
            
        return "\n".join(context_parts)
