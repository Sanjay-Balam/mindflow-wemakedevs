"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn, getMoodEmoji } from "@/lib/utils";
import type { MoodChartProps } from "@/lib/schemas";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MOOD_COLORS: Record<number, string> = {
  5: "#22c55e", // great
  4: "#84cc16", // good
  3: "#eab308", // okay
  2: "#f97316", // bad
  1: "#ef4444", // terrible
};

const getMoodLabel = (value: number): string => {
  const labels: Record<number, string> = {
    5: "Great",
    4: "Good",
    3: "Okay",
    2: "Bad",
    1: "Terrible",
  };
  return labels[value] || "Unknown";
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      mood: number;
      label: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-card-foreground">{data.date}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xl">{getMoodEmoji(data.label)}</span>
          <span
            className="font-semibold"
            style={{ color: MOOD_COLORS[data.mood] }}
          >
            {getMoodLabel(data.mood)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function MoodChart({ title, data, insight }: MoodChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No mood data available yet. Start logging your moods!
        </div>
      </div>
    );
  }

  // Calculate trend
  const firstMood = data[0]?.mood || 3;
  const lastMood = data[data.length - 1]?.mood || 3;
  const trend = lastMood - firstMood;
  const averageMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <div className="flex items-center gap-4">
            {/* Average */}
            <div className="text-sm">
              <span className="text-muted-foreground">Avg: </span>
              <span
                className="font-semibold"
                style={{ color: MOOD_COLORS[Math.round(averageMood)] }}
              >
                {averageMood.toFixed(1)}
              </span>
            </div>
            {/* Trend */}
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                trend > 0 && "bg-green-100 text-green-700 dark:bg-green-900/30",
                trend < 0 && "bg-red-100 text-red-700 dark:bg-red-900/30",
                trend === 0 &&
                  "bg-gray-100 text-gray-700 dark:bg-gray-900/30"
              )}
            >
              {trend > 0 && <TrendingUp className="w-4 h-4" />}
              {trend < 0 && <TrendingDown className="w-4 h-4" />}
              {trend === 0 && <Minus className="w-4 h-4" />}
              <span>
                {trend > 0 ? "Improving" : trend < 0 ? "Declining" : "Stable"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => getMoodLabel(value).charAt(0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#moodGradient)"
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={MOOD_COLORS[payload.mood]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{
                  r: 8,
                  stroke: "#6366f1",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          {[5, 4, 3, 2, 1].map((mood) => (
            <div key={mood} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: MOOD_COLORS[mood] }}
              />
              <span className="text-muted-foreground">{getMoodLabel(mood)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      {insight && (
        <div className="px-6 pb-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-card-foreground">{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodChart;
