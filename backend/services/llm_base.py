from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class BaseLLMService(ABC):
    @abstractmethod
    async def generate_insights(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Synthesize market trends, price volatility, and consumer sentiment into strategic recommendations."""
        pass

    @abstractmethod
    async def extract_product_ideas(
        self,
        comments: Optional[List[str]] = None,
        product_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Transform raw customer feedback/wishes into structured product innovation ideas."""
        pass

    @abstractmethod
    async def summarize_comments(self, comments: List[str]) -> Dict[str, Any]:
        """Summarize key sentiments and topics from a batch of comments."""
        pass
