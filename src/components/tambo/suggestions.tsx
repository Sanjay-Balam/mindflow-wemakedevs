"use client";

import React from "react";
import { useTamboSuggestions } from "@tambo-ai/react";
import { Lightbulb, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionsProps {
  isLoading?: boolean;
}

export function Suggestions({ isLoading = false }: SuggestionsProps) {
  const { suggestions, accept, generateResult } = useTamboSuggestions({
    maxSuggestions: 3,
  });

  const isGenerating = generateResult?.isPending;

  // Hide while AI is streaming or while there are no suggestions
  if (isLoading) return null;

  if (isGenerating) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm animate-fade-in">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Thinking of suggestions...</span>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      <Lightbulb className="w-4 h-4 text-muted-foreground mt-1.5 flex-shrink-0" />
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id || index}
          onClick={() => accept({ suggestion, shouldSubmit: true })}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full border border-border",
            "bg-card hover:bg-primary/5 hover:border-primary/50",
            "text-card-foreground hover:text-primary",
            "transition-all duration-200 press-effect",
            `stagger-${index + 1} animate-fade-in`
          )}
        >
          {suggestion.title}
        </button>
      ))}
    </div>
  );
}

export default Suggestions;
