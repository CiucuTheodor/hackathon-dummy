"use client";

import { useEffect, useState } from "react";
import { 
  MessageSquareShare, 
  Sparkles, 
  Filter, 
  ThumbsUp, 
  Share2, 
  AlertCircle,
  Lightbulb,
  Send,
  RefreshCw,
  Search,
  CheckCircle,
  Cpu,
  HelpCircle
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { 
  SocialComment, 
  PainPointCluster, 
  ProductIdea, 
  CommentSentimentStats,
  Product 
} from "@/lib/types";

export default function Comment2ProductPage() {
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [clusters, setClusters] = useState<PainPointCluster[]>([]);
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [stats, setStats] = useState<CommentSentimentStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Filter state
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Live custom comments input state
  const [customCommentText, setCustomCommentText] = useState<string>("");
  const [analyzingLive, setAnalyzingLive] = useState<boolean>(false);
  const [generatingIdeas, setGeneratingIdeas] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [comms, clusts, st, prods] = await Promise.all([
        api.getComments({
          product_id: selectedProduct,
          source: selectedSource,
          sentiment: selectedSentiment,
          search: search,
          limit: 100,
        }),
        api.getCommentClusters(),
        api.getCommentStats(),
        api.getProducts(),
      ]);

      setComments(comms);
      setClusters(clusts);
      setStats(st);
      setProducts(prods);

      // Preload initial ideas if none yet
      if (ideas.length === 0) {
        const initialIdeas = await api.generateProductIdeas();
        setIdeas(initialIdeas);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load comment insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProduct, selectedSource, selectedSentiment]);

  // Handler for standard "Generate product ideas" button
  const handleGenerateIdeas = async () => {
    setGeneratingIdeas(true);
    try {
      const newIdeas = await api.generateProductIdeas(
        undefined,
        selectedProduct !== "all" ? selectedProduct : undefined
      );
      setIdeas(newIdeas);
    } catch (err: any) {
      alert("Error generating ideas: " + err.message);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  // Handler for custom pasted comments live analysis
  const handleAnalyzeCustomComments = async () => {
    if (!customCommentText.trim()) return;
    setAnalyzingLive(true);
    try {
      const splitComments = customCommentText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const generatedCustomIdeas = await api.generateProductIdeas(splitComments);
      setIdeas(generatedCustomIdeas);
    } catch (err: any) {
      alert("Error analyzing custom comments: " + err.message);
    } finally {
      setAnalyzingLive(false);
    }
  };

  // Chart data for sentiment donut
  const sentimentPieData = stats
    ? [
        { name: "Positive", value: stats.positive_pct, color: "#10b981" },
        { name: "Neutral", value: stats.neutral_pct, color: "#94a3b8" },
        { name: "Negative", value: stats.negative_pct, color: "#f43f5e" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comment2Product Engine
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mines unstructured customer feedback from YouTube, Reddit, and TikTok to synthesize hardware product roadmaps.
          </p>
        </div>

        <button
          onClick={handleGenerateIdeas}
          disabled={generatingIdeas}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
        >
          <Sparkles className={`w-4 h-4 ${generatingIdeas ? "animate-spin" : ""}`} />
          {generatingIdeas ? "Synthesizing Ideas..." : "Generate Product Ideas"}
        </button>
      </div>

      {/* Top Analytics Row: Sentiment Breakdown & Pain Point Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentiment & Sources Donut (4 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Sentiment Overview</CardTitle>
            <CardDescription>NLP classification across 200+ electronics discussions</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2 rounded shadow">
                            <span className="font-semibold">{payload[0].name}:</span> {payload[0].value}%
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <span className="text-[10px] text-emerald-600 block">Positive</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {stats ? stats.positive_pct : 0}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-500 block">Neutral</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {stats ? stats.neutral_pct : 0}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                <span className="text-[10px] text-rose-600 block">Complaints</span>
                <span className="font-bold text-rose-700 dark:text-rose-300">
                  {stats ? stats.negative_pct : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clustered Pain Points & Wishes (8 cols) */}
        <Card className="lg:col-span-8">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Clustered Pain Points & Wishes</CardTitle>
              <CardDescription>Unsupervised topic grouping of recurring user complaints</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {clusters.length} Core Clusters
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1">
              {clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {cluster.topic}
                    </span>
                    <Badge
                      variant={cluster.sentiment === "positive" ? "success" : "danger"}
                      className="text-[10px] shrink-0"
                    >
                      {cluster.comment_count} mentions
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2">
                    "{cluster.sample_quotes[0]}"
                  </p>

                  <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                      Opportunity: {cluster.suggested_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LLM Generated Product Ideas Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-sm">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Synthesized Product Ideas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable product blueprints addressing confirmed customer friction points.
              </p>
            </div>
          </div>
          <Badge variant="brand" className="text-xs">
            LLM Idea Cards
          </Badge>
        </div>

        {generatingIdeas ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <Card key={idea.id} className="border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {idea.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target: <span className="font-medium text-slate-700 dark:text-slate-300">{idea.target_audience}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="success" className="text-[10px]">
                        {idea.demand_level} Demand
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        Feasibility {idea.feasibility_score}/100
                      </Badge>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Problem Solved:</span>
                    {idea.problem_solved}
                  </div>

                  {/* Key Features */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Suggested Specs:</span>
                    <ul className="space-y-1">
                      {idea.key_features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span>Supported by {idea.supporting_comment_count} customer reviews</span>
                    <span className="text-brand-600 dark:text-brand-400 font-medium">Ready for Spec Specifier →</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Live Custom Comment Sandbox / Playground */}
      <Card className="border border-brand-200 dark:border-brand-900/60 bg-gradient-to-b from-brand-50/30 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-500" />
            Live Custom Feedback Playground
          </CardTitle>
          <CardDescription>
            Paste your brand's unorganized customer reviews or social comments below. The LLM will parse pain points and synthesize customized product ideas on the fly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            rows={3}
            value={customCommentText}
            onChange={(e) => setCustomCommentText(e.target.value)}
            placeholder="Paste raw reviews here (e.g. 'The headphones sound amazing but my glasses hurt against the headband clamping, and the battery dies after 4 hours on Zoom calls...')"
            className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-[11px]">Try keywords: <em>battery, clamp force, mic quality, glasses comfort</em></span>
            </div>

            <button
              onClick={handleAnalyzeCustomComments}
              disabled={analyzingLive || !customCommentText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition-all"
            >
              <Send className={`w-3.5 h-3.5 ${analyzingLive ? "animate-spin" : ""}`} />
              {analyzingLive ? "Analyzing Feedback..." : "Analyze Comments Live"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Social Comments Filterable Feed */}
      <Card>
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Raw Social Comment Stream</CardTitle>
              <CardDescription>218 verified discussions with sentiment and platform tags</CardDescription>
            </div>
            <Badge variant="outline">{comments.length} Comments Displayed</Badge>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadData()}
                placeholder="Search text..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            {/* Product Filter */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="all">All Products (20)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="all">All Platforms (YouTube, Reddit, TikTok)</option>
              <option value="youtube">YouTube</option>
              <option value="reddit">Reddit</option>
              <option value="tiktok">TikTok</option>
            </select>

            {/* Sentiment Filter */}
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative / Complaints Only</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No comments match your filter criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 space-y-1.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {comment.author}
                      </span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {comment.source}
                      </Badge>
                      <span className="text-[10px] text-slate-500">
                        on {comment.product_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          comment.sentiment === "positive"
                            ? "success"
                            : comment.sentiment === "negative"
                            ? "danger"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {comment.sentiment}
                      </Badge>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> {comment.likes}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comment.text}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    {comment.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-500 ml-auto">{comment.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
