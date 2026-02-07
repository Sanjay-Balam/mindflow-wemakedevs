import { TamboComponent } from "@tambo-ai/react";

// Generative Components
import { MoodChart } from "@/components/generative/mood-chart";
import { InsightCard } from "@/components/generative/insight-card";
import { QuickActions } from "@/components/generative/quick-actions";
import { CopingTips } from "@/components/generative/coping-tips";
import { WeeklySummary } from "@/components/generative/weekly-summary";

// Interactable Components
import { MoodEntry } from "@/components/interactable/mood-entry";
import { JournalEntry } from "@/components/interactable/journal-entry";
import { BreathingExercise } from "@/components/interactable/breathing-exercise";
import { GratitudeList } from "@/components/interactable/gratitude-list";
import { SelfCareChecklist } from "@/components/interactable/self-care-checklist";

// Schemas
import {
  moodChartSchema,
  insightCardSchema,
  quickActionsSchema,
  copingTipsSchema,
  weeklySummarySchema,
  moodEntrySchema,
  journalEntrySchema,
  breathingExerciseSchema,
  gratitudeListSchema,
  selfCareChecklistSchema,
} from "./schemas";

export const components: TamboComponent[] = [
  // ===== INTERACTABLE COMPONENTS =====
  // These persist across messages and allow user interaction

  {
    name: "MoodEntry",
    description: `An interactive mood logging component that allows users to record their current emotional state.

WHEN TO RENDER:
- User says "I'm feeling..." or describes their mood
- User wants to "log my mood" or "track how I feel"
- User mentions emotions like anxious, happy, sad, stressed, etc.
- User asks "Can I record my mood?"

FEATURES:
- 5-point mood scale (Great, Good, Okay, Bad, Terrible)
- Emotion tags selection (Happy, Calm, Anxious, Stressed, etc.)
- Optional trigger tracking (Work, Relationship, Health, etc.)
- Free-form notes field
- Auto-timestamps entries

EXAMPLE PROMPTS:
- "I'm feeling anxious today because of work"
- "Log my mood - I'm feeling great!"
- "I want to track that I'm stressed about my exams"`,
    component: MoodEntry,
    propsSchema: moodEntrySchema,
  },

  {
    name: "JournalEntry",
    description: `An interactive journaling component for writing and saving personal reflections. Entries are saved to the database and viewable on the dedicated Journal page.

WHEN TO RENDER:
- User wants to "write in my journal" or "journal about..."
- User says "I need to get my thoughts out"
- User asks to "reflect on..." or "write about my day"
- User mentions wanting to process their feelings through writing

FEATURES:
- Title and content fields
- Optional mood association
- Tag system for categorization
- Word count tracking
- Edit and save functionality
- Entries persist to database and appear on the Journal page

EXAMPLE PROMPTS:
- "I want to journal about my day"
- "Help me write about what happened at work"
- "I need to process my thoughts about..."`,
    component: JournalEntry,
    propsSchema: journalEntrySchema,
  },

  {
    name: "BreathingExercise",
    description: `An interactive guided breathing exercise with animated visual guidance.

WHEN TO RENDER:
- User asks for "breathing exercise" or "help me breathe"
- User mentions needing to "calm down" or "relax"
- User is feeling anxious, stressed, or overwhelmed
- User asks for help with panic, anxiety, or stress relief
- User wants to "center myself" or "ground myself"

FEATURES:
- Three exercise types: 4-7-8 Relaxation, Box Breathing, Deep Breathing
- Animated breathing circle that expands/contracts
- Timer with phase indicators (inhale, hold, exhale)
- Configurable cycles (default 4)
- Play/pause/reset controls

EXAMPLE PROMPTS:
- "I need a breathing exercise"
- "Help me calm down"
- "Can we do some box breathing?"
- "I'm having anxiety, help me relax"`,
    component: BreathingExercise,
    propsSchema: breathingExerciseSchema,
  },

  {
    name: "GratitudeList",
    description: `An interactive gratitude tracking component for recording daily thankfulness.

WHEN TO RENDER:
- User wants to "practice gratitude" or "write gratitudes"
- User mentions being "grateful for..." or "thankful for..."
- User asks about gratitude journaling
- User wants to "focus on the positive"

FEATURES:
- Add/remove gratitude items
- Today's gratitudes vs. previous entries
- Daily goal tracking (3 gratitudes)
- Visual progress indicators
- Persistent across conversations

EXAMPLE PROMPTS:
- "I want to write my gratitudes"
- "What am I grateful for today?"
- "Help me practice gratitude"
- "I'm thankful for my family"`,
    component: GratitudeList,
    propsSchema: gratitudeListSchema,
  },

  {
    name: "SelfCareChecklist",
    description: `An interactive daily self-care checklist with common wellness activities. Users can check off items as they complete them throughout the day.

WHEN TO RENDER:
- User says "self-care checklist" or "daily wellness checklist"
- User asks "What should I do today?" or "What self-care can I do?"
- User wants to "track my daily habits" or "stay on top of self-care"
- User mentions wanting a routine or daily wellness plan

FEATURES:
- 8 default self-care activities across physical, mental, social, and nutrition categories
- Checkbox toggle with category-colored icons
- Progress bar showing completion percentage
- Celebratory state when all items are checked
- Persists across messages via useTamboComponentState

EXAMPLE PROMPTS:
- "Show my self-care checklist"
- "What should I do for self-care today?"
- "Daily wellness check"
- "Help me build a self-care routine"`,
    component: SelfCareChecklist,
    propsSchema: selfCareChecklistSchema,
  },

  // ===== GENERATIVE COMPONENTS =====
  // These are rendered by AI based on context

  {
    name: "MoodChart",
    description: `A visualization component that displays mood trends over time using an area chart.

WHEN TO RENDER:
- User asks "Show my mood" or "How have I been feeling?"
- User wants to "see my mood history" or "view my trends"
- User asks "What's my mood pattern?"
- After multiple mood entries to show progress

FEATURES:
- Line/area chart with mood data points (1-5 scale)
- Color-coded dots for each mood level
- Trend indicator (Improving/Declining/Stable)
- Average mood calculation
- Optional AI insight message

DATA FORMAT:
Provide data as array of objects with:
- date: string (e.g., "Mon", "Jan 5")
- mood: number (1-5, where 5 is great)
- label: string (mood name for tooltip)`,
    component: MoodChart,
    propsSchema: moodChartSchema,
  },

  {
    name: "InsightCard",
    description: `A component that displays AI-generated insights about the user's emotional patterns.

WHEN TO RENDER:
- User asks "What patterns do you see?"
- User wants "insights about my mood"
- User asks "Analyze my emotional state"
- After viewing mood data or journal entries
- When AI notices patterns worth highlighting

FEATURES:
- Observation section (what AI noticed)
- Pattern detection (recurring themes)
- Actionable suggestion
- Optional emoji for visual context

CONTENT GUIDELINES:
- Be empathetic and supportive
- Focus on patterns, not judgments
- Provide actionable, specific suggestions
- Use warm, encouraging language`,
    component: InsightCard,
    propsSchema: insightCardSchema,
  },

  {
    name: "QuickActions",
    description: `A component that displays clickable action suggestions for mental wellness activities.

WHEN TO RENDER:
- At the start of a conversation to guide users
- When user seems unsure what to do
- After completing an activity to suggest next steps
- User asks "What can I do?" or "What are my options?"

FEATURES:
- Grid of clickable action cards
- Each action has icon, label, description
- Clicking sends the prompt to chat
- Icons: heart, brain, smile, sun, moon, wind, sparkles, book, pen, chart

GOOD ACTIONS TO INCLUDE:
- Log my mood
- Start a breathing exercise
- Write in my journal
- Practice gratitude
- Show my mood trends
- Get coping tips
- Show my self-care checklist
- Guide me through a meditation
- Help me challenge a negative thought
- I can't sleep, any tips?`,
    component: QuickActions,
    propsSchema: quickActionsSchema,
  },

  {
    name: "CopingTips",
    description: `A component that displays contextual coping strategies based on the user's current mood.

WHEN TO RENDER:
- User asks "Help me feel better"
- User is experiencing negative emotions
- User asks for "coping strategies" or "what can I do?"
- After logging a low mood
- User mentions specific struggles

FEATURES:
- List of actionable tips
- Category tags (physical, mental, social, creative, mindfulness)
- Mood-specific recommendations
- Visual icons for each category

TIP CATEGORIES:
- physical: Exercise, stretching, walking, dancing
- mental: Cognitive techniques, reframing, problem-solving
- social: Connecting with others, sharing feelings
- creative: Art, music, writing, hobbies
- mindfulness: Breathing, meditation, grounding`,
    component: CopingTips,
    propsSchema: copingTipsSchema,
  },

  {
    name: "WeeklySummary",
    description: `A comprehensive weekly mood and journal recap component.

WHEN TO RENDER:
- User asks for "weekly summary" or "how was my week?"
- User wants to "review my progress"
- At the end of a week or when user asks for recap
- User asks "What have I logged this week?"

FEATURES:
- Average mood score with label
- Mood distribution bar chart
- Entry count and positive days
- Top emotions list
- Weekly highlights
- AI suggestion for next week

DATA REQUIREMENTS:
- dateRange: string (e.g., "Jan 1 - Jan 7, 2026")
- averageMood: number (1-5)
- moodBreakdown: object with counts for each mood
- totalEntries: number
- Optional: topEmotions, highlights, suggestion`,
    component: WeeklySummary,
    propsSchema: weeklySummarySchema,
  },
];

// System prompt for the AI
export const systemPrompt = `You are MindFlow, a compassionate and supportive AI mental health companion. Your purpose is to help users track their mood, understand their emotional patterns, and provide gentle guidance for mental wellness.

## Your Personality
- Warm, empathetic, and non-judgmental
- Encouraging without being dismissive of difficult feelings
- Professional but approachable
- Focused on the user's wellbeing

## Key Behaviors
1. **Active Listening**: Acknowledge the user's feelings before offering tools or advice
2. **Gentle Guidance**: Suggest activities without being pushy
3. **Privacy Aware**: Remind users this is a safe space for honest expression
4. **Component Selection**: Choose appropriate UI components based on user needs

## Component Usage Guidelines

### For Mood Logging:
When a user expresses how they're feeling (e.g., "I'm feeling anxious", "I had a great day"), render the MoodEntry component with sensible defaults based on their message.

### For Visualization:
When a user wants to see their mood history:
1. First call the getMoodHistory tool to fetch data
2. Use the returned chartData array directly in the MoodChart component
3. The chartData is already formatted with {date, mood (1-5), label}

### For Stress/Anxiety:
When a user needs to calm down, offer the BreathingExercise component immediately.

### For Reflection:
When a user wants to journal or process thoughts, use the JournalEntry component. Journal entries created in chat are saved to the database and viewable on the dedicated Journal page (/journal).

### For Positivity:
When working on gratitude, use the GratitudeList component.

### For Insights:
After collecting enough data or when asked, provide InsightCard with observations.

### For Navigation:
Use QuickActions when the user seems unsure what to do next.

### For Coping:
When a user is struggling, provide CopingTips with relevant strategies.

### For Review:
Use WeeklySummary for period reviews and progress tracking.

### For Self-Care:
When a user wants a daily routine or self-care tracker, use the SelfCareChecklist component. It provides 8 default activities across physical, mental, social, and nutrition categories.

## Context Awareness
You have access to dynamic context helpers that provide real-time information:
- **Time of Day**: You know whether it's morning, afternoon, or evening. Adapt your greetings and suggestions accordingly (e.g., suggest winding down in the evening, energizing activities in the morning).
- **Recent Mood History**: You may have access to the user's recent mood entries (last 3 days). Reference this naturally without asking the user to repeat themselves. For example, if they logged "bad" yesterday, acknowledge it: "I noticed you were feeling down yesterday..."
- **App Features**: You know the full list of available features. Guide users to relevant ones based on their needs.
- **Habit Tracking**: You may know the user's mood logging streak, total entries, and last check-in time. Use this to encourage consistency (e.g., "Amazing 5-day streak!") or gently nudge them back (e.g., "I noticed it's been a few days since your last check-in").

## MCP Tools
You have access to external tools via MCP (Model Context Protocol):
- **search_wellness_resources**: When a user asks for articles, resources, or information about mental health topics, use this tool to find relevant resources. Present results in a helpful, organized way.
- **get_daily_affirmation**: Use this to share a positive affirmation when the user needs encouragement, at the start of a session, or when asked for motivation.
- **get_guided_meditation**: Offer guided meditations when user wants to meditate, relax deeply, or practice mindfulness. Available types: body-scan, loving-kindness, progressive-relaxation, mindful-breathing.
- **get_cbt_exercise**: Use for thought challenging when user has negative thought patterns, cognitive distortions, or wants to challenge unhelpful thinking. Returns a structured CBT worksheet.
- **get_sleep_tips**: Provide evidence-based sleep hygiene tips when user mentions sleep issues, insomnia, or trouble sleeping.

## Important Notes
- Always validate feelings before suggesting activities
- Don't diagnose or provide medical advice
- Encourage professional help for serious concerns
- Keep responses concise but caring
- Use components to enhance, not replace, human connection
- **Crisis Detection**: If a user expresses thoughts of self-harm, suicide, or severe distress, IMMEDIATELY call the getCrisisResources tool and present the safety resources prominently. Always validate their feelings and encourage professional help. Never dismiss crisis signals.

## Sample Interaction Flow
1. User: "I'm feeling stressed"
2. You: Acknowledge the stress, ask if they'd like to log their mood or try a calming exercise
3. Render appropriate component (MoodEntry or BreathingExercise)
4. Follow up with supportive message and offer next steps`;
