"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
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
import { TrendSummary, TrendDetail } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendSummary[]>([]);
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<TrendDetail | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trends list
  const loadTrends = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await api.getTrends(category, search);
      setTrends(data);
      if (data.length > 0 && !selectedTrendId) {
        // Find next big trend or first item as default selected
        const nextBig = data.find((t) => t.is_next_big_trend) || data[0];
        setSelectedTrendId(nextBig.id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load trends");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, [category]);

  // Load detailed history & forecast when selectedTrendId changes
  useEffect(() => {
    if (!selectedTrendId) return;
    const loadDetail = async () => {
      setLoadingDetail(true);
      try {
        const detail = await api.getTrendForecast(selectedTrendId);
        setSelectedDetail(detail);
      } catch (err) {
        console.error("Failed to load forecast detail", err);
      } finally {
        setLoadingDetail(false);
      }
    };
    loadDetail();
  }, [selectedTrendId]);

  // Merge history and forecast into a unified chart series
  // Sample every other week of history so chart is readable (26 historical points + 8 forecast points)
  const chartData = selectedDetail
    ? [
        ...selectedDetail.history
          .filter((_, idx) => idx % 2 === 0)
          .map((h) => ({
            week: h.week_start.slice(5),
            historical: h.score,
            forecast: null as number | null,
            lowerBound: null as number | null,
            upperBound: null as number | null,
          })),
        // Connect the last historical point to forecast
        {
          week: selectedDetail.history[selectedDetail.history.length - 1].week_start.slice(5),
          historical: selectedDetail.history[selectedDetail.history.length - 1].score,
          forecast: selectedDetail.history[selectedDetail.history.length - 1].score,
          lowerBound: selectedDetail.history[selectedDetail.history.length - 1].score,
          upperBound: selectedDetail.history[selectedDetail.history.length - 1].score,
        },
        ...selectedDetail.forecast.map((f) => ({
          week: f.week_start.slice(5) + " (F)",
          historical: null as number | null,
          forecast: f.predicted_score,
          lowerBound: f.confidence_lower,
          upperBound: f.confidence_upper,
        })),
      ]
    : [];

  const nextBigTrend = trends.find((t) => t.is_next_big_trend) || trends[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          TrendHunter Forecasting
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detect emerging consumer electronics interest early with 8-week predictive forward cones.
        </p>
      </div>

      {/* "Next Big Trend" Highlight Card */}
      {nextBigTrend && (
        <Card className="border-2 border-brand-500/30 bg-gradient-to-r from-brand-50/70 via-indigo-50/40 to-white dark:from-brand-950/40 dark:via-slate-900 dark:to-slate-900 shadow-md">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <Badge variant="brand" className="text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Next Big Trend Spotlight
                </Badge>
                <Badge variant="success" className="text-xs font-semibold">
                  Velocity #{nextBigTrend.velocity_rank}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {nextBigTrend.keyword}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Demonstrating explosive breakout acceleration (+{nextBigTrend.change_pct}% over the last 4 weeks).
                Demand is shifting toward open-ear situational acoustics with high-fidelity bone conduction.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <span>Current Index: <strong className="text-slate-900 dark:text-white">{nextBigTrend.current_score}</strong>/100</span>
                <span>•</span>
                <span>Category: <strong className="capitalize text-slate-900 dark:text-white">{nextBigTrend.category}</strong></span>
                <span>•</span>
                <span>Forecast Confidence: <strong className="text-emerald-600 dark:text-emerald-400">92% High</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTrendId(nextBigTrend.id)}
              className="shrink-0 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow transition-all flex items-center justify-center gap-2"
            >
              Analyze Forecast Cone <ChevronRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Forecast Visualizer + Searchable List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forecast Chart Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>{selectedDetail ? selectedDetail.keyword : "Select a Trend"}</span>
                  {selectedDetail && (
                    <Badge
                      variant={
                        selectedDetail.status === "Rising"
                          ? "success"
                          : selectedDetail.status === "Declining"
                          ? "danger"
                          : "default"
                      }
                    >
                      {selectedDetail.status}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  52-Week Historical Search Baseline + 8-Week Forward Confidence Envelope
                </CardDescription>
              </div>

              {selectedDetail && (
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedDetail.current_score}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatPercent(selectedDetail.change_pct)} 4-wk
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-4">
              {loadingDetail ? (
                <Skeleton className="h-80 w-full rounded-lg" />
              ) : selectedDetail ? (
                <div className="space-y-4">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const p = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-800 space-y-1">
                                  <div className="font-semibold text-slate-300">Week: {p.week}</div>
                                  {p.historical !== null && (
                                    <div className="text-indigo-400 font-medium">
                                      Historical Interest: <strong>{p.historical}</strong>
                                    </div>
                                  )}
                                  {p.forecast !== null && (
                                    <div className="text-emerald-400 font-medium">
                                      Predicted Forecast: <strong>{p.forecast}</strong>
                                    </div>
                                  )}
                                  {p.lowerBound !== null && (
                                    <div className="text-slate-400 text-[10px]">
                                      90% Band: [{p.lowerBound} - {p.upperBound}]
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {/* Upper Bound Envelope */}
                        <Area
                          type="monotone"
                          dataKey="upperBound"
                          stroke="transparent"
                          fill="url(#confidenceBand)"
                          name="Confidence Upper"
                        />
                        {/* Historical Line */}
                        <Line
                          type="monotone"
                          dataKey="historical"
                          stroke="#6366f1"
                          strokeWidth={2.5}
                          dot={false}
                          name="Historical Interest"
                        />
                        {/* Forecast Dashed Line */}
                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeDasharray="5 5"
                          dot={{ r: 3, fill: "#10b981" }}
                          name="8-Week Forecast"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart Legend & Explanation */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-brand-600 rounded" />
                        <span className="text-slate-600 dark:text-slate-400">Historical (52 wks)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-400">Forecast (Next 8 wks)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-brand-300/40 rounded-sm" />
                        <span className="text-slate-600 dark:text-slate-400">90% Confidence Interval</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Searchable Trends Table & Filtering (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Monitored Trends Catalog</CardTitle>
              <CardDescription>Filter by category or query custom keywords</CardDescription>

              {/* Search & Category Filter Controls */}
              <div className="space-y-2 pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadTrends()}
                    placeholder="Search keywords or products..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["all", "headphones", "smartwatches", "phones", "accessories"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        category === cat
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loadingList ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : trends.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No trends matching your query.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
                  {trends.map((t) => {
                    const isSelected = selectedTrendId === t.id;
                    const StatusIcon =
                      t.status === "Rising"
                        ? ArrowUpRight
                        : t.status === "Declining"
                        ? ArrowDownRight
                        : Minus;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTrendId(t.id)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-brand-50/80 dark:bg-brand-950/40 border-l-4 border-l-brand-600"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {t.keyword}
                            </span>
                            {t.is_next_big_trend && (
                              <Badge variant="brand" className="text-[9px] px-1.5 py-0">
                                HOT
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 capitalize">{t.category}</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                            {t.current_score}
                          </span>
                          <Badge
                            variant={
                              t.status === "Rising"
                                ? "success"
                                : t.status === "Declining"
                                ? "danger"
                                : "default"
                            }
                            className="text-[10px] flex items-center gap-0.5"
                          >
                            <StatusIcon className="w-3 h-3" />
                            {formatPercent(t.change_pct)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
