"use client";

import { useEffect, useState } from "react";
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  RefreshCw,
  BarChart2,
  PieChart
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { Campaign, CampaignSummary } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export default function CampaignsPage() {
  const [summary, setSummary] = useState<CampaignSummary | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCampaignsSummary();
      setSummary(data);
      if (data.campaigns.length > 0 && !selectedCampaignId) {
        setSelectedCampaignId(data.campaigns[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load marketing campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-semibold text-rose-800 dark:text-rose-200">Failed to load campaigns</h3>
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

  // Bar chart data comparing campaigns Spend vs Revenue
  const barChartData = summary.campaigns.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 18) + "..." : c.name,
    Spend: c.spend,
    Revenue: c.revenue,
    ROI: c.roi,
  }));

  const selectedCampaign = summary.campaigns.find((c) => c.id === selectedCampaignId) || summary.campaigns[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Marketing Campaign Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Omnichannel ad performance across Google, Meta, TikTok, and YouTube with AI optimization suggestions.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Ad Data
        </button>
      </div>

      {/* Aggregate KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">Total Ad Spend</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(summary.total_spend)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Across 5 live campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">Generated Revenue</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(summary.total_revenue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Net profit: {formatCurrency(summary.total_revenue - summary.total_spend)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">Blended CTR</span>
            <div className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
              {summary.blended_ctr}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Benchmark: 3.2% industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs text-slate-500 font-medium">Blended ROI</span>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {formatPercent(summary.blended_roi)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total conversions: {formatNumber(summary.total_conversions)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active & Optimizing Campaigns</CardTitle>
            <CardDescription>Click any row to inspect historical timeline and AI suggestions</CardDescription>
          </div>
          <Badge variant="outline">{summary.campaigns.length} Tracked Campaigns</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Campaign & Product</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Spend</th>
                  <th className="px-3 py-3">Impressions</th>
                  <th className="px-3 py-3">Clicks</th>
                  <th className="px-3 py-3">CTR</th>
                  <th className="px-3 py-3">Conversions</th>
                  <th className="px-3 py-3">CPA</th>
                  <th className="px-4 py-3 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {summary.campaigns.map((camp) => {
                  const isSelected = selectedCampaign.id === camp.id;
                  return (
                    <tr
                      key={camp.id}
                      onClick={() => setSelectedCampaignId(camp.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-50/70 dark:bg-brand-950/40 border-l-4 border-l-brand-600"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {camp.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {camp.product_focus}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge variant="outline" className="text-[10px]">
                          {camp.platform}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5">
                        <Badge
                          variant={camp.status === "Active" ? "success" : "warning"}
                          className="text-[10px]"
                        >
                          {camp.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3.5 font-medium">{formatCurrency(camp.spend)}</td>
                      <td className="px-3 py-3.5 text-slate-500">{formatNumber(camp.impressions)}</td>
                      <td className="px-3 py-3.5 text-slate-500">{formatNumber(camp.clicks)}</td>
                      <td className="px-3 py-3.5 font-semibold text-brand-600 dark:text-brand-400">
                        {camp.ctr}%
                      </td>
                      <td className="px-3 py-3.5 font-medium">{camp.conversions}</td>
                      <td className="px-3 py-3.5 text-slate-500">{formatCurrency(camp.cpa)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPercent(camp.roi)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Comparative Performance Chart & AI Optimization Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spend vs Revenue Bar Chart (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle>Cross-Campaign Spend vs. Revenue</CardTitle>
            <CardDescription>Dollar efficiency and return comparison across platforms</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-800 space-y-1">
                            <div className="font-semibold text-slate-300">{payload[0].payload.name}</div>
                            <div className="text-slate-400">Spend: {formatCurrency(payload[0].value as number)}</div>
                            <div className="text-emerald-400 font-bold">Revenue: {formatCurrency(payload[1].value as number)}</div>
                            <div className="text-brand-300 text-[11px]">ROI: +{payload[0].payload.ROI}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar dataKey="Spend" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions for Selected Campaign (5 cols) */}
        <Card className="lg:col-span-5 border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Optimization Suggestions
              </CardTitle>
              <Badge variant="brand" className="text-[10px]">
                {selectedCampaign.platform}
              </Badge>
            </div>
            <CardDescription>
              Diagnostics for: <strong className="text-slate-800 dark:text-slate-200">{selectedCampaign.name}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Quick Diagnostic Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Current CPA</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(selectedCampaign.cpa)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">ROAS Multiplier</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCampaign.roas}x</span>
              </div>
            </div>

            {/* AI Action Items */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Recommended Interventions:
              </span>
              {selectedCampaign.ai_suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Updated from ad webhook telemetry</span>
              <span className="text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline">
                Auto-apply to Ad Manager →
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
