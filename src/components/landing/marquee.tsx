"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

export function Marquee({
  items,
  className,
  speed = 30,
  pauseOnHover = true,
  reverse = false
}: MarqueeProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <div
        className={cn(
          "flex gap-4",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-6 py-3 rounded-full bg-card border border-border text-card-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default whitespace-nowrap"
          >
            &ldquo;{item}&rdquo;
          </div>
        ))}
      </div>
    </div>
  );
}
