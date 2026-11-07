from fastapi import APIRouter, HTTPException
from typing import List
from models import Campaign, CampaignSummary
from providers import get_campaigns_provider

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

@router.get("", response_model=List[Campaign])
async def list_campaigns():
    provider = get_campaigns_provider()
    campaigns = await provider.get_campaigns()
    return [Campaign(**c) for c in campaigns]

@router.get("/summary", response_model=CampaignSummary)
async def get_campaigns_summary():
    provider = get_campaigns_provider()
    campaigns = await provider.get_campaigns()
    
    total_spend = sum(c["spend"] for c in campaigns)
    total_revenue = sum(c["revenue"] for c in campaigns)
    total_conversions = sum(c["conversions"] for c in campaigns)
    total_impressions = sum(c["impressions"] for c in campaigns)
    total_clicks = sum(c["clicks"] for c in campaigns)

    blended_ctr = round((total_clicks / max(1, total_impressions)) * 100.0, 2)
    blended_roi = round(((total_revenue - total_spend) / max(1.0, total_spend)) * 100.0, 1)

    return CampaignSummary(
        total_spend=total_spend,
        total_revenue=total_revenue,
        total_conversions=total_conversions,
        blended_ctr=blended_ctr,
        blended_roi=blended_roi,
        campaigns=[Campaign(**c) for c in campaigns]
    )

@router.get("/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    provider = get_campaigns_provider()
    campaign = await provider.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail=f"Campaign '{campaign_id}' not found")
    return Campaign(**campaign)
