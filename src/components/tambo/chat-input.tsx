"use client";

import React, { useRef, useEffect } from "react";
import { useTamboThreadInput } from "@tambo-ai/react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  isLoading?: boolean;
  onSubmit?: () => void;
}

export function ChatInput({ isLoading = false, onSubmit }: ChatInputProps) {
  const { value, setValue, submit } = useTamboThreadInput();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit?.();
      await submit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2 p-4 bg-card border border-border rounded-2xl shadow-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How are you feeling today?"
          rows={1}
          disabled={isLoading}
          className={cn(
            "flex-1 resize-none bg-transparent border-0 outline-none text-card-foreground placeholder:text-muted-foreground",
            "min-h-[24px] max-h-[150px]",
            isLoading && "opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex-shrink-0 p-2 rounded-xl transition-all",
            value.trim() && !isLoading
              ? "bg-primary text-primary-foreground hover:bg-primary-dark"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">
        MindFlow is here to support you. Press Enter to send.
      </p>
    </form>
  );
}

export default ChatInput;
