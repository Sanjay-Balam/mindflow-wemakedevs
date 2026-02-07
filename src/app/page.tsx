"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { Sparkles, Github, ArrowRight, MessageCircle, Wind, BarChart3, LogIn, LogOut } from "lucide-react";
import {
  AuroraBackground,
  MoodOrbs,
  BentoGrid,
  Marquee,
  FadeUpText,
  GradientText,
  GlowingButton,
} from "@/components/landing";

const examplePrompts = [
  "I'm feeling anxious about work today",
  "Help me with a breathing exercise",
  "Show my mood this week",
  "I want to write in my journal",
  "What patterns do you see in my mood?",
  "I need some coping strategies",
  "I'm grateful for my friends",
  "Help me process my feelings",
];

const howItWorks = [
  {
    step: "1",
    icon: MessageCircle,
    title: "Share how you're feeling",
    description:
      "Simply tell MindFlow about your mood. It understands natural language and responds with empathy.",
  },
  {
    step: "2",
    icon: BarChart3,
    title: "Log and track your mood",
    description:
      "Use interactive components to record your emotions, triggers, and notes. Everything is saved securely.",
  },
  {
    step: "3",
    icon: Sparkles,
    title: "Discover patterns and insights",
    description:
      "View your mood trends over time and receive AI-powered insights about your emotional patterns.",
  },
  {
    step: "4",
    icon: Wind,
    title: "Practice wellness activities",
    description:
      "Access guided breathing exercises, journaling prompts, and coping strategies whenever you need them.",
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-border/50 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-card-foreground">
              MindFlow
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://github.com/Sanjay-Balam/mindflow-wemakedevs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            {session?.user ? (
              <>
                <Link
                  href="/chat"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
                >
                  Open App
                </Link>
                <div className="relative flex items-center" ref={menuRef}>
                  <button
                    onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    className="cursor-pointer flex items-center justify-center rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        width={34}
                        height={34}
                        className="rounded-full block"
                      />
                    ) : (
                      <div className="w-[34px] h-[34px] rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                        {session.user.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {avatarMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-card border border-border shadow-lg overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium text-card-foreground truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="min-h-screen flex items-center justify-center pt-20">
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <FadeUpText delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Mental Health Journal
              </div>
            </FadeUpText>

            {/* Headline */}
            <FadeUpText delay={0.1}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-card-foreground mb-6 leading-tight">
                Track your mood,
                <br />
                <GradientText>understand your patterns</GradientText>
              </h1>
            </FadeUpText>

            {/* Subheadline */}
            <FadeUpText delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                MindFlow is your personal AI companion for mental wellness. Log your
                moods, practice mindfulness, and gain insights into your emotional
                patterns.
              </p>
            </FadeUpText>

            {/* CTA Buttons */}
            <FadeUpText delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowingButton
                  href={session?.user ? "/chat" : undefined}
                  onClick={session?.user ? undefined : () => signIn("google")}
                  size="large"
                  breathing
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </GlowingButton>
                <GlowingButton href="#features" variant="secondary" size="large">
                  Learn More
                </GlowingButton>
              </div>
            </FadeUpText>

            {/* Floating emojis decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {["😊", "💜", "🧘", "✨", "🌿"].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl md:text-3xl opacity-20"
                  style={{
                    left: `${15 + i * 18}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </AuroraBackground>

      {/* Mood Orbs Demo Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              Express how you feel
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From great to terrible, MindFlow helps you track the full spectrum of your emotions
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MoodOrbs />
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              Everything you need for mental wellness
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MindFlow combines mood tracking, journaling, breathing exercises,
              and AI insights into one calming experience.
            </p>
          </motion.div>

          <BentoGrid />
        </div>
      </section>

      {/* Marquee Section - Example Prompts */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              Just talk naturally
            </h2>
            <p className="text-muted-foreground">
              MindFlow understands natural language. Just tell it how you&apos;re
              feeling.
            </p>
          </motion.div>
        </div>

        <Marquee items={examplePrompts} speed={40} />
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              How it works
            </h2>
          </motion.div>

          <div className="space-y-6">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  className="flex gap-6 items-start p-6 rounded-2xl bg-card border border-border group hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section with Spotlight */}
      <section className="py-20 px-4 spotlight">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-card-foreground mb-4">
              Ready to start your wellness journey?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
              MindFlow is here to support you every step of the way. Your
              feelings matter, and so does your mental health.
            </p>
            <GlowingButton
              href={session?.user ? "/chat" : undefined}
              onClick={session?.user ? undefined : () => signIn("google")}
              size="large"
              breathing
            >
              Open MindFlow
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </div>
        </motion.div>
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
