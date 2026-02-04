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
      <div className={cn(
        "flex items-end gap-2 p-4 bg-card border rounded-2xl shadow-sm transition-all duration-200",
        value.trim() ? "border-primary/30 shadow-md" : "border-border"
      )}>
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
            "min-h-[24px] max-h-[150px] focus:outline-none",
            isLoading && "opacity-50"
          )}
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 press-effect",
            value.trim() && !isLoading
              ? "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:shadow-lg hover:scale-105"
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
      <p className="text-xs text-center text-muted-foreground mt-2 opacity-70">
        MindFlow is here to support you. Press Enter to send.
      </p>
    </form>
  );
}

export default ChatInput;
