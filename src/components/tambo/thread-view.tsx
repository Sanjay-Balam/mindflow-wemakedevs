"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTamboThread, useTamboThreadInput, TamboThreadMessage } from "@tambo-ai/react";
import { MessageRenderer } from "./message-renderer";
import { ChatInput } from "./chat-input";
import { Sparkles, Loader2, User, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

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

// Component to render saved messages (from MongoDB)
function SavedMessageRenderer({ message }: { message: SavedMessage }) {
  const isUser = message.role === "user";
  const isComponentPlaceholder = message.content === "[Showed interactive component]";

  // Skip rendering if no content and not a component placeholder
  if (!message.content) {
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
              <p className="text-sm text-muted-foreground italic m-0">
                Showed an interactive component (not available in history)
              </p>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
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
      // Combine saved messages with new messages
      const allMessages = [
        ...savedMessages,
        ...messages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: getMessageText(msg),
          timestamp: new Date().toISOString(),
        })),
      ];

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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                Welcome to MindFlow
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                I&apos;m here to help you track your mood, understand your patterns,
                and support your mental wellness journey.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {[
                  { text: "Log my mood", icon: "heart" },
                  { text: "I'm feeling anxious", icon: "wind" },
                  { text: "Start a breathing exercise", icon: "sparkles" },
                  { text: "Write in my journal", icon: "book" },
                ].map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="px-4 py-3 text-sm text-left rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {suggestion.text}
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
                <SavedMessageRenderer key={message.id} message={message} />
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput isLoading={isLoading} onSubmit={() => setHasSubmitted(true)} />
        </div>
      </div>
    </div>
  );
}

export default ThreadView;
