# MindFlow - AI Mental Health Journal

> Track your mood, understand your patterns, get AI-powered insights.

MindFlow is an AI-powered mental health companion built for the **WeMakeDevs x Tambo Hackathon**. It helps users track their mood, practice mindfulness through guided breathing exercises, journal their thoughts, and gain insights into their emotional patterns.

## Features

### Interactive Components (Persist Across Messages)

- **Mood Entry**: Log your current mood with emotions, triggers, and personal notes
- **Journal Entry**: Write and save personal reflections with tags and mood associations
- **Breathing Exercise**: Guided breathing with 4-7-8, Box Breathing, and Deep Breathing modes
- **Gratitude List**: Track daily gratitudes with goal tracking

### Generative Components (AI-Rendered)

- **Mood Chart**: Visualize mood trends over time with interactive area charts
- **Insight Card**: AI-generated observations about emotional patterns
- **Quick Actions**: Contextual action suggestions for wellness activities
- **Coping Tips**: Personalized coping strategies based on current mood
- **Weekly Summary**: Comprehensive weekly mood and journal recaps

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS v4
- **AI**: Tambo AI SDK for Generative UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Tambo API Key (get one at [tambo.co](https://tambo.co))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sanjay-Balam/tambo-hackathon.git
cd mindflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage Examples

Try these prompts in the chat:

- "I'm feeling anxious today because of work" - Logs your mood with the MoodEntry component
- "Show my mood this week" - Displays a MoodChart with your trends
- "I need a breathing exercise" - Opens an interactive BreathingExercise
- "What patterns do you see?" - Shows an InsightCard with AI analysis
- "I want to write about my day" - Opens the JournalEntry for reflection
- "Help me practice gratitude" - Shows the GratitudeList component

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── chat/page.tsx     # Main chat interface
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Calming color palette
├── components/
│   ├── generative/       # AI-rendered components
│   │   ├── mood-chart.tsx
│   │   ├── insight-card.tsx
│   │   ├── quick-actions.tsx
│   │   ├── coping-tips.tsx
│   │   └── weekly-summary.tsx
│   ├── interactable/     # User-interactive components
│   │   ├── mood-entry.tsx
│   │   ├── journal-entry.tsx
│   │   ├── breathing-exercise.tsx
│   │   └── gratitude-list.tsx
│   └── tambo/            # Chat UI components
│       ├── thread-view.tsx
│       ├── message-renderer.tsx
│       └── chat-input.tsx
└── lib/
    ├── tambo.ts          # Component registration
    ├── schemas.ts        # Zod schemas
    └── utils.ts          # Utility functions
```

## Color Palette

MindFlow uses a calming color scheme designed for mental wellness:

- **Primary**: Indigo (#6366f1) - Trust and calm
- **Accent**: Teal (#14b8a6) - Wellness and growth
- **Mood Colors**:
  - Great: Green (#22c55e)
  - Good: Lime (#84cc16)
  - Okay: Yellow (#eab308)
  - Bad: Orange (#f97316)
  - Terrible: Red (#ef4444)

## Hackathon Info

- **Hackathon**: The UI Strikes Back (WeMakeDevs x Tambo)
- **Duration**: Feb 2-8, 2026
- **Participant**: Sanjay Balam (Solo)

## Why MindFlow?

Mental health affects everyone, yet tracking and understanding our emotions is often overlooked. MindFlow provides:

1. **Impact**: Addresses a universal need for mental wellness support
2. **Creativity**: Interactive breathing exercises, not just chat
3. **Technical**: 4+ interactable components, charts, AI tools
4. **UX**: Calming design with smooth animations
5. **Best Use of Tambo**: Full utilization of Generative UI features

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

MIT

## Acknowledgments

- Built with [Tambo AI](https://tambo.co) - Generative UI Framework
- Icons from [Lucide](https://lucide.dev)
- Charts powered by [Recharts](https://recharts.org)
