"use client";

import { useState, useEffect, useCallback } from "react";

export interface JournalSummary {
  id: string;
  title: string;
  content: string;
  mood?: "great" | "good" | "okay" | "bad" | "terrible";
  tags: string[];
  timestamp: string;
  source: string;
}

export function useJournals() {
  const [journals, setJournals] = useState<JournalSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/journals");
      if (!response.ok) throw new Error("Failed to fetch journals");
      const data = await response.json();
      setJournals(data.journals);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const createJournal = useCallback(
    async (data: {
      title?: string;
      content: string;
      mood?: string;
      tags?: string[];
      source?: string;
    }) => {
      try {
        const response = await fetch("/api/journals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create journal");
        const result = await response.json();
        setJournals((prev) => [result.journal, ...prev]);
        return result.journal;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      }
    },
    []
  );

  const deleteJournal = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/journals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete journal");
      setJournals((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  }, []);

  return {
    journals,
    loading,
    error,
    fetchJournals,
    createJournal,
    deleteJournal,
  };
}
