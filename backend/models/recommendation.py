from pydantic import BaseModel, Field
from typing import List, Literal

class StrategicRecommendation(BaseModel):
    id: str
    title: str
    category: Literal["pricing", "product", "marketing", "trend"]
    impact: Literal["High", "Medium", "Critical"]
    effort: Literal["Low", "Medium", "High"]
    summary: str
    action_steps: List[str]
    supporting_metric: str

class DashboardSummary(BaseModel):
    trending_products_count: int
    rising_trends_count: int
    average_market_sentiment_pct: float
    best_deal_summary: dict
    top_campaign_roi_pct: float
    top_campaign_name: str
    total_tracked_products: int
    recommendations: List[StrategicRecommendation]
    quick_trends_preview: List[dict]
