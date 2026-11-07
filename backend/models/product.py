from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class Product(BaseModel):
    id: str = Field(..., description="Unique product identifier (e.g., prod-headphones-01)")
    name: str = Field(..., description="Product commercial name")
    category: Literal["headphones", "smartwatches", "phones", "accessories"] = Field(...)
    brand: str = Field(..., description="Fictional brand name")
    msrp: float = Field(..., description="Manufacturer's Suggested Retail Price")
    rating: float = Field(..., ge=0, le=5, description="Average review rating")
    review_count: int = Field(..., ge=0, description="Total review count across stores")
    image_url: str = Field(..., description="Placeholder or rendered product image URL")
    description: str = Field(..., description="Short marketing and technical description")
    features: List[str] = Field(default_factory=list, description="Key product highlight features")
