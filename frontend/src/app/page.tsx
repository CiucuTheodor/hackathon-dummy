"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Smile, 
  Tag, 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Zap,
  CheckCircle2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { DashboardSummary } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await api.getDashboardSummary();
      setData(summary);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Prepare aggregate trend points for the main chart
  const sampleTrendPoints = [
    { month: "Jan", interest: 52 },
    { month: "Feb", interest: 55 },
    { month: "Mar", interest: 53 },
    { month: "Apr", interest: 61 },
    { month: "May", interest: 64 },
    { month: "Jun", interest: 72 },
    { month: "Jul", interest: 70 },
    { month: "Aug", interest: 78 },
    { month: "Sep", interest: 84 },
    { month: "Oct", interest: 89 },
    { month: "Nov", interest: 93 },
    { month: "Dec", interest: 96 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-semibold text-rose-800 dark:text-rose-200">Unable to load dashboard</h3>
        <p className="text-sm text-rose-600 dark:text-rose-400 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            MarketPulse Command Center
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-channel market telemetry across electronics categories.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Trending Products */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rising Trends</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {data.rising_trends_count}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> of {data.trending_products_count}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Accelerating search volume</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Average Market Sentiment */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Sentiment</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {data.average_market_sentiment_pct}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Positive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Across 200+ social comments</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smile className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Best Value Deal */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Best Deal Spread</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  -{data.best_deal_summary.discount_pct}%
                </span>
                <Badge variant="brand" className="text-[10px]">
                  Score {data.best_deal_summary.value_score}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[150px] mt-1" title={data.best_deal_summary.product_name}>
                {data.best_deal_summary.store}: {formatCurrency(data.best_deal_summary.current_price)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Top Campaign ROI */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Top Campaign ROI</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPercent(data.top_campaign_roi_pct)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[150px] mt-1" title={data.top_campaign_name}>
                {data.top_campaign_name}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart & Quick Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Market Interest Trajectory</CardTitle>
              <CardDescription>Aggregate consumer electronics search demand over the past 12 months</CardDescription>
            </div>
            <Link
              href="/trends"
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              TrendHunter Deep Dive <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleTrendPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[40, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-800">
                            <span className="font-semibold">{payload[0].payload.month}:</span>
                            <span className="ml-2 text-brand-400 font-bold">{payload[0].value} index score</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#interestGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Trends Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Velocity Keywords</CardTitle>
            <CardDescription>Fastest-growing consumer interests this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.quick_trends_preview.map((trend) => (
                <div key={trend.id} className="py-2.5 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {trend.keyword}
                    </p>
                    <span className="text-[10px] text-slate-500 uppercase">{trend.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {trend.current_score}
                    </span>
                    <Badge
                      variant={trend.status === "Rising" ? "success" : trend.status === "Declining" ? "danger" : "default"}
                      className="text-[10px]"
                    >
                      {formatPercent(trend.change_pct)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategic Recommendations Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Strategic Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable interventions synthesized across trends, prices, comments, and campaigns.
              </p>
            </div>
          </div>
          <Badge variant="brand" className="text-xs">
            LLM Strategy Engine
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendations.map((rec) => (
            <Card key={rec.id} className="border-l-4 border-l-brand-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge
                      variant={rec.impact === "Critical" ? "danger" : rec.impact === "High" ? "warning" : "default"}
                      className="text-[10px]"
                    >
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {rec.effort} Effort
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rec.summary}
                </p>

                {/* Supporting metric banner */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Telemetry:</span>
                  <span>{rec.supporting_metric}</span>
                </div>

                {/* Action steps */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Action Plan:</p>
                  {rec.action_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
