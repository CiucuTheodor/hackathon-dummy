from config import settings
from .base import BaseTrendsProvider, BaseCommentsProvider, BasePricesProvider, BaseCampaignsProvider
from .mock_provider import MockTrendsProvider, MockCommentsProvider, MockPricesProvider, MockCampaignsProvider
from .real_stubs import (
    GoogleTrendsProvider,
    YouTubeCommentsProvider,
    RedditCommentsProvider,
    AffiliatePriceFeedsProvider,
    AdPlatformsCampaignsProvider,
)

_mock_trends = MockTrendsProvider()
_mock_comments = MockCommentsProvider()
_mock_prices = MockPricesProvider()
_mock_campaigns = MockCampaignsProvider()

def get_trends_provider() -> BaseTrendsProvider:
    if settings.USE_MOCK_DATA:
        return _mock_trends
    # TODO: replace with real provider
    return GoogleTrendsProvider()

def get_comments_provider() -> BaseCommentsProvider:
    if settings.USE_MOCK_DATA:
        return _mock_comments
    # TODO: replace with real provider
    return YouTubeCommentsProvider()

def get_prices_provider() -> BasePricesProvider:
    if settings.USE_MOCK_DATA:
        return _mock_prices
    # TODO: replace with real provider
    return AffiliatePriceFeedsProvider()

def get_campaigns_provider() -> BaseCampaignsProvider:
    if settings.USE_MOCK_DATA:
        return _mock_campaigns
    # TODO: replace with real provider
    return AdPlatformsCampaignsProvider()

__all__ = [
    "get_trends_provider",
    "get_comments_provider",
    "get_prices_provider",
    "get_campaigns_provider",
    "BaseTrendsProvider",
    "BaseCommentsProvider",
    "BasePricesProvider",
    "BaseCampaignsProvider",
]
