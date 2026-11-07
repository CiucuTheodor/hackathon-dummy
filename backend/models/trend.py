from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class WeeklyTrendPoint(BaseModel):
    week_start: str = Field(..., description="ISO date for the start of the week (YYYY-MM-DD)")
    score: int = Field(..., ge=0, le=100, description="Normalized search interest score (0-100)")

class ForecastPoint(BaseModel):
    week_start: str = Field(..., description="ISO date for forecasted week (YYYY-MM-DD)")
    predicted_score: int = Field(..., ge=0, le=100, description="Predicted median search interest")
    confidence_lower: int = Field(..., ge=0, le=100, description="Lower bound of 90% confidence band")
    confidence_upper: int = Field(..., ge=0, le=100, description="Upper bound of 90% confidence band")
    is_forecast: bool = Field(default=True)

class TrendSummary(BaseModel):
    id: str = Field(..., description="Trend keyword / product identifier")
    product_id: Optional[str] = None
    keyword: str
    category: str
    current_score: int = Field(..., ge=0, le=100)
    previous_score: int = Field(..., ge=0, le=100)
    change_pct: float = Field(..., description="Percentage change in interest over last 4 weeks")
    status: Literal["Rising", "Stable", "Declining"]
    velocity_rank: int = Field(..., description="Rank in velocity acceleration")
    is_next_big_trend: bool = Field(default=False)

class TrendDetail(TrendSummary):
    history: List[WeeklyTrendPoint]
    forecast: List[ForecastPoint]
