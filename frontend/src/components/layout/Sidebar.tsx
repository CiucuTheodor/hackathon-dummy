"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  TrendingUp, 
  MessageSquareShare, 
  DollarSign, 
  Megaphone,
  Cpu,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "MarketPulse",
    description: "Executive Overview",
    href: "/",
    icon: Activity,
  },
  {
    name: "TrendHunter",
    description: "Predictive Forecasting",
    href: "/trends",
    icon: TrendingUp,
  },
  {
    name: "Comment2Product",
    description: "Social to Product Ideas",
    href: "/comments",
    icon: MessageSquareShare,
  },
  {
    name: "PriceWise",
    description: "Value & Store Comparison",
    href: "/prices",
    icon: DollarSign,
  },
  {
    name: "Campaigns",
    description: "Ad Performance & AI",
    href: "/campaigns",
    icon: Megaphone,
  },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              MarketPulse <span className="text-brand-500">AI</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Market Intelligence MVP</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isActive
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info & API Docs link */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-500" />
            FastAPI Auto Docs
          </span>
          <span className="text-[10px] font-mono text-slate-500">/docs</span>
        </a>
      </div>
    </aside>
  );
}
