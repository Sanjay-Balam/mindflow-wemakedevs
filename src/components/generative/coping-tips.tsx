"use client";

import React from "react";
import { cn, getMoodEmoji } from "@/lib/utils";
import type { CopingTipsProps } from "@/lib/schemas";
import { Lightbulb, Activity, Brain, Users, Palette, Leaf } from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  physical: {
    icon: Activity,
    color: "text-green-500 bg-green-500/10",
    label: "Physical",
  },
  mental: {
    icon: Brain,
    color: "text-purple-500 bg-purple-500/10",
    label: "Mental",
  },
  social: {
    icon: Users,
    color: "text-blue-500 bg-blue-500/10",
    label: "Social",
  },
  creative: {
    icon: Palette,
    color: "text-pink-500 bg-pink-500/10",
    label: "Creative",
  },
  mindfulness: {
    icon: Leaf,
    color: "text-teal-500 bg-teal-500/10",
    label: "Mindfulness",
  },
};

export function CopingTips({ title, mood, tips }: CopingTipsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-accent/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {title}
            </h3>
          </div>
          {mood && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">For when you feel</span>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
                <span>{getMoodEmoji(mood)}</span>
                <span className="capitalize">{mood}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <ul className="space-y-3">
          {tips.map((item, index) => {
            const category = item.category || "mindfulness";
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.mindfulness;
            const Icon = config.icon;

            return (
              <li
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    config.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-card-foreground">{item.tip}</p>
                  <span
                    className={cn(
                      "inline-block mt-2 text-xs px-2 py-0.5 rounded-full",
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CopingTips;
