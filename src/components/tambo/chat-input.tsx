"use client";

import React, { useRef, useEffect } from "react";
import { useTamboThreadInput, useTamboVoice } from "@tambo-ai/react";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  isLoading?: boolean;
  onSubmit?: () => void;
}

export function ChatInput({ isLoading = false, onSubmit }: ChatInputProps) {
  const { value, setValue, submit } = useTamboThreadInput();
  const { startRecording, stopRecording, isRecording, isTranscribing, transcript, mediaAccessError } = useTamboVoice();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pipe transcript into input when available
  useEffect(() => {
    if (transcript) {
      setValue((prev: string) => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript, setValue]);

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

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
        "flex items-center gap-2 p-4 bg-card border rounded-2xl shadow-sm transition-all duration-200",
        value.trim() ? "border-primary/30 shadow-md" : "border-border",
        isRecording && "border-red-400/50 shadow-red-500/10 shadow-md"
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : isTranscribing ? "Transcribing..." : "How are you feeling today?"}
          rows={1}
          disabled={isLoading || isRecording}
          className={cn(
            "flex-1 resize-none bg-transparent border-0 outline-none text-card-foreground placeholder:text-muted-foreground",
            "min-h-[24px] max-h-[150px]",
            isLoading && "opacity-50"
          )}
        />

        {/* Voice button */}
        <button
          type="button"
          onClick={handleVoiceClick}
          disabled={isLoading || isTranscribing}
          title={mediaAccessError || (isRecording ? "Stop recording" : isTranscribing ? "Transcribing..." : "Voice input")}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200",
            isRecording
              ? "bg-red-500 text-white animate-pulse hover:bg-red-600 cursor-pointer"
              : isTranscribing
              ? "bg-muted text-muted-foreground cursor-wait"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-card-foreground cursor-pointer",
            (isLoading || isTranscribing) && "cursor-not-allowed opacity-50"
          )}
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 press-effect",
            value.trim() && !isLoading
              ? "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:shadow-lg hover:scale-105 cursor-pointer"
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
        MindFlow is here to support you. Press Enter to send, or use the mic for voice input.
      </p>
    </form>
  );
}

export default ChatInput;
