"use client";

import { useState, useEffect, useCallback } from "react";

export interface ThreadSummary {
  _id: string;
  threadId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  mood?: string;
}

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  components?: unknown[];
  timestamp: Date;
}

export interface FullThread extends ThreadSummary {
  messages: ThreadMessage[];
}

export function useThreads() {
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/threads");
      if (!response.ok) throw new Error("Failed to fetch threads");
      const data = await response.json();
      setThreads(data.threads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const createThread = useCallback(async (threadId: string, title?: string) => {
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId, title }),
      });
      if (!response.ok) throw new Error("Failed to create thread");
      const data = await response.json();
      setThreads((prev) => [data.thread, ...prev]);
      return data.thread;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  }, []);

  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete thread");
      setThreads((prev) => prev.filter((t) => t.threadId !== threadId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  }, []);

  return {
    threads,
    loading,
    error,
    fetchThreads,
    createThread,
    deleteThread,
  };
}

export function useThread(threadId: string | null) {
  const [thread, setThread] = useState<FullThread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThread = useCallback(async () => {
    if (!threadId) {
      setThread(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/threads/${threadId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setThread(null);
          return;
        }
        throw new Error("Failed to fetch thread");
      }
      const data = await response.json();
      setThread(data.thread);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const updateThread = useCallback(
    async (updates: {
      title?: string;
      messages?: ThreadMessage[];
      mood?: string;
    }) => {
      if (!threadId) return;

      try {
        const response = await fetch(`/api/threads/${threadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error("Failed to update thread");

        setThread((prev) =>
          prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    [threadId]
  );

  return {
    thread,
    loading,
    error,
    fetchThread,
    updateThread,
  };
}
