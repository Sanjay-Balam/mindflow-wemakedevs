"use client";

import React from "react";
import { useTamboThreadInput } from "@tambo-ai/react";
import { cn } from "@/lib/utils";
import type { QuickActionsProps } from "@/lib/schemas";
import {
  Heart,
  Brain,
  Smile,
  Sun,
  Moon,
  Wind,
  Sparkles,
  BookOpen,
  Pencil,
  BarChart3,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  brain: Brain,
  smile: Smile,
  sun: Sun,
  moon: Moon,
  wind: Wind,
  sparkles: Sparkles,
  book: BookOpen,
  pen: Pencil,
  chart: BarChart3,
};

const ICON_COLORS: Record<string, string> = {
  heart: "text-pink-500 bg-pink-500/10",
  brain: "text-purple-500 bg-purple-500/10",
  smile: "text-yellow-500 bg-yellow-500/10",
  sun: "text-amber-500 bg-amber-500/10",
  moon: "text-indigo-500 bg-indigo-500/10",
  wind: "text-cyan-500 bg-cyan-500/10",
  sparkles: "text-primary bg-primary/10",
  book: "text-green-500 bg-green-500/10",
  pen: "text-blue-500 bg-blue-500/10",
  chart: "text-orange-500 bg-orange-500/10",
};

export function QuickActions({ title, actions }: QuickActionsProps) {
  const { setValue, submit } = useTamboThreadInput();

  const handleAction = async (prompt: string) => {
    setValue(prompt);
    await submit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">
            {title || "Quick Actions"}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const iconKey = action.icon || "sparkles";
            const Icon = ICON_MAP[iconKey] || Sparkles;
            const colorClass = ICON_COLORS[iconKey] || ICON_COLORS.sparkles;

            return (
              <button
                key={index}
                onClick={() => handleAction(action.prompt)}
                className="group flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left card-hover"
              >
                <div
                  className={cn(
                    "p-2 rounded-lg flex-shrink-0 transition-colors",
                    colorClass
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
