"use client";

import React, { useState } from "react";
import {
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { ThreadSummary } from "@/hooks/useThreads";

interface ChatSidebarProps {
  threads: ThreadSummary[];
  loading: boolean;
  currentThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
}

export function ChatSidebar({
  threads,
  loading,
  currentThreadId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      setDeletingId(threadId);
      try {
        await onDeleteThread(threadId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getMoodEmoji = (mood?: string) => {
    const moods: Record<string, string> = {
      great: "😊",
      good: "🙂",
      okay: "😐",
      bad: "😔",
      terrible: "😢",
    };
    return mood ? moods[mood] || "" : "";
  };

  if (collapsed) {
    return (
      <div className="w-12 h-full bg-card border-r border-border flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <button
          onClick={onNewChat}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          title="New chat"
        >
          <MessageSquarePlus className="w-5 h-5 text-primary" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-card-foreground">Conversations</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          <MessageSquarePlus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="px-2 py-1 space-y-1">
            {threads.map((thread) => (
              <div
                key={thread.threadId}
                onClick={() => onSelectThread(thread.threadId)}
                className={`group relative flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentThreadId === thread.threadId
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {thread.mood && (
                      <span className="text-sm">{getMoodEmoji(thread.mood)}</span>
                    )}
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {thread.title}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(thread.updatedAt)}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, thread.threadId)}
                  className={`p-1.5 rounded-md transition-all ${
                    deletingId === thread.threadId
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } hover:bg-destructive/10 text-muted-foreground hover:text-destructive`}
                  title="Delete conversation"
                >
                  {deletingId === thread.threadId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          {threads.length} conversation{threads.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

export default ChatSidebar;
