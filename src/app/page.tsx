"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  BarChart3,
  Wind,
  BookOpen,
  Brain,
  ArrowRight,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Heart,
    title: "Mood Tracking",
    description:
      "Log your daily mood with emotions, triggers, and personal notes. Understand what affects how you feel.",
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "Trend Visualization",
    description:
      "See your mood patterns over time with beautiful charts. Identify trends and progress.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Wind,
    title: "Breathing Exercises",
    description:
      "Guided breathing exercises like 4-7-8 and box breathing to help you relax and center yourself.",
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    icon: BookOpen,
    title: "Journaling",
    description:
      "Write and reflect on your thoughts in a safe, private space. Process your feelings through words.",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description:
      "Get personalized insights about your emotional patterns and receive supportive suggestions.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Brain,
    title: "Coping Strategies",
    description:
      "Receive contextual coping tips based on how you're feeling. Physical, mental, and creative options.",
    color: "text-purple-500 bg-purple-500/10",
  },
];

const examplePrompts = [
  "I'm feeling anxious about work today",
  "Help me with a breathing exercise",
  "Show my mood this week",
  "I want to write in my journal",
  "What patterns do you see in my mood?",
  "I need some coping strategies",
];

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-card-foreground">
              MindFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Sanjay-Balam/mindflow-wemakedevs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              href="/chat"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Mental Health Journal
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-card-foreground mb-6 leading-tight">
            Track your mood,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              understand your patterns
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            MindFlow is your personal AI companion for mental wellness. Log your
            moods, practice mindfulness, and gain insights into your emotional
            patterns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border text-card-foreground font-semibold text-lg hover:bg-muted transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Everything you need for mental wellness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MindFlow combines mood tracking, journaling, breathing exercises,
              and AI insights into one calming experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "p-6 rounded-2xl bg-card border border-border transition-all duration-300",
                    hoveredFeature === index
                      ? "shadow-lg border-primary/30 scale-[1.02]"
                      : "hover:shadow-md"
                  )}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={cn("p-3 rounded-xl w-fit mb-4", feature.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Example Prompts Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Just talk naturally
            </h2>
            <p className="text-muted-foreground">
              MindFlow understands natural language. Just tell it how you&apos;re
              feeling.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {examplePrompts.map((prompt) => (
              <Link
                key={prompt}
                href="/chat"
                className="px-4 py-2 rounded-full bg-card border border-border text-card-foreground hover:border-primary hover:bg-primary/5 transition-all"
              >
                &ldquo;{prompt}&rdquo;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              How it works
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Share how you're feeling",
                description:
                  "Simply tell MindFlow about your mood. It understands natural language and responds with empathy.",
              },
              {
                step: "2",
                title: "Log and track your mood",
                description:
                  "Use interactive components to record your emotions, triggers, and notes. Everything is saved securely.",
              },
              {
                step: "3",
                title: "Discover patterns and insights",
                description:
                  "View your mood trends over time and receive AI-powered insights about your emotional patterns.",
              },
              {
                step: "4",
                title: "Practice wellness activities",
                description:
                  "Access guided breathing exercises, journaling prompts, and coping strategies whenever you need them.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">
              Ready to start your wellness journey?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              MindFlow is here to support you every step of the way. Your
              feelings matter, and so does your mental health.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              Open MindFlow
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-card-foreground">MindFlow</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Built with{" "}
            <a
              href="https://tambo.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tambo AI
            </a>{" "}
            for the WeMakeDevs x Tambo Hackathon
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Sanjay-Balam/mindflow-wemakedevs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
