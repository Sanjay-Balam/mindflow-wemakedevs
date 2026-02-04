"use client";

import React, { useRef, useEffect } from "react";
import { useTamboThread } from "@tambo-ai/react";
import { MessageRenderer } from "./message-renderer";
import { ChatInput } from "./chat-input";
import { Sparkles, Loader2 } from "lucide-react";

export function ThreadView() {
  const { thread, streaming } = useTamboThread();
  const isLoading = streaming;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const messages = thread?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome message when no messages */}
          {!hasMessages && (
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
                    onClick={() => {
                      // This will be handled by the input
                    }}
                    className="px-4 py-3 text-sm text-left rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
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
          <ChatInput isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default ThreadView;
