"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTamboThread, useTamboThreadInput, TamboThreadMessage } from "@tambo-ai/react";
import { MessageRenderer } from "./message-renderer";
import { ChatInput } from "./chat-input";
import { Suggestions } from "./suggestions";
import { Sparkles, Loader2, User, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// Check if text looks like a tool result JSON
function isToolResultJson(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return false;
  }
  try {
    const parsed = JSON.parse(trimmed);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      ("success" in parsed || "error" in parsed || "count" in parsed || "summary" in parsed)
    );
  } catch {
    return false;
  }
}

// Remove embedded JSON tool results from text
function stripToolResultJson(text: string): string {
  const jsonPattern = /\{[^{}]*"success"\s*:\s*(true|false)[^{}]*\}/g;
  return text.replace(jsonPattern, "").trim();
}

// Helper to extract text content from Tambo message
function getMessageText(message: TamboThreadMessage): string {
  let text = "";

  if (typeof message.content === "string") {
    text = message.content;
  } else if (Array.isArray(message.content)) {
    text = message.content
      .filter((part): part is { type: "text"; text: string } =>
        typeof part === "object" && part !== null && "type" in part && part.type === "text"
      )
      .map((part) => part.text)
      .join("");
  }

  // Filter out tool result JSON
  if (isToolResultJson(text)) {
    text = "";
  } else {
    text = stripToolResultJson(text);
  }

  // If no text but has a rendered component, save a placeholder
  if (!text && message.renderedComponent) {
    text = "[Showed interactive component]";
  }

  return text;
}

// Saved message type from MongoDB
export interface SavedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ThreadViewProps {
  threadId?: string;
  savedMessages?: SavedMessage[];
  onTitleUpdate?: (title: string) => void;
}

// Check if message likely had a chart/component
function likelyHadComponent(content: string): { had: boolean; type: string; prompt: string } {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("mood history") || lowerContent.includes("mood entries") || lowerContent.includes("visual overview") || lowerContent.includes("mood chart")) {
    return { had: true, type: "chart", prompt: "Show my mood history" };
  }
  if (lowerContent.includes("breathing") || lowerContent.includes("inhale") || lowerContent.includes("exhale")) {
    return { had: true, type: "breathing", prompt: "Start a breathing exercise" };
  }
  if (lowerContent.includes("journal") || lowerContent.includes("write about")) {
    return { had: true, type: "journal", prompt: "Write in my journal" };
  }
  if (lowerContent.includes("gratitude")) {
    return { had: true, type: "gratitude", prompt: "Practice gratitude" };
  }
  return { had: false, type: "", prompt: "" };
}

// Component to render saved messages (from MongoDB)
function SavedMessageRenderer({ message, onRegenerate }: { message: SavedMessage; onRegenerate?: (text: string) => void }) {
  const isUser = message.role === "user";
  const isComponentPlaceholder = message.content === "[Showed interactive component]";
  const componentInfo = !isUser ? likelyHadComponent(message.content) : { had: false, type: "", prompt: "" };

  // Skip rendering if no content or if it's a tool result JSON
  if (!message.content || isToolResultJson(message.content)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in opacity-70",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary/70 text-primary-foreground"
            : "bg-gradient-to-br from-primary/70 to-accent/70 text-white"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary/70 text-primary-foreground rounded-tr-sm"
              : "bg-card/70 border border-border text-card-foreground rounded-tl-sm",
            isComponentPlaceholder && "italic text-muted-foreground"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {isComponentPlaceholder ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground italic m-0">
                  Interactive component (reload to regenerate)
                </p>
                {onRegenerate && (
                  <button
                    onClick={() => onRegenerate("Show my mood history")}
                    className="text-xs text-primary hover:underline text-left"
                  >
                    Click to regenerate →
                  </button>
                )}
              </div>
            ) : (
              <>
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {componentInfo.had && onRegenerate && (
                  <button
                    onClick={() => onRegenerate(componentInfo.prompt)}
                    className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <span>↻</span> Regenerate {componentInfo.type}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThreadView({ threadId, savedMessages = [], onTitleUpdate }: ThreadViewProps) {
  const { thread, streaming } = useTamboThread();
  const { setValue, submit } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSavedTitle, setHasSavedTitle] = useState(false);
  const lastMessageCountRef = useRef(0);

  const isLoading = streaming && hasSubmitted;
  const messages = thread?.messages || [];
  const hasMessages = messages.length > 0;
  const hasSavedMessages = savedMessages.length > 0;
  const showWelcome = !hasMessages && !hasSavedMessages && !isLoading;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages, savedMessages]);

  // Reset hasSubmitted when we get messages back
  useEffect(() => {
    if (hasMessages && hasSubmitted) {
      setHasSubmitted(false);
    }
  }, [hasMessages, hasSubmitted]);

  // Save messages to MongoDB when they change
  const saveMessages = useCallback(async () => {
    if (!threadId || !messages.length) return;

    try {
      // Combine saved messages with new messages, filtering out tool messages and empty content
      const newMessages = messages
        .filter((msg) => msg.role !== "tool") // Skip tool messages
        .map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: getMessageText(msg),
          timestamp: new Date().toISOString(),
        }))
        .filter((msg) => msg.content.length > 0); // Skip empty messages

      const allMessages = [...savedMessages, ...newMessages];

      await fetch(`/api/threads/${threadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  }, [threadId, messages, savedMessages]);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      saveMessages();
      lastMessageCountRef.current = messages.length;
    }
  }, [messages.length, saveMessages]);

  // Update thread title based on first user message
  useEffect(() => {
    if (!hasSavedTitle && messages.length > 0 && onTitleUpdate && !hasSavedMessages) {
      const firstUserMessage = messages.find((m) => m.role === "user");
      if (firstUserMessage) {
        const content = getMessageText(firstUserMessage);
        if (content) {
          const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
          onTitleUpdate(title);
          setHasSavedTitle(true);
        }
      }
    }
  }, [messages, hasSavedTitle, onTitleUpdate, hasSavedMessages]);

  const handleSuggestionClick = async (text: string) => {
    setHasSubmitted(true);
    setValue(text);
    await submit();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome message when no messages */}
          {showWelcome && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-xl animate-pulse-gentle" />
                <div className="relative p-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                  <Sparkles className="w-10 h-10 text-primary animate-float" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                Welcome to MindFlow
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                I&apos;m here to help you track your mood, understand your patterns,
                and support your mental wellness journey.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                {[
                  { text: "Log my mood", emoji: "💭" },
                  { text: "I'm feeling anxious", emoji: "🌊" },
                  { text: "Start a breathing exercise", emoji: "🧘" },
                  { text: "Write in my journal", emoji: "📝" },
                ].map((suggestion, index) => (
                  <button
                    key={suggestion.text}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className={`group flex items-center gap-3 px-4 py-3.5 text-sm text-left rounded-xl border border-border
                      hover:border-primary/50 hover:bg-primary/5 hover:shadow-md
                      transition-all duration-200 press-effect stagger-${index + 1} animate-fade-in`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{suggestion.emoji}</span>
                    <span className="text-card-foreground group-hover:text-primary transition-colors">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Messages from MongoDB (History) */}
          {hasSavedMessages && (
            <>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <History className="w-4 h-4" />
                <span>Previous conversation</span>
              </div>
              {savedMessages.map((message) => (
                <SavedMessageRenderer
                  key={message.id}
                  message={message}
                  onRegenerate={handleSuggestionClick}
                />
              ))}
              {/* Divider between saved and new messages */}
              {hasMessages && (
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">Continuing conversation</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
            </>
          )}

          {/* New Messages from Tambo */}
          {messages.map((message) => (
            <MessageRenderer key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-gentle">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                  <span className="loading-dot" />
                </div>
                <span className="text-sm text-muted-foreground">
                  MindFlow is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <Suggestions isLoading={isLoading} />
          <ChatInput isLoading={isLoading} onSubmit={() => setHasSubmitted(true)} />
        </div>
      </div>
    </div>
  );
}

export default ThreadView;
