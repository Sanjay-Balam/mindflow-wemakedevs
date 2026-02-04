"use client";

import React from "react";
import { cn, getMoodEmoji } from "@/lib/utils";
import type { WeeklySummaryProps } from "@/lib/schemas";
import { Calendar, TrendingUp, Award, Sparkles } from "lucide-react";

const MOOD_COLORS: Record<string, string> = {
  great: "bg-green-500",
  good: "bg-lime-500",
  okay: "bg-yellow-500",
  bad: "bg-orange-500",
  terrible: "bg-red-500",
};

const getMoodLabel = (value: number): string => {
  if (value >= 4.5) return "Great";
  if (value >= 3.5) return "Good";
  if (value >= 2.5) return "Okay";
  if (value >= 1.5) return "Bad";
  return "Terrible";
};

export function WeeklySummary({
  title,
  dateRange,
  averageMood,
  moodBreakdown,
  totalEntries,
  topEmotions,
  highlights,
  suggestion,
}: WeeklySummaryProps) {
  const totalMoods =
    moodBreakdown.great +
    moodBreakdown.good +
    moodBreakdown.okay +
    moodBreakdown.bad +
    moodBreakdown.terrible;

  const getMoodPercentage = (count: number) =>
    totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{dateRange}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {averageMood.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Mood ({getMoodLabel(averageMood)})
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-card-foreground">
              {totalEntries}
            </div>
            <div className="text-sm text-muted-foreground">Entries</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-card-foreground">
              {moodBreakdown.great + moodBreakdown.good}
            </div>
            <div className="text-sm text-muted-foreground">Positive Days</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl">
              {getMoodEmoji(getMoodLabel(averageMood).toLowerCase())}
            </div>
            <div className="text-sm text-muted-foreground">Overall</div>
          </div>
        </div>

        {/* Mood Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Mood Distribution
          </h4>
          <div className="space-y-2">
            {(["great", "good", "okay", "bad", "terrible"] as const).map(
              (mood) => {
                const count = moodBreakdown[mood];
                const percentage = getMoodPercentage(count);
                return (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="w-20 text-sm capitalize text-muted-foreground flex items-center gap-1">
                      {getMoodEmoji(mood)} {mood}
                    </span>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          MOOD_COLORS[mood]
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Top Emotions */}
        {topEmotions && topEmotions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Top Emotions
            </h4>
            <div className="flex flex-wrap gap-2">
              {topEmotions.map((emotion, index) => (
                <span
                  key={emotion}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Highlights
            </h4>
            <ul className="space-y-2">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-card-foreground"
                >
                  <span className="text-primary mt-0.5">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestion */}
        {suggestion && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <p className="text-sm text-card-foreground">
              <span className="font-medium text-accent">Tip: </span>
              {suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklySummary;
