"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GlowingButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  breathing?: boolean;
}

export function GlowingButton({
  children,
  href,
  onClick,
  className,
  variant = "primary",
  size = "default",
  breathing = false,
}: GlowingButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all",
    size === "default" ? "px-6 py-3 text-base" : "px-8 py-4 text-lg",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary-dark"
      : "bg-card border border-border text-card-foreground hover:bg-muted",
    className
  );

  const glowStyles = variant === "primary"
    ? "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
    : "";

  const content = (
    <motion.span
      className={cn(baseStyles, glowStyles, "overflow-hidden")}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={breathing ? {
        boxShadow: [
          "0 0 20px rgba(99, 102, 241, 0.3)",
          "0 0 30px rgba(99, 102, 241, 0.5)",
          "0 0 20px rgba(99, 102, 241, 0.3)",
        ],
      } : {}}
      transition={breathing ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      } : {}}
    >
      {/* Shimmer effect */}
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button">
      {content}
    </button>
  );
}
