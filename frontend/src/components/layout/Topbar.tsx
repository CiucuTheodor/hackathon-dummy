"use client";

import { Menu, Database, Sparkles, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

  return (
    <header className="h-16 px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Consumer Electronics Intelligence
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Niche: Audio, Smartwatches, Mobile
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Demo Data Badge */}
        {isMock && (
          <div
            title="USE_MOCK_DATA=true: Running on realistic mock datasets. Live API providers can be configured via .env"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-medium cursor-help transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Demo Data</span>
            <span className="hidden sm:inline text-[10px] text-amber-600/70 dark:text-amber-400/60">(Mock Providers)</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>LLM: Mock Reasoning</span>
        </div>

        {/* Light/Dark Mode toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
