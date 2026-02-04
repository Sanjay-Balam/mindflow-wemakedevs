# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project: MindFlow - AI Mental Health Journal

MindFlow is a mental health companion app built with Tambo AI for the WeMakeDevs x Tambo Hackathon.

## Essential Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture Overview

### Tech Stack
- Next.js 15 with App Router
- React 19 with TypeScript
- Tambo AI SDK for Generative UI
- Tailwind CSS v4
- Recharts for visualizations
- Zod for schema validation

### Key Patterns

1. **Component Registration System**
   - All AI-renderable components are registered in `src/lib/tambo.ts`
   - Each component has a Zod schema for props validation
   - Components are either "generative" (AI-controlled) or "interactable" (user-interactive)

2. **Interactable Components**
   - Use `useTamboComponentState` for state persistence across chat messages
   - Located in `src/components/interactable/`
   - Include: MoodEntry, JournalEntry, BreathingExercise, GratitudeList

3. **Generative Components**
   - Rendered by AI based on context
   - Located in `src/components/generative/`
   - Include: MoodChart, InsightCard, QuickActions, CopingTips, WeeklySummary

### File Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── chat/page.tsx     # Main chat interface with TamboProvider
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Calming color palette
├── components/
│   ├── generative/       # AI-rendered components
│   ├── interactable/     # User-interactive components
│   └── tambo/            # Chat UI components
└── lib/
    ├── tambo.ts          # Component registration & system prompt
    ├── schemas.ts        # Zod schemas
    └── utils.ts          # Utility functions
```

## Working on This Codebase

### Adding New Components

1. Define the Zod schema in `src/lib/schemas.ts`
2. Create the component in the appropriate folder
3. Register it in `src/lib/tambo.ts` with a detailed description

### Key Tambo Hooks

- `useTamboComponentState`: Persist component state across messages
- `useTamboThreadInput`: Access and control chat input
- `useTamboThread`: Access thread messages and loading state

### Styling Guidelines

- Use the calming color palette defined in `globals.css`
- Mood colors: great (green), good (lime), okay (yellow), bad (orange), terrible (red)
- All components support dark mode via CSS variables

## Environment Variables

```
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key
```
