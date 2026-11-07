"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  Search, 
  Check, 
  ExternalLink, 
  TrendingDown, 
  ShieldCheck, 
  Award,
  AlertCircle,
  Truck,
  Sparkles,
  BarChart3
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { Product, ProductPriceComparison } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function PriceWisePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-head-01");
  const [priceData, setPriceData] = useState<ProductPriceComparison | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingPrices, setLoadingPrices] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load products list
  const loadProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const data = await api.getProducts(category, search);
      setProducts(data);
      if (data.length > 0 && !selectedProductId) {
        setSelectedProductId(data[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load product list");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  // Load price comparison when selectedProductId changes
  useEffect(() => {
    if (!selectedProductId) return;
    const loadPriceComparison = async () => {
      setLoadingPrices(true);
      try {
        const comp = await api.getProductPrices(selectedProductId);
        setPriceData(comp);
      } catch (err) {
        console.error("Failed to load price details", err);
      } finally {
        setLoadingPrices(false);
      }
    };
    loadPriceComparison();
  }, [selectedProductId]);

  // Format 30-day price history for Recharts
  const chartPoints = priceData
    ? priceData.price_history_30d.map((p) => ({
        date: p.date.slice(5),
        NovaMart: p.store_prices["NovaMart"] || null,
        ElectroNest: p.store_prices["ElectroNest"] || null,
        ApexDigital: p.store_prices["ApexDigital"] || null,
        SoundVault: p.store_prices["SoundVault"] || null,
        GadgetWave: p.store_prices["GadgetWave"] || null,
        Lowest: p.lowest_price,
      }))
    : [];

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          PriceWise Market Intelligence
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare multi-store pricing across fictional retailers, monitor 30-day volatility, and score value-for-money.
        </p>
      </div>

      {/* Product Selector Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1">
              {["all", "headphones", "smartwatches", "phones", "accessories"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    category === cat
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {selectedProduct && (
            <div className="flex items-center gap-4 text-xs shrink-0 self-end md:self-center">
              <span>Category: <strong className="capitalize">{selectedProduct.category}</strong></span>
              <span>•</span>
              <span>MSRP: <strong>{formatCurrency(selectedProduct.msrp)}</strong></span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Section: Value Score Card & Best Buy Recommendation */}
      {priceData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Value For Money Score Card (5 cols) */}
          <Card className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  Value-for-Money Score
                </CardTitle>
                <Badge
                  variant={
                    priceData.value_analysis.score >= 80
                      ? "success"
                      : priceData.value_analysis.score >= 60
                      ? "brand"
                      : "warning"
                  }
                  className="text-xs"
                >
                  {priceData.value_analysis.verdict}
                </Badge>
              </div>
              <CardDescription>Multi-variable price vs. specification algorithmic index</CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-5">
              {/* Score Gauge */}
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl bg-brand-600 text-white flex flex-col items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                  <span className="text-3xl font-extrabold leading-none">
                    {priceData.value_analysis.score}
                  </span>
                  <span className="text-[10px] text-brand-200 mt-1 uppercase tracking-wider font-semibold">
                    out of 100
                  </span>
                </div>

                <div className="space-y-1.5 flex-1 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Price Discount Competitiveness</span>
                      <span className="font-semibold">{priceData.value_analysis.price_competitiveness}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${priceData.value_analysis.price_competitiveness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Feature Density to Cost</span>
                      <span className="font-semibold">{priceData.value_analysis.feature_density}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${priceData.value_analysis.feature_density}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Customer Sentiment Bonus</span>
                      <span className="font-semibold">{priceData.value_analysis.sentiment_bonus}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${priceData.value_analysis.sentiment_bonus}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Buy Recommendation Card */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Best Buy Recommendation: {priceData.best_store_name}
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                  {priceData.value_analysis.recommendation}
                </p>
                <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold pt-1">
                  <span>Current Best Price: {formatCurrency(priceData.lowest_price)}</span>
                  <span>Save {formatCurrency(priceData.highest_price - priceData.lowest_price)} vs Highest</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cross-Store Price Comparison Table (7 cols) */}
          <Card className="lg:col-span-7">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Retail Store Price Comparison</CardTitle>
                <CardDescription>Live price feeds across fictional online storefronts</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {priceData.stores.length} Retailers Tracked
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Store Name</th>
                      <th className="px-3 py-3">Current Price</th>
                      <th className="px-3 py-3">MSRP Delta</th>
                      <th className="px-3 py-3">Shipping</th>
                      <th className="px-3 py-3">Stock Status</th>
                      <th className="px-4 py-3 text-right">Affiliate Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {priceData.stores.map((store) => (
                      <tr
                        key={store.store_id}
                        className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                          store.is_best_deal ? "bg-emerald-50/30 dark:bg-emerald-950/20 font-medium" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {store.store_name}
                          </span>
                          {store.is_best_deal && (
                            <Badge variant="success" className="text-[9px] px-1.5 py-0">
                              BEST DEAL
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-3.5 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(store.price)}
                        </td>
                        <td className="px-3 py-3.5 text-emerald-600 font-semibold">
                          -{store.discount_pct}%
                        </td>
                        <td className="px-3 py-3.5 text-slate-500">
                          {store.shipping_cost === 0 ? "Free Shipping" : formatCurrency(store.shipping_cost)}
                        </td>
                        <td className="px-3 py-3.5">
                          {store.in_stock ? (
                            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 text-[11px]">
                              <Check className="w-3 h-3 mr-1" /> In Stock
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Out of Stock</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={store.affiliate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline text-[11px]"
                          >
                            Visit Store <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 30-Day Historical Price Movement Chart */}
      {priceData && (
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle>30-Day Retail Price Volatility</CardTitle>
              <CardDescription>Daily price tracking per store illustrating promotional dips and price wars</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Lowest 30d: <strong className="text-slate-900 dark:text-white">{formatCurrency(priceData.lowest_price)}</strong></span>
              <span>•</span>
              <span>Average 30d: <strong className="text-slate-900 dark:text-white">{formatCurrency(priceData.average_price)}</strong></span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={["dataMin - 15", "dataMax + 15"]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-800 space-y-1">
                            <div className="font-semibold text-slate-300">Date: {payload[0].payload.date}</div>
                            {payload.map((entry, idx) => (
                              <div key={idx} style={{ color: entry.color }} className="flex justify-between gap-4">
                                <span>{entry.name}:</span>
                                <strong>{formatCurrency(entry.value as number)}</strong>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Line type="monotone" dataKey="NovaMart" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ElectroNest" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="ApexDigital" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="SoundVault" stroke="#ec4899" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="GadgetWave" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
