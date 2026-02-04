import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getMoodColor(mood: string): string {
  const colors: Record<string, string> = {
    great: "var(--mood-great)",
    good: "var(--mood-good)",
    okay: "var(--mood-okay)",
    bad: "var(--mood-bad)",
    terrible: "var(--mood-terrible)",
  };
  return colors[mood] || "var(--muted-foreground)";
}

export function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    great: "😊",
    good: "🙂",
    okay: "😐",
    bad: "😔",
    terrible: "😢",
  };
  return emojis[mood] || "😐";
}

export function getMoodValue(mood: string): number {
  const values: Record<string, number> = {
    great: 5,
    good: 4,
    okay: 3,
    bad: 2,
    terrible: 1,
  };
  return values[mood] || 3;
}

export function getRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}
