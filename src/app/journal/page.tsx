"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useJournals } from "@/hooks/useJournals";
import { cn, getMoodEmoji, formatDate } from "@/lib/utils";
import {
  Sparkles,
  LogOut,
  BookOpen,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Tag,
  X,
  Loader2,
} from "lucide-react";

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

export default function JournalPage() {
  const { data: session } = useSession();
  const { journals, loading, createJournal, deleteJournal } = useJournals();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<
    "great" | "good" | "okay" | "bad" | "terrible" | undefined
  >(undefined);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleTagToggle = (tag: string) => {
    setNewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !newTags.includes(customTag.trim().toLowerCase())) {
      setNewTags((prev) => [...prev, customTag.trim().toLowerCase()]);
      setCustomTag("");
    }
  };

  const handleCreateEntry = async () => {
    if (!newContent.trim()) return;
    setIsSaving(true);
    try {
      await createJournal({
        title: newTitle.trim() || "Untitled Entry",
        content: newContent,
        mood: newMood,
        tags: newTags.length > 0 ? newTags : undefined,
        source: "journal-page",
      });
      setNewTitle("");
      setNewContent("");
      setNewMood(undefined);
      setNewTags([]);
      setShowNewEntry(false);
    } catch (error) {
      console.error("Failed to create journal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteJournal(id);
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error("Failed to delete journal:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-card-foreground">
                MindFlow
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              Chat
            </Link>
            <span className="text-sm font-medium text-card-foreground">
              Journal
            </span>
            {session?.user && (
              <div className="flex items-center gap-2 ml-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-card-foreground hidden md:block">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-card-foreground"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-card-foreground">
                My Journal
              </h1>
            </div>
            <button
              onClick={() => setShowNewEntry(!showNewEntry)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors press-effect"
            >
              {showNewEntry ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  New Entry
                </>
              )}
            </button>
          </div>

          {/* New Entry Form */}
          {showNewEntry && (
            <div className="mb-8 p-6 bg-card rounded-xl border border-border shadow-sm animate-fade-in">
              <h2 className="text-lg font-semibold text-card-foreground mb-4">
                New Journal Entry
              </h2>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-card-foreground block mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Give your entry a title..."
                    className="w-full px-4 py-3 text-lg font-medium rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-medium text-card-foreground block mb-1">
                    Your thoughts
                  </label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write about your day, your feelings, your thoughts... This is your safe space."
                    rows={6}
                    className="w-full px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="text-sm font-medium text-card-foreground block mb-2">
                    How did you feel? (optional)
                  </label>
                  <div className="flex gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood}
                        onClick={() =>
                          setNewMood(newMood === mood ? undefined : mood)
                        }
                        className={cn(
                          "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                          newMood === mood
                            ? "bg-primary/10 ring-2 ring-primary"
                            : "hover:bg-muted"
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

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-card-foreground flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SUGGESTED_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm transition-all",
                          newTags.includes(tag)
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                    {newTags
                      .filter((t) => !SUGGESTED_TAGS.includes(t))
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-accent text-accent-foreground"
                        >
                          #{tag}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddCustomTag()
                      }
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
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCreateEntry}
                    disabled={!newContent.trim() || isSaving}
                    className="flex-1 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </button>
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="py-3 px-4 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Journal Entries List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : journals.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                No journal entries yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start writing to capture your thoughts and feelings.
              </p>
              <button
                onClick={() => setShowNewEntry(true)}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors press-effect"
              >
                Start Writing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {journals.map((journal) => {
                const isExpanded = expandedId === journal.id;
                return (
                  <div
                    key={journal.id}
                    className="bg-card rounded-xl border border-border shadow-sm overflow-hidden card-hover animate-fade-in"
                  >
                    {/* Collapsed View */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : journal.id)
                      }
                      className="w-full text-left px-6 py-4 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground truncate">
                            {journal.title || "Untitled Entry"}
                          </h3>
                          {journal.mood && (
                            <span className="text-lg flex-shrink-0">
                              {getMoodEmoji(journal.mood)}
                            </span>
                          )}
                          {journal.source === "chat" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                              from chat
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {formatDate(journal.timestamp)}
                        </p>
                        {!isExpanded && (
                          <p className="text-sm text-muted-foreground truncate">
                            {journal.content.slice(0, 120)}
                            {journal.content.length > 120 ? "..." : ""}
                          </p>
                        )}
                        {!isExpanded &&
                          journal.tags &&
                          journal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {journal.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {journal.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{journal.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded View */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-border pt-4 animate-fade-in">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-card-foreground whitespace-pre-wrap leading-relaxed">
                            {journal.content}
                          </p>
                        </div>

                        {journal.tags && journal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-4">
                            {journal.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            {new Date(journal.timestamp).toLocaleString()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(journal.id);
                            }}
                            disabled={deletingId === journal.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === journal.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
