"use client";

import React, { useState } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { cn, getMoodEmoji, formatDate } from "@/lib/utils";
import type { JournalEntryProps } from "@/lib/schemas";
import { BookOpen, Tag, Check, X, Plus, Pencil } from "lucide-react";

const MOOD_OPTIONS = ["great", "good", "okay", "bad", "terrible"] as const;

const SUGGESTED_TAGS = [
  "reflection",
  "gratitude",
  "goals",
  "challenges",
  "wins",
  "learning",
  "relationships",
  "health",
  "work",
  "personal",
];

export function JournalEntry(props: JournalEntryProps) {
  const defaultState: JournalEntryProps = {
    title: props.title || "",
    content: props.content || "",
    mood: props.mood,
    tags: props.tags,
    timestamp: props.timestamp || new Date().toISOString(),
  };

  const [tamboState, setTamboState] = useTamboComponentState<JournalEntryProps>(
    "journal-entry",
    defaultState
  );

  const state = tamboState || defaultState;
  const setState = setTamboState;

  const [customTag, setCustomTag] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(!state.content);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, title: e.target.value });
    setIsSaved(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({ ...state, content: e.target.value });
    setIsSaved(false);
  };

  const handleMoodSelect = (
    mood: "great" | "good" | "okay" | "bad" | "terrible"
  ) => {
    setState({ ...state, mood: state.mood === mood ? undefined : mood });
    setIsSaved(false);
  };

  const handleTagToggle = (tag: string) => {
    const tags = state.tags || [];
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setState({ ...state, tags: newTags });
    setIsSaved(false);
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      const tags = state.tags || [];
      if (!tags.includes(customTag.trim().toLowerCase())) {
        setState({
          ...state,
          tags: [...tags, customTag.trim().toLowerCase()],
        });
      }
      setCustomTag("");
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    setState({ ...state, timestamp: new Date().toISOString() });
    setIsSaved(true);
    setIsEditing(false);
  };

  const wordCount = state.content?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                Journal Entry
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(state.timestamp || new Date().toISOString())}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSaved && (
              <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-sm font-medium">
                <Check className="w-4 h-4" />
                Saved
              </div>
            )}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={state.title || ""}
              onChange={handleTitleChange}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 text-lg font-medium rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <h2 className="text-xl font-semibold text-card-foreground">
              {state.title || "Untitled Entry"}
            </h2>
          )}
        </div>

        {/* Mood Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground">
            How did you feel? (optional)
          </label>
          <div className="flex gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                onClick={() => isEditing && handleMoodSelect(mood)}
                disabled={!isEditing}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                  state.mood === mood
                    ? "bg-primary/10 ring-2 ring-primary"
                    : isEditing
                    ? "hover:bg-muted"
                    : "",
                  !isEditing && "cursor-default"
                )}
              >
                <span className="text-2xl">{getMoodEmoji(mood)}</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {mood}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-card-foreground">
              Your thoughts
            </label>
            <span className="text-xs text-muted-foreground">
              {wordCount} words
            </span>
          </div>
          {isEditing ? (
            <textarea
              value={state.content || ""}
              onChange={handleContentChange}
              placeholder="Write about your day, your feelings, your thoughts... This is your safe space."
              rows={8}
              className="w-full px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
            />
          ) : (
            <div className="px-4 py-3 bg-muted/30 rounded-lg min-h-[200px]">
              <p className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed">
                {state.content || "No content yet..."}
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => {
              const isSelected = (state.tags || []).includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => isEditing && handleTagToggle(tag)}
                  disabled={!isEditing}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-all",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : isEditing
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-muted text-muted-foreground cursor-default"
                  )}
                >
                  #{tag}
                </button>
              );
            })}
            {/* Custom tags */}
            {(state.tags || [])
              .filter((t) => !SUGGESTED_TAGS.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => isEditing && handleTagToggle(tag)}
                  disabled={!isEditing}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground"
                >
                  #{tag}
                  {isEditing && <X className="w-3 h-3" />}
                </button>
              ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
                placeholder="Add custom tag..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
                className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!state.content?.trim()}
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Entry
            </button>
            {state.content && (
              <button
                onClick={() => setIsEditing(false)}
                className="py-3 px-4 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalEntry;
