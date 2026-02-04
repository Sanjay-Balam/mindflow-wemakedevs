import { z } from "zod";

// Mood Entry Schema (Interactable)
export const moodEntrySchema = z.object({
  mood: z.enum(["great", "good", "okay", "bad", "terrible"]).default("okay"),
  emotions: z.array(z.string()).default([]),
  triggers: z.array(z.string()).nullish(),
  note: z.string().nullish(),
  timestamp: z.string().default(() => new Date().toISOString()),
});

export type MoodEntryProps = z.infer<typeof moodEntrySchema>;

// Mood Chart Schema (Generative)
export const moodChartSchema = z.object({
  title: z.string(),
  data: z.array(
    z.object({
      date: z.string(),
      mood: z.number().min(1).max(5),
      label: z.string(),
    })
  ),
  insight: z.string().nullish(),
});

export type MoodChartProps = z.infer<typeof moodChartSchema>;

// Breathing Exercise Schema (Interactable)
export const breathingExerciseSchema = z.object({
  type: z.enum(["4-7-8", "box", "deep"]).default("4-7-8"),
  inhale: z.number().default(4),
  hold: z.number().default(7),
  exhale: z.number().default(8),
  cycles: z.number().default(4),
});

export type BreathingExerciseProps = z.infer<typeof breathingExerciseSchema>;

// Insight Card Schema (Generative)
export const insightCardSchema = z.object({
  title: z.string(),
  observation: z.string(),
  pattern: z.string().nullish(),
  suggestion: z.string(),
  emoji: z.string().nullish(),
});

export type InsightCardProps = z.infer<typeof insightCardSchema>;

// Journal Entry Schema (Interactable)
export const journalEntrySchema = z.object({
  title: z.string().default(""),
  content: z.string().default(""),
  mood: z.enum(["great", "good", "okay", "bad", "terrible"]).nullish(),
  tags: z.array(z.string()).nullish(),
  timestamp: z.string().default(() => new Date().toISOString()),
});

export type JournalEntryProps = z.infer<typeof journalEntrySchema>;

// Gratitude List Schema (Interactable)
export const gratitudeListSchema = z.object({
  title: z.string().default("Today's Gratitudes"),
  items: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        date: z.string(),
      })
    )
    .default([]),
});

export type GratitudeListProps = z.infer<typeof gratitudeListSchema>;

// Quick Actions Schema (Generative)
export const quickActionsSchema = z.object({
  title: z.string().nullish(),
  actions: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      prompt: z.string(),
      icon: z
        .enum([
          "heart",
          "brain",
          "smile",
          "sun",
          "moon",
          "wind",
          "sparkles",
          "book",
          "pen",
          "chart",
        ])
        .nullish(),
    })
  ),
});

export type QuickActionsProps = z.infer<typeof quickActionsSchema>;

// Coping Tips Schema (Generative)
export const copingTipsSchema = z.object({
  title: z.string(),
  mood: z.enum(["great", "good", "okay", "bad", "terrible"]).nullish(),
  tips: z.array(
    z.object({
      id: z.string(),
      tip: z.string(),
      category: z
        .enum(["physical", "mental", "social", "creative", "mindfulness"])
        .nullish(),
    })
  ),
});

export type CopingTipsProps = z.infer<typeof copingTipsSchema>;

// Weekly Summary Schema (Generative)
export const weeklySummarySchema = z.object({
  title: z.string(),
  dateRange: z.string(),
  averageMood: z.number().min(1).max(5),
  moodBreakdown: z.object({
    great: z.number().default(0),
    good: z.number().default(0),
    okay: z.number().default(0),
    bad: z.number().default(0),
    terrible: z.number().default(0),
  }),
  totalEntries: z.number(),
  topEmotions: z.array(z.string()).nullish(),
  highlights: z.array(z.string()).nullish(),
  suggestion: z.string().nullish(),
});

export type WeeklySummaryProps = z.infer<typeof weeklySummarySchema>;
