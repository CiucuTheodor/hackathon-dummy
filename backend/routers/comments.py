from fastapi import APIRouter, Query
from typing import List, Optional
from models import SocialComment, PainPointCluster, ProductIdea, ProductIdeaRequest, CommentSentimentStats
from providers import get_comments_provider
from services import get_llm_service

router = APIRouter(prefix="/api/comments", tags=["Comments"])

@router.get("", response_model=List[SocialComment])
async def list_comments(
    product_id: Optional[str] = Query(None, description="Filter by product ID"),
    source: Optional[str] = Query(None, description="Filter by source (youtube, reddit, tiktok)"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment (positive, neutral, negative)"),
    search: Optional[str] = Query(None, description="Text search inside comments"),
    limit: int = Query(100, ge=1, le=500)
):
    provider = get_comments_provider()
    comments = await provider.get_comments(
        product_id=product_id,
        source=source,
        sentiment=sentiment,
        search=search,
        limit=limit
    )
    return [SocialComment(**c) for c in comments]

@router.get("/clusters", response_model=List[PainPointCluster])
async def get_clusters(category: Optional[str] = Query(None)):
    provider = get_comments_provider()
    clusters = await provider.get_clusters(category=category)
    return [PainPointCluster(**c) for c in clusters]

@router.get("/stats", response_model=CommentSentimentStats)
async def get_comment_stats():
    provider = get_comments_provider()
    all_comments = await provider.get_comments(limit=1000)
    total = len(all_comments)
    if total == 0:
        return CommentSentimentStats(
            total_comments=0,
            positive_pct=0,
            neutral_pct=0,
            negative_pct=0,
            source_distribution={}
        )

    pos = sum(1 for c in all_comments if c["sentiment"] == "positive")
    neu = sum(1 for c in all_comments if c["sentiment"] == "neutral")
    neg = sum(1 for c in all_comments if c["sentiment"] == "negative")

    sources = {}
    for c in all_comments:
        src = c["source"]
        sources[src] = sources.get(src, 0) + 1

    return CommentSentimentStats(
        total_comments=total,
        positive_pct=round((pos / total) * 100, 1),
        neutral_pct=round((neu / total) * 100, 1),
        negative_pct=round((neg / total) * 100, 1),
        source_distribution=sources
    )

@router.post("/product-ideas", response_model=List[ProductIdea])
async def generate_product_ideas(request: ProductIdeaRequest = ProductIdeaRequest()):
    llm = get_llm_service()
    ideas_data = await llm.extract_product_ideas(
        comments=request.comments,
        product_id=request.product_id
    )
    return [ProductIdea(**idea) for idea in ideas_data]
