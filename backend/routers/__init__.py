from .dashboard import router as dashboard_router
from .trends import router as trends_router
from .comments import router as comments_router
from .products import router as products_router
from .campaigns import router as campaigns_router
from .insights import router as insights_router

__all__ = [
    "dashboard_router",
    "trends_router",
    "comments_router",
    "products_router",
    "campaigns_router",
    "insights_router",
]
