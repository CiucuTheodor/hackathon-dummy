from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import TrendSummary, TrendDetail
from providers import get_trends_provider

router = APIRouter(prefix="/api/trends", tags=["Trends"])

@router.get("", response_model=List[TrendSummary])
async def list_trends(
    category: Optional[str] = Query(None, description="Filter by category (headphones, smartwatches, phones, accessories)"),
    search: Optional[str] = Query(None, description="Search keyword or product name")
):
    provider = get_trends_provider()
    trends = await provider.get_trends(category=category, search=search)
    return [TrendSummary(**t) for t in trends]

@router.get("/{trend_id}/forecast", response_model=TrendDetail)
async def get_trend_forecast(trend_id: str):
    provider = get_trends_provider()
    detail = await provider.get_trend_forecast(trend_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Trend '{trend_id}' not found")
    return TrendDetail(**detail)
