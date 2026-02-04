"use client";

import React, { useState, useCallback, useEffect } from "react";
import { TamboProvider } from "@tambo-ai/react";
import { ThreadView, SavedMessage } from "@/components/tambo/thread-view";
import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { useThreads } from "@/hooks/useThreads";
import { components } from "@/lib/tambo";
import Link from "next/link";
import { Home, Sparkles, Menu, X } from "lucide-react";

export default function ChatPage() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const {
    threads,
    loading: threadsLoading,
    createThread,
    deleteThread,
    fetchThreads,
  } = useThreads();

  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [key, setKey] = useState(0); // Force re-mount TamboProvider
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Generate a new thread ID
  const generateThreadId = () => `thread_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Fetch saved messages for a thread
  const fetchSavedMessages = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.thread?.messages?.length > 0) {
          setSavedMessages(data.thread.messages);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch saved messages:", error);
    }
    setSavedMessages([]);
  }, []);

  // Handle creating a new chat
  const handleNewChat = useCallback(async () => {
    const newThreadId = generateThreadId();
    try {
      await createThread(newThreadId, "New Conversation");
      setCurrentThreadId(newThreadId);
      setSavedMessages([]); // Clear saved messages for new chat
      setKey((k) => k + 1); // Force re-mount to start fresh
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create thread:", error);
    }
  }, [createThread]);

  // Handle selecting an existing thread
  const handleSelectThread = useCallback(async (threadId: string) => {
    setCurrentThreadId(threadId);
    await fetchSavedMessages(threadId); // Load saved messages
    setKey((k) => k + 1); // Force re-mount to load thread
    setMobileSidebarOpen(false);
  }, [fetchSavedMessages]);

  // Handle deleting a thread
  const handleDeleteThread = useCallback(
    async (threadId: string) => {
      try {
        await deleteThread(threadId);
        if (currentThreadId === threadId) {
          // If deleting current thread, switch to another or create new
          const remaining = threads.filter((t) => t.threadId !== threadId);
          if (remaining.length > 0) {
            handleSelectThread(remaining[0].threadId);
          } else {
            handleNewChat();
          }
        }
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    },
    [currentThreadId, threads, deleteThread, handleSelectThread, handleNewChat]
  );

  // Initialize with a thread on first load
  useEffect(() => {
    if (!threadsLoading && !currentThreadId) {
      if (threads.length > 0) {
        // Load the most recent thread with its messages
        handleSelectThread(threads[0].threadId);
      } else {
        // Create initial thread
        handleNewChat();
      }
    }
  }, [threadsLoading, threads, currentThreadId, handleSelectThread, handleNewChat]);

  // Callback to update thread title when first message is sent
  const handleThreadUpdate = useCallback(
    async (title: string) => {
      if (currentThreadId) {
        try {
          await fetch(`/api/threads/${currentThreadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
          });
          fetchThreads();
        } catch (error) {
          console.error("Failed to update thread title:", error);
        }
      }
    },
    [currentThreadId, fetchThreads]
  );

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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileSidebarOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

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
          <div className="text-sm text-muted-foreground hidden sm:block">
            Your mental wellness companion
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-30 lg:z-0
            transform lg:transform-none transition-transform duration-300
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            pt-14 lg:pt-0
          `}
        >
          <ChatSidebar
            threads={threads}
            loading={threadsLoading}
            currentThreadId={currentThreadId}
            onNewChat={handleNewChat}
            onSelectThread={handleSelectThread}
            onDeleteThread={handleDeleteThread}
          />
        </div>

        {/* Chat Area */}
        <main className="flex-1 overflow-hidden">
          {currentThreadId && (
            <TamboProvider
              key={key}
              apiKey={apiKey}
              components={components}
            >
              <ThreadView
                threadId={currentThreadId}
                savedMessages={savedMessages}
                onTitleUpdate={handleThreadUpdate}
              />
            </TamboProvider>
          )}
        </main>
      </div>
    </div>
  );
}
