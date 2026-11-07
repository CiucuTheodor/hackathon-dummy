import {
  DashboardSummary,
  TrendSummary,
  TrendDetail,
  SocialComment,
  PainPointCluster,
  ProductIdea,
  CommentSentimentStats,
  Product,
  ProductPriceComparison,
  Campaign,
  CampaignSummary,
  StrategicRecommendation,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      // Avoid aggressive Next caching for live dashboard updates
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error ${res.status}: ${errText || res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Dashboard
  getDashboardSummary: (): Promise<DashboardSummary> =>
    fetchJson<DashboardSummary>("/api/dashboard/summary"),

  // Trends
  getTrends: (category?: string, search?: string): Promise<TrendSummary[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    const qs = params.toString();
    return fetchJson<TrendSummary[]>(`/api/trends${qs ? `?${qs}` : ""}`);
  },

  getTrendForecast: (id: string): Promise<TrendDetail> =>
    fetchJson<TrendDetail>(`/api/trends/${id}/forecast`),

  // Comments & NLP
  getComments: (filters?: {
    product_id?: string;
    source?: string;
    sentiment?: string;
    search?: string;
    limit?: number;
  }): Promise<SocialComment[]> => {
    const params = new URLSearchParams();
    if (filters?.product_id && filters.product_id !== "all")
      params.append("product_id", filters.product_id);
    if (filters?.source && filters.source !== "all")
      params.append("source", filters.source);
    if (filters?.sentiment && filters.sentiment !== "all")
      params.append("sentiment", filters.sentiment);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const qs = params.toString();
    return fetchJson<SocialComment[]>(`/api/comments${qs ? `?${qs}` : ""}`);
  },

  getCommentClusters: (category?: string): Promise<PainPointCluster[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    const qs = params.toString();
    return fetchJson<PainPointCluster[]>(
      `/api/comments/clusters${qs ? `?${qs}` : ""}`
    );
  },

  getCommentStats: (): Promise<CommentSentimentStats> =>
    fetchJson<CommentSentimentStats>("/api/comments/stats"),

  generateProductIdeas: (
    comments?: string[],
    productId?: string
  ): Promise<ProductIdea[]> =>
    fetchJson<ProductIdea[]>("/api/comments/product-ideas", {
      method: "POST",
      body: JSON.stringify({ comments, product_id: productId }),
    }),

  // Products & Prices
  getProducts: (category?: string, search?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    const qs = params.toString();
    return fetchJson<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  getProductPrices: (productId: string): Promise<ProductPriceComparison> =>
    fetchJson<ProductPriceComparison>(`/api/products/${productId}/prices`),

  // Campaigns
  getCampaigns: (): Promise<Campaign[]> =>
    fetchJson<Campaign[]>("/api/campaigns"),

  getCampaignsSummary: (): Promise<CampaignSummary> =>
    fetchJson<CampaignSummary>("/api/campaigns/summary"),

  getCampaign: (id: string): Promise<Campaign> =>
    fetchJson<Campaign>(`/api/campaigns/${id}`),

  // Strategic Insights
  getRecommendations: (): Promise<StrategicRecommendation[]> =>
    fetchJson<StrategicRecommendation[]>("/api/insights/recommendations"),
};
