"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider, MCPTransport } from "@tambo-ai/react/mcp";
import { ThreadView, SavedMessage } from "@/components/tambo/thread-view";
import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { useThreads } from "@/hooks/useThreads";
import { components } from "@/lib/tambo";
import { tools } from "@/lib/tools";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Home, Sparkles, Menu, X, LogOut } from "lucide-react";

export default function ChatPage() {
  const { data: session } = useSession();
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

  // Context helpers provide dynamic app state to the AI
  const contextHelpers = useMemo(
    () => ({
      timeOfDay: () => {
        const hour = new Date().getHours();
        if (hour < 12) return { period: "morning", greeting: "Good morning" };
        if (hour < 17) return { period: "afternoon", greeting: "Good afternoon" };
        return { period: "evening", greeting: "Good evening" };
      },
      recentMoodContext: async () => {
        try {
          const response = await fetch("/api/moods?days=3");
          const data = await response.json();
          if (data.moods?.length > 0) {
            return {
              recentMoods: data.moods.map(
                (m: { mood: string; timestamp: string; note?: string }) => ({
                  mood: m.mood,
                  date: new Date(m.timestamp).toLocaleDateString(),
                  note: m.note,
                })
              ),
              count: data.moods.length,
            };
          }
          return { recentMoods: [], count: 0 };
        } catch {
          return null;
        }
      },
      appContext: () => ({
        availableFeatures: [
          "Mood logging with emotion tags and triggers",
          "Guided breathing exercises (4-7-8, Box, Deep)",
          "Journaling with mood association",
          "Gratitude tracking with daily goals",
          "Mood trend visualization charts",
          "AI-powered emotional insights",
          "Coping strategy suggestions",
          "Weekly mood summaries",
          "Mood reminders and ambient sounds",
          "Mood data export for therapists",
          "Self-care daily checklist",
          "Guided meditations",
          "CBT thought challenging exercises",
          "Sleep hygiene tips",
          "Voice input for hands-free interaction",
        ],
      }),
      habitContext: async () => {
        try {
          const [moodsRes, journalsRes] = await Promise.all([
            fetch("/api/moods?days=30"),
            fetch("/api/journals"),
          ]);
          const moodsData = await moodsRes.json();
          const journalsData = await journalsRes.json();

          const moods = moodsData.moods || [];
          const journals = journalsData.journals || [];

          // Calculate mood logging streak (consecutive days)
          let moodStreak = 0;
          const today = new Date();
          for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split("T")[0];
            const hasEntry = moods.some((m: { timestamp?: string }) => m.timestamp?.startsWith(dateStr));
            if (hasEntry) moodStreak++;
            else break;
          }

          // Last check-in time
          const lastMood = moods[0]?.timestamp;
          const lastJournal = journals[0]?.timestamp;

          return {
            moodStreak,
            totalMoodEntries: moods.length,
            totalJournalEntries: journals.length,
            lastMoodCheckIn: lastMood || null,
            lastJournalEntry: lastJournal || null,
          };
        } catch {
          return null;
        }
      },
    }),
    []
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
          <div className="flex items-center gap-3">
            <Link
              href="/journal"
              className="text-sm text-muted-foreground hover:text-card-foreground transition-colors hidden sm:block"
            >
              Journal
            </Link>
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
              tools={tools}
              contextHelpers={contextHelpers}
              mcpServers={[
                {
                  name: "MindFlow Wellness",
                  url: `${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp`,
                  transport: MCPTransport.HTTP,
                  serverKey: "mindflow-wellness",
                },
              ]}
            >
              <TamboMcpProvider>
                <ThreadView
                  threadId={currentThreadId}
                  savedMessages={savedMessages}
                  onTitleUpdate={handleThreadUpdate}
                />
              </TamboMcpProvider>
            </TamboProvider>
          )}
        </main>
      </div>
    </div>
  );
}
