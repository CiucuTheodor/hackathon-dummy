"""
OpenRouter LLM Service Implementation (OpenAI-compatible SDK).
Uses base_url="https://openrouter.ai/api/v1" and the model specified in config.py / .env.
TODO: replace with real provider / supply OPENROUTER_API_KEY in .env.
"""

from typing import List, Optional, Dict, Any
import httpx
from config import settings
from .llm_base import BaseLLMService

class OpenRouterLLM(BaseLLMService):
    """
    OpenRouter client connecting to OpenAI-compatible chat completion endpoints.
    TODO: replace with real provider when OPENROUTER_API_KEY is supplied.
    """

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.LLM_MODEL or "meta-llama/llama-3.3-70b-instruct"
        self.base_url = "https://openrouter.ai/api/v1"

    async def _call_openrouter(self, messages: List[Dict[str, str]], response_format: Optional[dict] = None) -> str:
        if not self.api_key:
            # TODO: replace with real provider
            raise NotImplementedError(
                "OPENROUTER_API_KEY is not configured in .env. Switch LLM_PROVIDER=mock or provide an OpenRouter API key."
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "MarketPulse AI",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.3
        }
        if response_format:
            payload["response_format"] = response_format

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def generate_insights(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        # TODO: replace with real provider
        prompt = (
            "You are a principal market analyst for consumer electronics. "
            "Based on this market context, generate 4 strategic, high-ROI recommendations. "
            f"Context: {context}"
        )
        # When live: call self._call_openrouter with structured json schema
        raise NotImplementedError("OpenRouterLLM.generate_insights is ready for live API key.")

    async def extract_product_ideas(
        self,
        comments: Optional[List[str]] = None,
        product_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        # TODO: replace with real provider
        raise NotImplementedError("OpenRouterLLM.extract_product_ideas is ready for live API key.")

    async def summarize_comments(self, comments: List[str]) -> Dict[str, Any]:
        # TODO: replace with real provider
        raise NotImplementedError("OpenRouterLLM.summarize_comments is ready for live API key.")
