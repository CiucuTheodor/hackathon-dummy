import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "MarketPulse AI Backend"
    USE_MOCK_DATA: bool = True
    LLM_PROVIDER: str = "mock"  # "mock" or "openrouter"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Future integrations (empty stubs)
    OPENROUTER_API_KEY: str = ""
    LLM_MODEL: str = "meta-llama/llama-3.3-70b-instruct"
    YOUTUBE_API_KEY: str = ""
    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

def get_cors_origins() -> List[str]:
    return [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
