"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  gradient?: boolean;
}

export function AnimatedText({ text, className, delay = 0, gradient = false }: AnimatedTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={cn(
            "mr-2",
            gradient && "text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
          )}
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface FadeUpTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUpText({ children, className, delay = 0 }: FadeUpTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <span
      className={cn(
        "text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent",
        animate && "animate-gradient-text bg-[length:200%_auto]",
        className
      )}
    >
      {children}
    </span>
  );
}
