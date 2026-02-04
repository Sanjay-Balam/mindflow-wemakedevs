"use client";

import React from "react";
import { TamboProvider } from "@tambo-ai/react";
import { ThreadView } from "@/components/tambo/thread-view";
import { components } from "@/lib/tambo";
import Link from "next/link";
import { Home, Sparkles } from "lucide-react";

export default function ChatPage() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <div className="p-4 rounded-full bg-red-500/10 w-fit mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-card-foreground mb-2">
            API Key Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please add your Tambo API key to the environment variables.
          </p>
          <code className="block bg-muted p-3 rounded-lg text-sm text-left">
            NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
          </code>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
    >
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-card-foreground">
                MindFlow
              </span>
            </Link>
            <div className="text-sm text-muted-foreground">
              Your mental wellness companion
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          <ThreadView />
        </main>
      </div>
    </TamboProvider>
  );
}
