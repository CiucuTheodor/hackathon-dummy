from config import settings
from .llm_base import BaseLLMService
from .mock_llm import MockLLM
from .openrouter_llm import OpenRouterLLM

_mock_llm = MockLLM()
_openrouter_llm = OpenRouterLLM()

def get_llm_service() -> BaseLLMService:
    if settings.LLM_PROVIDER.lower() == "mock":
        return _mock_llm
    # TODO: replace with real provider
    return _openrouter_llm

__all__ = [
    "get_llm_service",
    "BaseLLMService",
    "MockLLM",
    "OpenRouterLLM",
]
