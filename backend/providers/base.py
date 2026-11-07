from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class BaseTrendsProvider(ABC):
    @abstractmethod
    async def get_trends(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve trend summaries across products/keywords."""
        pass

    @abstractmethod
    async def get_trend_forecast(self, trend_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve historical 52-week data and 8-week forward forecast for a trend."""
        pass

class BaseCommentsProvider(ABC):
    @abstractmethod
    async def get_comments(
        self,
        product_id: Optional[str] = None,
        source: Optional[str] = None,
        sentiment: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Retrieve social comments with filtering."""
        pass

    @abstractmethod
    async def get_clusters(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Group comments into recurring pain-point and wish clusters."""
        pass

class BasePricesProvider(ABC):
    @abstractmethod
    async def get_products(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve product catalog."""
        pass

    @abstractmethod
    async def get_product_prices(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve cross-store prices, 30-day history, and value-for-money score."""
        pass

class BaseCampaignsProvider(ABC):
    @abstractmethod
    async def get_campaigns(self) -> List[Dict[str, Any]]:
        """Retrieve all active/optimizing ad campaigns with metrics."""
        pass

    @abstractmethod
    async def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve single campaign with historical metrics and AI suggestions."""
        pass
