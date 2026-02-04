"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const moods = [
  { label: "Great", emoji: "😄", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.2)" },
  { label: "Good", emoji: "🙂", color: "#84cc16", bgColor: "rgba(132, 204, 22, 0.2)" },
  { label: "Okay", emoji: "😐", color: "#eab308", bgColor: "rgba(234, 179, 8, 0.2)" },
  { label: "Bad", emoji: "😔", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.2)" },
  { label: "Terrible", emoji: "😢", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.2)" },
];

interface MoodOrbsProps {
  className?: string;
}

export function MoodOrbs({ className }: MoodOrbsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const radius = 130; // orbit radius

  return (
    <div className={cn("relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]", className)}>
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          {hoveredIndex !== null ? (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <span className="text-4xl md:text-5xl">{moods[hoveredIndex].emoji}</span>
              <p
                className="text-lg md:text-xl font-semibold mt-2"
                style={{ color: moods[hoveredIndex].color }}
              >
                {moods[hoveredIndex].label}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-sm md:text-base text-center px-4"
            >
              Hover to explore moods
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Orbiting container */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Mood orbs positioned in a circle */}
        {moods.map((mood, index) => {
          const angle = (index * 72 - 90) * (Math.PI / 180); // 72 degrees apart, starting from top
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={mood.label}
              className="absolute cursor-pointer"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: x - 30, // Center the 60px orb
                marginTop: y - 30,
              }}
              animate={{ rotate: -360 }} // Counter-rotate to keep emoji upright
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.2 }}
            >
              <motion.div
                className="flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: mood.bgColor,
                  border: `2px solid ${mood.color}`,
                  boxShadow: hoveredIndex === index
                    ? `0 0 20px ${mood.color}, 0 0 40px ${mood.bgColor}`
                    : `0 0 10px ${mood.bgColor}`,
                }}
              >
                <span className="text-2xl">{mood.emoji}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
