from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import Product, ProductPriceComparison
from providers import get_prices_provider

router = APIRouter(prefix="/api/products", tags=["Products & Prices"])

@router.get("", response_model=List[Product])
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search product name or brand")
):
    provider = get_prices_provider()
    products = await provider.get_products(category=category, search=search)
    return [Product(**p) for p in products]

@router.get("/{product_id}/prices", response_model=ProductPriceComparison)
async def get_product_prices(product_id: str):
    provider = get_prices_provider()
    price_info = await provider.get_product_prices(product_id)
    if not price_info:
        raise HTTPException(status_code=404, detail=f"Price data for product '{product_id}' not found")
    return ProductPriceComparison(**price_info)
