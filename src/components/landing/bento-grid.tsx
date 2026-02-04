"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, BarChart3, Wind, BookOpen, Sparkles, Brain } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Log your daily mood with emotions, triggers, and personal notes. Understand what affects how you feel.",
    color: "text-pink-500",
    gradient: "from-pink-500/20 to-rose-500/20",
    glowColor: "rgba(236, 72, 153, 0.3)",
    size: "col-span-2 row-span-2",
  },
  {
    icon: BarChart3,
    title: "Trend Charts",
    description: "See your mood patterns over time with beautiful visualizations.",
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
    glowColor: "rgba(59, 130, 246, 0.3)",
    size: "col-span-1 row-span-1",
  },
  {
    icon: Wind,
    title: "Breathing Exercises",
    description: "Guided 4-7-8 and box breathing to help you relax.",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 to-teal-500/20",
    glowColor: "rgba(6, 182, 212, 0.3)",
    size: "col-span-1 row-span-1",
  },
  {
    icon: BookOpen,
    title: "Journaling",
    description: "Write and reflect in a safe space.",
    color: "text-green-500",
    gradient: "from-green-500/20 to-emerald-500/20",
    glowColor: "rgba(34, 197, 94, 0.3)",
    size: "col-span-1 row-span-1",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get personalized insights about your emotional patterns.",
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-orange-500/20",
    glowColor: "rgba(245, 158, 11, 0.3)",
    size: "col-span-1 row-span-1",
  },
  {
    icon: Brain,
    title: "Coping Strategies",
    description: "Receive contextual coping tips based on how you're feeling. Physical, mental, and creative options tailored to your needs.",
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-violet-500/20",
    glowColor: "rgba(168, 85, 247, 0.3)",
    size: "col-span-2 row-span-1",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface BentoGridProps {
  className?: string;
}

export function BentoGrid({ className }: BentoGridProps) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            className={cn(
              "group relative p-6 rounded-2xl bg-card border border-border overflow-hidden",
              feature.size
            )}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* Gradient background on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                feature.gradient
              )}
            />

            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{
                background: `radial-gradient(circle at center, ${feature.glowColor} 0%, transparent 70%)`
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className={cn(
                "p-3 rounded-xl w-fit mb-4 bg-background/50 backdrop-blur-sm",
                feature.color
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>

            {/* Corner glow */}
            <div
              className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-2xl"
              style={{ backgroundColor: feature.glowColor }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
