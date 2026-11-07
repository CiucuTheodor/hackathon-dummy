from fastapi import APIRouter
from typing import List
from models import StrategicRecommendation
from services import get_llm_service

router = APIRouter(prefix="/api/insights", tags=["Strategic Insights"])

@router.get("/recommendations", response_model=List[StrategicRecommendation])
async def get_recommendations():
    llm = get_llm_service()
    recs = await llm.generate_insights(context={"scope": "executive_brief"})
    return [StrategicRecommendation(**r) for r in recs]
