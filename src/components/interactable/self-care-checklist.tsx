"use client";

import React from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { cn } from "@/lib/utils";
import type { SelfCareChecklistProps } from "@/lib/schemas";
import { CheckCircle2, Circle, Droplets, Brain, Users, Apple, Sparkles } from "lucide-react";

const DEFAULT_ITEMS = [
  { id: "1", label: "Drink 8 glasses of water", category: "physical" as const, completed: false },
  { id: "2", label: "Exercise for 30 minutes", category: "physical" as const, completed: false },
  { id: "3", label: "Sleep 7+ hours", category: "physical" as const, completed: false },
  { id: "4", label: "Connect with someone you care about", category: "social" as const, completed: false },
  { id: "5", label: "Practice mindfulness or meditation", category: "mental" as const, completed: false },
  { id: "6", label: "Eat a nutritious meal", category: "nutrition" as const, completed: false },
  { id: "7", label: "Spend time outside", category: "physical" as const, completed: false },
  { id: "8", label: "Limit screen time before bed", category: "mental" as const, completed: false },
];

const CATEGORY_CONFIG = {
  physical: { icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10" },
  mental: { icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
  social: { icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
  nutrition: { icon: Apple, color: "text-orange-500", bg: "bg-orange-500/10" },
};

export function SelfCareChecklist(props: SelfCareChecklistProps) {
  const defaultState: SelfCareChecklistProps = {
    title: props.title || "Daily Self-Care",
    items: props.items?.length ? props.items : DEFAULT_ITEMS,
    date: props.date || new Date().toISOString(),
  };

  const [tamboState, setTamboState] = useTamboComponentState<SelfCareChecklistProps>(
    "self-care-checklist",
    defaultState
  );

  const state = tamboState || defaultState;

  const completedCount = state.items.filter((item) => item.completed).length;
  const totalCount = state.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  const handleToggle = (id: string) => {
    setTamboState({
      ...state,
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {state.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedCount}/{totalCount} completed
              </p>
            </div>
          </div>
          {allDone && (
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              All done!
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              allDone ? "bg-emerald-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="p-4 space-y-1">
        {state.items.map((item, index) => {
          const config = CATEGORY_CONFIG[item.category];
          const Icon = config.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left press-effect",
                item.completed
                  ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                  : "hover:bg-muted/50"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className={cn("p-1.5 rounded-md flex-shrink-0", config.bg)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <span
                className={cn(
                  "flex-1 text-sm transition-all",
                  item.completed
                    ? "text-muted-foreground line-through"
                    : "text-card-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Celebratory footer */}
      {allDone && (
        <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-emerald-500/5 to-teal-500/5 text-center">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Amazing work! You completed all your self-care activities today.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Taking care of yourself is the foundation of wellbeing.
          </p>
        </div>
      )}
    </div>
  );
}

export default SelfCareChecklist;
