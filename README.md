# MarketPulse AI 🚀

> **Hackathon MVP**: Market Intelligence Platform for Consumer Electronics Brands & Sellers.

MarketPulse AI unifies four market intelligence engines into a single dashboard:
1. **MarketPulse (Core)**: Executive overview analyzing market search trends, consumer behavior, campaign ROI, and actionable strategic AI recommendations.
2. **TrendHunter**: Product trend predictor showing 52-week historical interest plus an 8-week forward forecast with 90% confidence bands, rising/stable/declining velocity ranks, and "Next Big Trend" predictive spotlights.
3. **Comment2Product**: Natural Language social listening turning customer complaints and wishes from YouTube, Reddit, and TikTok into structured hardware product specs and idea cards, with a live custom feedback playground.
4. **PriceWise**: Cross-store price comparison across 5 online storefronts (*NovaMart, ElectroNest, ApexDigital, SoundVault, GadgetWave*), 30-day volatility history, and an algorithmic Value-for-Money score (0-100) with "Best Buy" recommendations.
5. **Campaigns**: Omnichannel marketing telemetry (Google Ads, Meta Ads, TikTok Ads, YouTube Ads) with spend, conversions, ROI, and tactical AI optimization suggestions.

---

## Architecture & Extensibility

```
dummyHackathon/
├── README.md
├── backend/               # FastAPI + Pydantic + Pluggable Providers & LLM
│   ├── config.py          # Pydantic Settings (USE_MOCK_DATA, LLM_PROVIDER)
│   ├── data/              # 20 Products, 52-wk Trends, ~200 Comments, 30-day Prices, 5 Campaigns
│   ├── models/            # Clean Pydantic schemas (PostgreSQL / Supabase ready)
│   ├── providers/         # Base interfaces + Mock JSON provider + Real API Stubs
│   │   ├── base.py
│   │   ├── mock_provider.py
│   │   └── real_stubs.py  # GoogleTrends, YouTube, Reddit, Affiliate, AdPlatforms
│   ├── services/          # Base LLM + MockLLM (with delay) + OpenRouterLLM stub
│   ├── routers/           # REST endpoints (/api/dashboard, /trends, /comments, etc.)
│   └── scripts/           # generate_mock_data.py seed script
└── frontend/              # Next.js 14 App Router + TypeScript + Tailwind CSS + Recharts
    └── src/
        ├── app/           # Dashboard, /trends, /comments, /prices, /campaigns
        ├── components/    # Sidebar, Topbar ("Demo Data" badge), ThemeToggle, UI Cards
        └── lib/           # Typed API client & data models
```

### Pluggable Data Providers
The backend utilizes an abstract provider interface (`BaseTrendsProvider`, `BaseCommentsProvider`, `BasePricesProvider`, `BaseCampaignsProvider`).
- While `USE_MOCK_DATA=true`, the app serves pre-generated realistic consumer electronics datasets.
- Stub classes (`GoogleTrendsProvider`, `YouTubeCommentsProvider`, `RedditCommentsProvider`, `AffiliatePriceFeedsProvider`, `AdPlatformsCampaignsProvider`) are already mapped and raise `NotImplementedError` with explicit `TODO: replace with real provider` markers.

### Pluggable LLM Service
- `LLM_PROVIDER=mock`: Returns realistic responses with an artificial delay (~500ms) and dynamic keyword extraction for live custom comments.
- `LLM_PROVIDER=openrouter`: Configured for OpenAI-compatible SDK calls to `https://openrouter.ai/api/v1` using `OPENROUTER_API_KEY` and `LLM_MODEL`.

---

## Quick Start Guide

### 1. Backend Setup (Port 8000)

```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Regenerate mock datasets
python scripts/generate_mock_data.py

# Run FastAPI server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 2. Frontend Setup (Port 3000)

```bash
cd frontend

# Install npm dependencies
npm install

# Start Next.js development server
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Backend (`backend/.env`)
```env
USE_MOCK_DATA=true
LLM_PROVIDER=mock
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Future API Integrations
OPENROUTER_API_KEY=
LLM_MODEL=meta-llama/llama-3.3-70b-instruct
YOUTUBE_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_DATA=true
```

---

## REST Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Executive KPIs, sentiment, best deal, top ROI, and strategic AI recs |
| `GET` | `/api/trends` | Searchable product trends with current score, change %, and velocity |
| `GET` | `/api/trends/{id}/forecast` | 52-week historical interest + 8-week forward forecast & confidence band |
| `GET` | `/api/comments` | Filterable social comments (source, sentiment, product, text query) |
| `GET` | `/api/comments/clusters` | Clustered pain points and wishes with frequency counts |
| `POST`| `/api/comments/product-ideas`| LLM-powered product idea generation from community comments |
| `GET` | `/api/products` | Catalog of 20 electronics products across 4 categories |
| `GET` | `/api/products/{id}/prices`| 5-store comparison, 30-day price history, and Value-for-Money score |
| `GET` | `/api/campaigns` | Omnichannel ad metrics table (impressions, clicks, CTR, conversions, ROI) |
| `GET` | `/api/campaigns/{id}` | Detailed campaign historical timeline & AI optimization tips |
| `GET` | `/api/insights/recommendations` | Standalone strategic recommendations stream |
