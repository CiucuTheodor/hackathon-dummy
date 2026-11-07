from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings, get_cors_origins
from routers import (
    dashboard_router,
    trends_router,
    comments_router,
    products_router,
    campaigns_router,
    insights_router,
)

app = FastAPI(
    title="MarketPulse AI API",
    description=(
        "Market Intelligence Backend MVP combining TrendHunter, Comment2Product, "
        "PriceWise, and Campaign Optimizer. Powered by clean data providers and pluggable LLM interfaces."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js dev server and external clients
origins = get_cors_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST Routers
app.include_router(dashboard_router)
app.include_router(trends_router)
app.include_router(comments_router)
app.include_router(products_router)
app.include_router(campaigns_router)
app.include_router(insights_router)

@app.get("/")
async def root():
    return {
        "app": "MarketPulse AI Backend",
        "status": "operational",
        "mode": "mock" if settings.USE_MOCK_DATA else "live",
        "llm_provider": settings.LLM_PROVIDER,
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "use_mock_data": settings.USE_MOCK_DATA,
        "llm_provider": settings.LLM_PROVIDER,
        "model": settings.LLM_MODEL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
