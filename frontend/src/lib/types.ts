export type Category = "headphones" | "smartwatches" | "phones" | "accessories";
export type Sentiment = "positive" | "neutral" | "negative";
export type TrendStatus = "Rising" | "Stable" | "Declining";
export type SocialSource = "youtube" | "reddit" | "tiktok";

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  msrp: number;
  rating: number;
  review_count: number;
  image_url: string;
  description: string;
  features: string[];
}

export interface WeeklyTrendPoint {
  week_start: string;
  score: number;
}

export interface ForecastPoint {
  week_start: string;
  predicted_score: number;
  confidence_lower: number;
  confidence_upper: number;
  is_forecast: boolean;
}

export interface TrendSummary {
  id: string;
  product_id?: string;
  keyword: string;
  category: string;
  current_score: number;
  previous_score: number;
  change_pct: number;
  status: TrendStatus;
  velocity_rank: number;
  is_next_big_trend: boolean;
}

export interface TrendDetail extends TrendSummary {
  history: WeeklyTrendPoint[];
  forecast: ForecastPoint[];
}

export interface SocialComment {
  id: string;
  product_id: string;
  product_name: string;
  source: SocialSource;
  author: string;
  text: string;
  sentiment: Sentiment;
  likes: number;
  created_at: string;
  tags: string[];
}

export interface PainPointCluster {
  id: string;
  topic: string;
  category: string;
  sentiment: Sentiment;
  comment_count: number;
  sample_quotes: string[];
  suggested_action: string;
}

export interface ProductIdea {
  id: string;
  name: string;
  problem_solved: string;
  target_audience: string;
  supporting_comment_count: number;
  key_features: string[];
  demand_level: "High" | "Medium" | "Niche";
  feasibility_score: number;
}

export interface CommentSentimentStats {
  total_comments: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  source_distribution: Record<string, number>;
}

export interface StorePrice {
  store_id: string;
  store_name: string;
  price: number;
  original_price: number;
  discount_pct: number;
  in_stock: boolean;
  shipping_cost: number;
  is_best_deal: boolean;
  affiliate_url: string;
}

export interface DailyPricePoint {
  date: string;
  store_prices: Record<string, number>;
  lowest_price: number;
  average_price: number;
}

export interface ValueScoreBreakdown {
  score: number;
  price_competitiveness: number;
  feature_density: number;
  sentiment_bonus: number;
  verdict: string;
  recommendation: string;
}

export interface ProductPriceComparison {
  product_id: string;
  product_name: string;
  msrp: number;
  lowest_price: number;
  highest_price: number;
  average_price: number;
  best_store_name: string;
  stores: StorePrice[];
  value_analysis: ValueScoreBreakdown;
  price_history_30d: DailyPricePoint[];
}

export interface DailyCampaignPoint {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: "Google Ads" | "Meta Ads" | "TikTok Ads" | "YouTube Ads";
  status: "Active" | "Paused" | "Optimizing";
  product_focus: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roi: number;
  roas: number;
  ai_suggestions: string[];
  daily_history: DailyCampaignPoint[];
}

export interface CampaignSummary {
  total_spend: number;
  total_revenue: number;
  total_conversions: number;
  blended_ctr: number;
  blended_roi: number;
  campaigns: Campaign[];
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  category: "pricing" | "product" | "marketing" | "trend";
  impact: "High" | "Medium" | "Critical";
  effort: "Low" | "Medium" | "High";
  summary: string;
  action_steps: string[];
  supporting_metric: string;
}

export interface DashboardSummary {
  trending_products_count: number;
  rising_trends_count: number;
  average_market_sentiment_pct: number;
  best_deal_summary: {
    product_name: string;
    store: string;
    current_price: number;
    original_price: number;
    discount_pct: number;
    value_score: number;
  };
  top_campaign_roi_pct: number;
  top_campaign_name: string;
  total_tracked_products: number;
  recommendations: StrategicRecommendation[];
  quick_trends_preview: TrendSummary[];
}
