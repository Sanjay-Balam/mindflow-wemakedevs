"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Aurora gradient layers */}
      <div className="aurora-container absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="aurora-layer aurora-layer-1" />
        {/* Secondary moving gradient */}
        <div className="aurora-layer aurora-layer-2" />
        {/* Tertiary accent gradient */}
        <div className="aurora-layer aurora-layer-3" />
        {/* Noise texture overlay */}
        <div className="aurora-noise" />
      </div>
      {children}
    </div>
  );
}
