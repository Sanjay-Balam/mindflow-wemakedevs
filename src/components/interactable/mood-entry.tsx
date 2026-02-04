"use client";

import React, { useState } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { cn, getMoodColor, getMoodEmoji } from "@/lib/utils";
import type { MoodEntryProps } from "@/lib/schemas";
import {
  Heart,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Check,
  X,
  Plus,
  Loader2,
} from "lucide-react";

const EMOTIONS = [
  "Happy",
  "Calm",
  "Grateful",
  "Excited",
  "Hopeful",
  "Anxious",
  "Stressed",
  "Sad",
  "Frustrated",
  "Tired",
  "Lonely",
  "Overwhelmed",
];

const COMMON_TRIGGERS = [
  "Work",
  "Relationship",
  "Family",
  "Health",
  "Money",
  "Sleep",
  "Social",
  "Weather",
];

const MOOD_OPTIONS = [
  { value: "great", label: "Great", icon: Heart, color: "text-green-500" },
  { value: "good", label: "Good", icon: Smile, color: "text-lime-500" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-yellow-500" },
  { value: "bad", label: "Bad", icon: Frown, color: "text-orange-500" },
  {
    value: "terrible",
    label: "Terrible",
    icon: CloudRain,
    color: "text-red-500",
  },
] as const;

export function MoodEntry(props: MoodEntryProps) {
  const defaultState: MoodEntryProps = {
    mood: props.mood || "okay",
    emotions: props.emotions || [],
    triggers: props.triggers,
    note: props.note,
    timestamp: props.timestamp || new Date().toISOString(),
  };

  const [tamboState, setTamboState] = useTamboComponentState<MoodEntryProps>(
    "mood-entry",
    defaultState
  );


  const state = tamboState || defaultState;
  const setState = setTamboState;

  const [customTrigger, setCustomTrigger] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMoodSelect = (
    mood: "great" | "good" | "okay" | "bad" | "terrible"
  ) => {
    setState({
      ...state,
      mood,
      timestamp: new Date().toISOString(),
    });
    setIsSaved(false);
  };

  const handleEmotionToggle = (emotion: string) => {
    const emotions = state.emotions || [];
    const newEmotions = emotions.includes(emotion)
      ? emotions.filter((e) => e !== emotion)
      : [...emotions, emotion];
    setState({ ...state, emotions: newEmotions });
    setIsSaved(false);
  };

  const handleTriggerToggle = (trigger: string) => {
    const triggers = state.triggers || [];
    const newTriggers = triggers.includes(trigger)
      ? triggers.filter((t) => t !== trigger)
      : [...triggers, trigger];
    setState({ ...state, triggers: newTriggers });
    setIsSaved(false);
  };

  const handleAddCustomTrigger = () => {
    if (customTrigger.trim()) {
      const triggers = state.triggers || [];
      if (!triggers.includes(customTrigger.trim())) {
        setState({ ...state, triggers: [...triggers, customTrigger.trim()] });
      }
      setCustomTrigger("");
      setIsSaved(false);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({ ...state, note: e.target.value });
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // 1. Update Tambo component state
      const updatedState = { ...state, timestamp: new Date().toISOString() };
      setState(updatedState);

      // 2. Save to MongoDB
      await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedState),
      });

      setIsSaved(true);
    } catch (error) {
      console.error("Failed to save mood:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in-up mindflow-card">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-border transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${getMoodColor(state.mood)}20 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getMoodEmoji(state.mood)}</span>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                How are you feeling?
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(state.timestamp).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          {isSaved && (
            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in-scale shadow-sm">
              <Check className="w-4 h-4" />
              Saved
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Select your mood
          </label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = state.mood === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleMoodSelect(option.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 press-effect",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md scale-105"
                      : "border-border hover:border-primary/50 hover:bg-muted hover:scale-102"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform",
                      isSelected ? `${option.color} scale-110` : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      isSelected
                        ? "text-card-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emotions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            What emotions are you experiencing?
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((emotion) => {
              const isSelected = (state.emotions || []).includes(emotion);
              return (
                <button
                  key={emotion}
                  onClick={() => handleEmotionToggle(emotion)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {emotion}
                </button>
              );
            })}
          </div>
        </div>

        {/* Triggers */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Any triggers? (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_TRIGGERS.map((trigger) => {
              const isSelected = (state.triggers || []).includes(trigger);
              return (
                <button
                  key={trigger}
                  onClick={() => handleTriggerToggle(trigger)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                    isSelected
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/50"
                  )}
                >
                  {trigger}
                </button>
              );
            })}
            {/* Custom triggers */}
            {(state.triggers || [])
              .filter((t) => !COMMON_TRIGGERS.includes(t))
              .map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => handleTriggerToggle(trigger)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border border-accent bg-accent/10 text-accent"
                >
                  {trigger}
                  <X className="w-3 h-3" />
                </button>
              ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomTrigger()}
              placeholder="Add custom trigger..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleAddCustomTrigger}
              disabled={!customTrigger.trim()}
              className="px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-card-foreground">
            Add a note (optional)
          </label>
          <textarea
            value={state.note || ""}
            onChange={handleNoteChange}
            placeholder="How are you really feeling? What's on your mind?"
            rows={3}
            className="w-full px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={cn(
            "w-full py-3.5 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2 press-effect",
            isSaved
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default scale-[1.02] shadow-lg"
              : "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:shadow-lg hover:scale-[1.02]",
            isSaving && "opacity-80 cursor-wait"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <span className="flex items-center gap-2 animate-fade-in">
              <Check className="w-5 h-5" />
              Mood Saved!
            </span>
          ) : (
            <span>Save Mood Entry</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default MoodEntry;
