from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class DailyCampaignPoint(BaseModel):
    date: str
    spend: float
    impressions: int
    clicks: int
    conversions: int
    revenue: float

class Campaign(BaseModel):
    id: str
    name: str
    platform: Literal["Google Ads", "Meta Ads", "TikTok Ads", "YouTube Ads"]
    status: Literal["Active", "Paused", "Optimizing"]
    product_focus: str
    spend: float
    revenue: float
    impressions: int
    clicks: int
    conversions: int
    ctr: float = Field(..., description="Click-through rate in percentage")
    cpc: float = Field(..., description="Cost per click")
    cpa: float = Field(..., description="Cost per acquisition")
    roi: float = Field(..., description="Return on investment percentage (e.g., 280%)")
    roas: float = Field(..., description="Return on ad spend multiplier (e.g. 3.8x)")
    ai_suggestions: List[str] = Field(default_factory=list)
    daily_history: List[DailyCampaignPoint] = Field(default_factory=list)

class CampaignSummary(BaseModel):
    total_spend: float
    total_revenue: float
    total_conversions: int
    blended_ctr: float
    blended_roi: float
    campaigns: List[Campaign]
