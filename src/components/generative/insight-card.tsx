"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { InsightCardProps } from "@/lib/schemas";
import { Lightbulb, TrendingUp, Sparkles } from "lucide-react";

export function InsightCard({
  title,
  observation,
  pattern,
  suggestion,
  emoji,
}: InsightCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-amber-500/10 to-orange-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            {emoji && <span className="text-2xl">{emoji}</span>}
            <h3 className="text-lg font-semibold text-card-foreground">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Observation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            Observation
          </div>
          <p className="text-card-foreground leading-relaxed">{observation}</p>
        </div>

        {/* Pattern */}
        {pattern && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Pattern Detected
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-card-foreground">{pattern}</p>
            </div>
          </div>
        )}

        {/* Suggestion */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lightbulb className="w-4 h-4" />
            Suggestion
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <p className="text-card-foreground">{suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
