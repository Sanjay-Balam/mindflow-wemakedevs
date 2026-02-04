"use client";

import React from "react";
import { TamboThreadMessage } from "@tambo-ai/react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

interface MessageRendererProps {
  message: TamboThreadMessage;
}

// Helper to extract text content from message
function getMessageText(message: TamboThreadMessage): string {
  if (typeof message.content === "string") {
    return message.content;
  }
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part) => part.type === "text")
      .map((part) => (part as { type: "text"; text: string }).text)
      .join("");
  }
  return "";
}

export function MessageRenderer({ message }: MessageRendererProps) {
  const isUser = message.role === "user";
  const hasComponent = message.renderedComponent !== null && message.renderedComponent !== undefined;
  const textContent = getMessageText(message);

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
