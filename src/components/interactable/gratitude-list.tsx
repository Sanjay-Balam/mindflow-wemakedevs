"use client";

import React, { useState } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { cn, formatDate } from "@/lib/utils";
import type { GratitudeListProps } from "@/lib/schemas";
import { Heart, Plus, Trash2, Sparkles } from "lucide-react";

export function GratitudeList(props: GratitudeListProps) {
  const defaultState: GratitudeListProps = {
    title: props.title || "Today's Gratitudes",
    items: props.items || [],
  };

  const [tamboState, setTamboState] = useTamboComponentState<GratitudeListProps>(
    "gratitude-list",
    defaultState
  );

  const state = tamboState || defaultState;
  const setState = setTamboState;

  const [newGratitude, setNewGratitude] = useState("");

  const handleAddGratitude = () => {
    if (newGratitude.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newGratitude.trim(),
        date: new Date().toISOString(),
      };
      setState({
        ...state,
        items: [...state.items, newItem],
      });
      setNewGratitude("");
    }
  };

  const handleRemoveGratitude = (id: string) => {
    setState({
      ...state,
      items: state.items.filter((item) => item.id !== id),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddGratitude();
    }
  };

  const todayItems = state.items.filter((item) => {
    const itemDate = new Date(item.date).toDateString();
    const today = new Date().toDateString();
    return itemDate === today;
  });

  const previousItems = state.items.filter((item) => {
    const itemDate = new Date(item.date).toDateString();
    const today = new Date().toDateString();
    return itemDate !== today;
  });

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-pink-500/10 to-rose-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {state.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {todayItems.length} gratitude
                {todayItems.length !== 1 ? "s" : ""} today
              </p>
            </div>
          </div>
          {todayItems.length >= 3 && (
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Goal met!
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Add new gratitude */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newGratitude}
            onChange={(e) => setNewGratitude(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What are you grateful for today?"
            className="flex-1 px-4 py-3 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleAddGratitude}
            disabled={!newGratitude.trim()}
            className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Today's gratitudes */}
        {todayItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Today</h4>
            <ul className="space-y-2">
              {todayItems.map((item, index) => (
                <li
                  key={item.id}
                  className="group flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-500/5 to-transparent hover:from-pink-500/10 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-card-foreground pt-0.5">
                    {item.text}
                  </p>
                  <button
                    onClick={() => handleRemoveGratitude(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Previous gratitudes */}
        {previousItems.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground">
              Previous
            </h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {previousItems
                .slice()
                .reverse()
                .map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <Heart className="w-4 h-4 text-pink-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-card-foreground text-sm">
                        {item.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveGratitude(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {state.items.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-pink-200 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Start adding things you&apos;re grateful for!
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Aim for at least 3 gratitudes each day
            </p>
          </div>
        )}

        {/* Progress indicator */}
        {todayItems.length > 0 && todayItems.length < 3 && (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {3 - todayItems.length} more to reach your daily goal!
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    n <= todayItems.length ? "bg-pink-500" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GratitudeList;
