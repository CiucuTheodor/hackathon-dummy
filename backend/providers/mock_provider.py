import os
import json
from typing import List, Optional, Dict, Any
from .base import BaseTrendsProvider, BaseCommentsProvider, BasePricesProvider, BaseCampaignsProvider

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def _load_json(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

class MockTrendsProvider(BaseTrendsProvider):
    def __init__(self):
        self._trends = _load_json("trends.json")

    async def get_trends(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self._trends
        if category and category != "all":
            results = [t for t in results if t.get("category") == category]
        if search:
            q = search.lower()
            results = [t for t in results if q in t.get("keyword", "").lower()]
        
        # Return summary without bulky history to keep list queries fast
        summaries = []
        for t in results:
            summaries.append({
                "id": t["id"],
                "product_id": t.get("product_id"),
                "keyword": t["keyword"],
                "category": t["category"],
                "current_score": t["current_score"],
                "previous_score": t["previous_score"],
                "change_pct": t["change_pct"],
                "status": t["status"],
                "velocity_rank": t["velocity_rank"],
                "is_next_big_trend": t.get("is_next_big_trend", False)
            })
        return summaries

    async def get_trend_forecast(self, trend_id: str) -> Optional[Dict[str, Any]]:
        for t in self._trends:
            if t["id"] == trend_id or t.get("product_id") == trend_id:
                return t
        return None

class MockCommentsProvider(BaseCommentsProvider):
    def __init__(self):
        self._comments = _load_json("comments.json")

    async def get_comments(
        self,
        product_id: Optional[str] = None,
        source: Optional[str] = None,
        sentiment: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        results = self._comments
        if product_id and product_id != "all":
            results = [c for c in results if c.get("product_id") == product_id]
        if source and source != "all":
            results = [c for c in results if c.get("source") == source]
        if sentiment and sentiment != "all":
            results = [c for c in results if c.get("sentiment") == sentiment]
        if search:
            q = search.lower()
            results = [c for c in results if q in c.get("text", "").lower() or q in c.get("product_name", "").lower()]
        return results[:limit]

    async def get_clusters(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        # Predefined clustered insights derived from social feedback
        clusters = [
            {
                "id": "clust-battery-01",
                "topic": "Battery Degradation & Glitches",
                "category": "headphones",
                "sentiment": "negative",
                "comment_count": 48,
                "sample_quotes": [
                    "Battery degraded from 2 days to barely 8 hours after 6 months of daily use.",
                    "Battery indicator jumps wildly from 40% straight to 5% without warning.",
                    "Why doesn't this support faster charging? 2.5 hours feels archaic."
                ],
                "suggested_action": "Engineer user-replaceable battery cells or adopt silicon-carbon battery chemistry with 20-min fast boost."
            },
            {
                "id": "clust-comfort-01",
                "topic": "Severe Earcup Clamping Pressure & Glasses Pinch",
                "category": "headphones",
                "sentiment": "negative",
                "comment_count": 39,
                "sample_quotes": [
                    "Clamp force is way too tight! My glasses hurt against my temples after just 30 minutes.",
                    "Ear pads get sweaty within minutes during summer. Silicone or breathable mesh options should be standard.",
                    "The headband padding is paper thin."
                ],
                "suggested_action": "Introduce dual-density memory foam with specialized glasses-relief channels and cooling gel."
            },
            {
                "id": "clust-anc-01",
                "topic": "Acoustic Vacuum / Eardrum Cabin Pressure",
                "category": "headphones",
                "sentiment": "negative",
                "comment_count": 34,
                "sample_quotes": [
                    "The noise cancellation creates this terrible eardrum cabin pressure feeling.",
                    "Heavy vacuum sensation whenever ANC switches into high mode.",
                    "ANC produces a noticeable high-frequency hiss in quiet rooms."
                ],
                "suggested_action": "Implement a pressure-equalizing micro-vent valve and granular 10-step adjustable ANC sliders."
            },
            {
                "id": "clust-open-ear-01",
                "topic": "Demand for Situational Awareness & Outdoor Safety",
                "category": "headphones",
                "sentiment": "positive",
                "comment_count": 52,
                "sample_quotes": [
                    "I wish someone would create an open-ear headphone with deep sub-bass and magnetic detachable charging pins.",
                    "Directional sound beam means I can hear approaching bicycles while still enjoying podcasts."
                ],
                "suggested_action": "Develop clip-on open-ear earbuds with air conduction and titanium bone anchors."
            },
            {
                "id": "clust-watch-battery-01",
                "topic": "Outdoor GPS Watch Longevity vs Weight",
                "category": "smartwatches",
                "sentiment": "negative",
                "comment_count": 27,
                "sample_quotes": [
                    "Disappointed with battery life on GPS workouts. Died at mile 18 of marathon.",
                    "Solar charging helps slightly, but needs faster direct charging."
                ],
                "suggested_action": "Adopt dual-layer display (monochrome memory-in-pixel for GPS standby) to reach 30-day battery life."
            },
            {
                "id": "clust-pricing-01",
                "topic": "High Accessory Markups & Replacement Cost",
                "category": "accessories",
                "sentiment": "neutral",
                "comment_count": 22,
                "sample_quotes": [
                    "Replacement ear pads cost $60 alone! Huge markup for foam.",
                    "Wait for Black Friday discount; solid at $199, but overpriced at $350 MSRP."
                ],
                "suggested_action": "Bundle modular spare accessories in box or offer affordable maintenance subscriptions."
            }
        ]
        if category and category != "all":
            return [c for c in clusters if c["category"] == category]
        return clusters

class MockPricesProvider(BasePricesProvider):
    def __init__(self):
        self._products = _load_json("products.json")
        self._prices = _load_json("prices.json")

    async def get_products(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self._products
        if category and category != "all":
            results = [p for p in results if p.get("category") == category]
        if search:
            q = search.lower()
            results = [p for p in results if q in p.get("name", "").lower() or q in p.get("brand", "").lower()]
        return results

    async def get_product_prices(self, product_id: str) -> Optional[Dict[str, Any]]:
        return self._prices.get(product_id)

class MockCampaignsProvider(BaseCampaignsProvider):
    def __init__(self):
        self._campaigns = _load_json("campaigns.json")

    async def get_campaigns(self) -> List[Dict[str, Any]]:
        return self._campaigns

    async def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        for c in self._campaigns:
            if c["id"] == campaign_id:
                return c
        return None
