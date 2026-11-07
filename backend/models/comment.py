from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class SocialComment(BaseModel):
    id: str
    product_id: str
    product_name: str
    source: Literal["youtube", "reddit", "tiktok"]
    author: str
    text: str
    sentiment: Literal["positive", "neutral", "negative"]
    likes: int
    created_at: str
    tags: List[str] = Field(default_factory=list)

class PainPointCluster(BaseModel):
    id: str
    topic: str
    category: str
    sentiment: Literal["negative", "neutral", "positive"]
    comment_count: int
    sample_quotes: List[str]
    suggested_action: str

class ProductIdea(BaseModel):
    id: str
    name: str
    problem_solved: str
    target_audience: str
    supporting_comment_count: int
    key_features: List[str]
    demand_level: Literal["High", "Medium", "Niche"]
    feasibility_score: int = Field(..., ge=0, le=100)

class ProductIdeaRequest(BaseModel):
    comments: Optional[List[str]] = Field(None, description="Optional custom comments to analyze live")
    product_id: Optional[str] = Field(None, description="Optional product focus")

class CommentSentimentStats(BaseModel):
    total_comments: int
    positive_pct: float
    neutral_pct: float
    negative_pct: float
    source_distribution: dict
