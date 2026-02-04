"use client";

import React from "react";
import { TamboThreadMessage } from "@tambo-ai/react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface MessageRendererProps {
  message: TamboThreadMessage;
}

// Check if text looks like a tool result JSON
function isToolResultJson(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return false;
  }
  try {
    const parsed = JSON.parse(trimmed);
    // Check if it has typical tool result properties
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
  // Match JSON objects that look like tool results
  const jsonPattern = /\{[^{}]*"success"\s*:\s*(true|false)[^{}]*\}/g;
  return text.replace(jsonPattern, "").trim();
}

// Helper to extract text content from message, filtering out tool results
function getMessageText(message: TamboThreadMessage): string {
  if (typeof message.content === "string") {
    // Filter out tool result JSON from string content
    if (isToolResultJson(message.content)) {
      return "";
    }
    // Also strip embedded JSON from text
    return stripToolResultJson(message.content);
  }
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part) => part.type === "text")
      .map((part) => (part as { type: "text"; text: string }).text)
      .filter((text) => !isToolResultJson(text)) // Filter out pure tool results
      .map((text) => stripToolResultJson(text)) // Strip embedded JSON
      .filter((text) => text.length > 0) // Remove empty strings
      .join("");
  }
  return "";
}

export function MessageRenderer({ message }: MessageRendererProps) {
  const isUser = message.role === "user";
  const hasComponent = message.renderedComponent !== null && message.renderedComponent !== undefined;
  const textContent = getMessageText(message);

  // Skip rendering tool result messages entirely (role is "tool" or no meaningful content)
  if (message.role === "tool") {
    return null;
  }

  // Skip empty messages with no component
  if (!textContent && !hasComponent) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-gradient-to-br from-primary to-accent text-white"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Text content */}
        {textContent && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card border border-border text-card-foreground rounded-tl-sm"
            )}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Rendered component */}
        {hasComponent && (
          <div className="w-full mt-2">
            {message.renderedComponent}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageRenderer;
