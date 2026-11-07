from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class StorePrice(BaseModel):
    store_id: str
    store_name: str
    price: float
    original_price: float
    discount_pct: float
    in_stock: bool
    shipping_cost: float
    is_best_deal: bool = False
    affiliate_url: str

class DailyPricePoint(BaseModel):
    date: str
    store_prices: dict  # {"NovaMart": 199.99, "ElectroNest": 209.00, ...}
    lowest_price: float
    average_price: float

class ValueScoreBreakdown(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall value for money score")
    price_competitiveness: int = Field(..., ge=0, le=100)
    feature_density: int = Field(..., ge=0, le=100)
    sentiment_bonus: int = Field(..., ge=0, le=100)
    verdict: str = Field(..., description="E.g., Outstanding Value, Fair Market Price, Overpriced")
    recommendation: str

class ProductPriceComparison(BaseModel):
    product_id: str
    product_name: str
    msrp: float
    lowest_price: float
    highest_price: float
    average_price: float
    best_store_name: str
    stores: List[StorePrice]
    value_analysis: ValueScoreBreakdown
    price_history_30d: List[DailyPricePoint]
