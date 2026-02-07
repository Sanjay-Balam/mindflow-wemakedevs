import { z } from "zod";
import type { TamboTool } from "@tambo-ai/react";

// ===== TOOL: Get Mood History =====
const getMoodHistoryInputSchema = z.object({
  days: z.number().optional().describe("Number of days to fetch mood history for (default: 7)"),
});

// Mood value mapping for chart
const MOOD_VALUES: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  terrible: 1,
};

const getMoodHistoryOutputSchema = z.object({
  success: z.boolean(),
  count: z.number().optional(),
  summary: z.string().optional(),
  chartData: z.array(z.object({
    date: z.string(),
    mood: z.number(),
    label: z.string(),
  })).optional(),
  error: z.string().optional(),
});

const getMoodHistoryTool: TamboTool<
  z.infer<typeof getMoodHistoryInputSchema>,
  z.infer<typeof getMoodHistoryOutputSchema>
> = {
  name: "getMoodHistory",
  description: `Fetch the user's mood history from the database.

WHEN TO USE:
- User asks "What's my mood history?" or "How have I been feeling?"
- User wants to see past mood entries
- Before showing a MoodChart component
- When analyzing patterns

RETURNS:
- summary: Text description of mood entries
- chartData: Array ready for MoodChart component with {date, mood (1-5), label}
- count: Number of entries found`,
  tool: async ({ days: inputDays }) => {
    const days = inputDays ?? 7;
    try {
      const response = await fetch(`/api/moods?days=${days}`);
      const data = await response.json();

      if (data.moods && data.moods.length > 0) {
        const summary = data.moods
          .map(
            (m: { mood: string; timestamp: string; note?: string }) =>
              `${new Date(m.timestamp).toLocaleDateString()}: ${m.mood}${m.note ? ` - "${m.note}"` : ""}`
          )
          .join("\n");

        // Convert to chart-ready format
        const chartData = data.moods.map((m: { mood: string; timestamp: string }) => ({
          date: new Date(m.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          mood: MOOD_VALUES[m.mood] || 3,
          label: m.mood,
        })).reverse(); // Oldest first for chart

        return {
          success: true,
          count: data.moods.length,
          summary,
          chartData,
        };
      }

      return {
        success: true,
        count: 0,
        summary: "No mood entries found for this period.",
        chartData: [],
      };
    } catch {
      return {
        success: false,
        error: "Failed to fetch mood history",
      };
    }
  },
  inputSchema: getMoodHistoryInputSchema,
  outputSchema: getMoodHistoryOutputSchema,
};

// ===== TOOL: Set Mood Reminder =====
const setMoodReminderInputSchema = z.object({
  hours: z.number().optional().describe("Hours from now to remind (default: 4)"),
  message: z.string().optional().describe("Reminder message (default: 'Time to check in with yourself!')"),
});

const setMoodReminderOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  scheduledFor: z.string().optional(),
  error: z.string().optional(),
});

const setMoodReminderTool: TamboTool<
  z.infer<typeof setMoodReminderInputSchema>,
  z.infer<typeof setMoodReminderOutputSchema>
> = {
  name: "setMoodReminder",
  description: `Set a browser notification to remind the user to check in with their mood later.

WHEN TO USE:
- User says "Remind me to log my mood later"
- User wants to be prompted to check in
- After a therapy session or important event
- When user mentions they want to build a habit

RETURNS: Confirmation of reminder set with scheduled time.`,
  tool: async ({ hours: inputHours, message: inputMessage }) => {
    const hours = inputHours ?? 4;
    const message = inputMessage ?? "Time to check in with yourself!";
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const ms = hours * 60 * 60 * 1000;
          setTimeout(() => {
            new Notification("MindFlow Reminder", {
              body: message,
              icon: "/favicon.ico",
            });
          }, ms);

          return {
            success: true,
            message: `Reminder set for ${hours} hour${hours > 1 ? "s" : ""} from now: "${message}"`,
            scheduledFor: new Date(Date.now() + ms).toLocaleTimeString(),
          };
        } else {
          return {
            success: false,
            error: "Notification permission denied. Please enable notifications in your browser settings.",
          };
        }
      }

      return {
        success: false,
        error: "Notifications not supported in this browser",
      };
    } catch {
      return {
        success: false,
        error: "Failed to set reminder",
      };
    }
  },
  inputSchema: setMoodReminderInputSchema,
  outputSchema: setMoodReminderOutputSchema,
};

// ===== TOOL: Play Relaxing Sound =====
const playRelaxingSoundInputSchema = z.object({
  sound: z.enum(["rain", "ocean", "forest", "whitenoise"]).optional().describe("Type of ambient sound (default: rain)"),
  duration: z.number().optional().describe("Duration in seconds (default: 60)"),
});

const playRelaxingSoundOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  sound: z.string().optional(),
  duration: z.number().optional(),
  error: z.string().optional(),
});

const playRelaxingSoundTool: TamboTool<
  z.infer<typeof playRelaxingSoundInputSchema>,
  z.infer<typeof playRelaxingSoundOutputSchema>
> = {
  name: "playRelaxingSound",
  description: `Play ambient relaxing sounds to help the user relax or focus.

WHEN TO USE:
- User asks for "relaxing sounds" or "ambient music"
- During or before a breathing exercise
- User is stressed and wants background sounds
- User mentions needing to focus or sleep

SOUNDS AVAILABLE: rain, ocean, forest, whitenoise

RETURNS: Confirmation that sound is playing.`,
  tool: async ({ sound: inputSound, duration: inputDuration }) => {
    const sound = inputSound ?? "rain";
    const duration = inputDuration ?? 60;
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot play audio on server" };
      }

      const soundUrls: Record<string, string> = {
        rain: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
        ocean: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
        forest: "https://assets.mixkit.co/active_storage/sfx/2518/2518-preview.mp3",
        whitenoise: "https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3",
      };

      const url = soundUrls[sound] || soundUrls.rain;
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.5;
      await audio.play();

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, duration * 1000);

      return {
        success: true,
        message: `Playing ${sound} sounds for ${duration} seconds. The sound will stop automatically.`,
        sound,
        duration,
      };
    } catch {
      return {
        success: false,
        error: "Failed to play sound. Your browser may have blocked autoplay.",
      };
    }
  },
  inputSchema: playRelaxingSoundInputSchema,
  outputSchema: playRelaxingSoundOutputSchema,
};

// ===== TOOL: Export Mood Report =====
const exportMoodReportInputSchema = z.object({
  format: z.enum(["text", "json"]).optional().describe("Export format (default: text)"),
  days: z.number().optional().describe("Number of days to include (default: 7)"),
});

const exportMoodReportOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  filename: z.string().optional(),
  entries: z.number().optional(),
  error: z.string().optional(),
});

const exportMoodReportTool: TamboTool<
  z.infer<typeof exportMoodReportInputSchema>,
  z.infer<typeof exportMoodReportOutputSchema>
> = {
  name: "exportMoodReport",
  description: `Export the user's mood data as a downloadable file.

WHEN TO USE:
- User asks to "export my moods" or "download my data"
- User wants to share their progress with a therapist
- User asks for a report of their mental health journey

FORMATS: text (readable report) or json (raw data)

RETURNS: Downloads a file to the user's device.`,
  tool: async ({ format: inputFormat, days: inputDays }) => {
    const format = inputFormat ?? "text";
    const days = inputDays ?? 7;
    try {
      if (typeof window === "undefined") {
        return { success: false, error: "Cannot download on server" };
      }

      const response = await fetch(`/api/moods?days=${days}`);
      const data = await response.json();

      if (!data.moods || data.moods.length === 0) {
        return { success: false, error: "No mood data to export" };
      }

      let exportData: string;
      let filename: string;

      if (format === "json") {
        exportData = JSON.stringify(data.moods, null, 2);
        filename = `mindflow-moods-${new Date().toISOString().split("T")[0]}.json`;
      } else {
        const lines = [
          "MindFlow Mood Report",
          `Generated: ${new Date().toLocaleString()}`,
          `Period: Last ${days} days`,
          `Total Entries: ${data.moods.length}`,
          "",
          "---",
          "",
        ];

        data.moods.forEach(
          (m: {
            mood: string;
            emotions?: string[];
            triggers?: string[];
            note?: string;
            timestamp: string;
          }) => {
            lines.push(`Date: ${new Date(m.timestamp).toLocaleString()}`);
            lines.push(`Mood: ${m.mood}`);
            if (m.emotions?.length) lines.push(`Emotions: ${m.emotions.join(", ")}`);
            if (m.triggers?.length) lines.push(`Triggers: ${m.triggers.join(", ")}`);
            if (m.note) lines.push(`Note: ${m.note}`);
            lines.push("");
          }
        );

        exportData = lines.join("\n");
        filename = `mindflow-moods-${new Date().toISOString().split("T")[0]}.txt`;
      }

      const blob = new Blob([exportData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: `Exported ${data.moods.length} mood entries to ${filename}`,
        filename,
        entries: data.moods.length,
      };
    } catch {
      return { success: false, error: "Failed to export mood report" };
    }
  },
  inputSchema: exportMoodReportInputSchema,
  outputSchema: exportMoodReportOutputSchema,
};

// ===== TOOL: Get Weather Mood Correlation =====
const getWeatherInputSchema = z.object({
  location: z.string().optional().describe("City name for weather (optional)"),
});

const getWeatherOutputSchema = z.object({
  success: z.boolean(),
  weather: z
    .object({
      temperature: z.string(),
      condition: z.string(),
      humidity: z.string(),
      location: z.string(),
    })
    .optional(),
  moodAverage: z.string().optional(),
  insight: z.string().optional(),
  error: z.string().optional(),
});

const getWeatherMoodCorrelationTool: TamboTool<
  z.infer<typeof getWeatherInputSchema>,
  z.infer<typeof getWeatherOutputSchema>
> = {
  name: "getWeatherMoodCorrelation",
  description: `Get current weather and correlate it with the user's recent mood patterns.

WHEN TO USE:
- User asks "Does weather affect my mood?"
- User mentions weather impacting how they feel
- User is curious about external factors affecting mood
- When providing insights about mood patterns

RETURNS: Current weather, average mood, and correlation insights.`,
  tool: async ({ location }) => {
    try {
      const city = location || "auto";
      const weatherResponse = await fetch(`https://wttr.in/${city}?format=j1`);
      const weather = await weatherResponse.json();

      const current = weather.current_condition[0];
      const temp = current.temp_C;
      const condition = current.weatherDesc[0].value;
      const humidity = current.humidity;

      const moodsResponse = await fetch("/api/moods?days=7");
      const moodsData = await moodsResponse.json();

      let insight = "";
      const avgMood =
        moodsData.moods?.length > 0
          ? moodsData.moods.reduce((sum: number, m: { mood: string }) => {
              const moodValues: Record<string, number> = {
                great: 5,
                good: 4,
                okay: 3,
                bad: 2,
                terrible: 1,
              };
              return sum + (moodValues[m.mood] || 3);
            }, 0) / moodsData.moods.length
          : null;

      if (avgMood !== null) {
        if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("cloud")) {
          insight =
            avgMood < 3
              ? "The gloomy weather might be affecting your mood. Consider some indoor activities that bring you joy!"
              : "Despite the cloudy weather, you've been maintaining a positive mood. Great resilience!";
        } else if (condition.toLowerCase().includes("sun") || condition.toLowerCase().includes("clear")) {
          insight = "Sunny weather can boost serotonin levels. Consider going outside for a short walk!";
        }
      }

      return {
        success: true,
        weather: {
          temperature: `${temp}°C`,
          condition,
          humidity: `${humidity}%`,
          location: weather.nearest_area[0].areaName[0].value,
        },
        moodAverage: avgMood ? avgMood.toFixed(1) : "No data",
        insight: insight || "Track more moods to see weather correlations!",
      };
    } catch {
      return {
        success: false,
        error: "Failed to fetch weather data. Please try again later.",
      };
    }
  },
  inputSchema: getWeatherInputSchema,
  outputSchema: getWeatherOutputSchema,
};

// ===== TOOL: Crisis Resource Detection =====
const getCrisisResourcesInputSchema = z.object({
  context: z.string().describe("The user message or context to assess for crisis signals"),
});

const getCrisisResourcesOutputSchema = z.object({
  success: z.boolean(),
  isCrisis: z.boolean(),
  resources: z.array(z.object({
    name: z.string(),
    contact: z.string(),
    description: z.string(),
  })).optional(),
  message: z.string().optional(),
});

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end it all", "self-harm", "hurt myself",
  "don't want to live", "no reason to live", "better off without me",
  "want to die", "end my life", "not worth living", "take my own life",
];

const CRISIS_RESOURCES = [
  {
    name: "National Suicide Prevention Lifeline",
    contact: "988 (call or text)",
    description: "Free, confidential 24/7 support for people in distress.",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "Free 24/7 text-based crisis support.",
  },
  {
    name: "International Association for Suicide Prevention",
    contact: "https://www.iasp.info/resources/Crisis_Centres/",
    description: "Find crisis centers worldwide.",
  },
];

const getCrisisResourcesTool: TamboTool<
  z.infer<typeof getCrisisResourcesInputSchema>,
  z.infer<typeof getCrisisResourcesOutputSchema>
> = {
  name: "getCrisisResources",
  description: `Assess user messages for crisis signals and return safety resources if needed.

WHEN TO USE:
- User expresses thoughts of self-harm or suicide
- User mentions wanting to die or not wanting to live
- User expresses severe hopelessness or despair
- Any message containing crisis-related language

IMPORTANT: Always err on the side of caution. If in doubt, call this tool.

RETURNS:
- isCrisis: Whether crisis signals were detected
- resources: Array of crisis hotlines and resources (if crisis detected)
- message: Supportive message`,
  tool: async ({ context }) => {
    const lowerContext = context.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((keyword) => lowerContext.includes(keyword));

    if (isCrisis) {
      return {
        success: true,
        isCrisis: true,
        resources: CRISIS_RESOURCES,
        message: "I hear you, and I want you to know that you matter. Please reach out to one of these resources — trained professionals are available 24/7 to help.",
      };
    }

    return {
      success: true,
      isCrisis: false,
      message: "No immediate crisis signals detected. Continue providing empathetic support.",
    };
  },
  inputSchema: getCrisisResourcesInputSchema,
  outputSchema: getCrisisResourcesOutputSchema,
};

// Export all tools
export const tools: TamboTool[] = [
  getMoodHistoryTool,
  setMoodReminderTool,
  playRelaxingSoundTool,
  exportMoodReportTool,
  getWeatherMoodCorrelationTool,
  getCrisisResourcesTool,
];
