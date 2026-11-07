from fastapi import APIRouter, Depends
from typing import Dict, Any
from models import DashboardSummary, StrategicRecommendation
from providers import get_trends_provider, get_comments_provider, get_prices_provider, get_campaigns_provider
from services import get_llm_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    trends_provider = get_trends_provider()
    comments_provider = get_comments_provider()
    prices_provider = get_prices_provider()
    campaigns_provider = get_campaigns_provider()
    llm_service = get_llm_service()

    trends = await trends_provider.get_trends()
    comments = await comments_provider.get_comments(limit=500)
    campaigns = await campaigns_provider.get_campaigns()
    products = await prices_provider.get_products()

    # Calculate aggregate metrics
    rising_trends = [t for t in trends if t["status"] == "Rising"]
    
    pos_count = sum(1 for c in comments if c["sentiment"] == "positive")
    sentiment_pct = round((pos_count / max(1, len(comments))) * 100.0, 1)

    top_campaign = max(campaigns, key=lambda c: c["roi"]) if campaigns else None
    
    # Best deal sample
    best_deal = {
        "product_name": "AuraSound Studio Pro ANC",
        "store": "NovaMart",
        "current_price": 286.99,
        "original_price": 349.99,
        "discount_pct": 18.0,
        "value_score": 88
    }

    # Fetch AI strategic recommendations
    recommendations_data = await llm_service.generate_insights(context={
        "rising_trends_count": len(rising_trends),
        "sentiment_pct": sentiment_pct,
        "top_roi": top_campaign["roi"] if top_campaign else 0
    })

    return DashboardSummary(
        trending_products_count=len(trends),
        rising_trends_count=len(rising_trends),
        average_market_sentiment_pct=sentiment_pct,
        best_deal_summary=best_deal,
        top_campaign_roi_pct=top_campaign["roi"] if top_campaign else 0.0,
        top_campaign_name=top_campaign["name"] if top_campaign else "N/A",
        total_tracked_products=len(products),
        recommendations=[StrategicRecommendation(**r) for r in recommendations_data],
        quick_trends_preview=trends[:6]
    )
