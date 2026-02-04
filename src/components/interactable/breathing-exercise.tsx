"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { cn } from "@/lib/utils";
import type { BreathingExerciseProps } from "@/lib/schemas";
import { Play, Pause, RotateCcw, Wind, Check } from "lucide-react";

type BreathPhase = "idle" | "inhale" | "hold" | "exhale" | "complete";

const EXERCISE_TYPES = {
  "4-7-8": {
    name: "4-7-8 Relaxation",
    description: "A calming technique to reduce anxiety and help you sleep",
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  box: {
    name: "Box Breathing",
    description: "Equal parts breathing used by Navy SEALs to stay calm",
    inhale: 4,
    hold: 4,
    exhale: 4,
  },
  deep: {
    name: "Deep Breathing",
    description: "Simple deep breaths to center yourself",
    inhale: 5,
    hold: 2,
    exhale: 5,
  },
};

const PHASE_COLORS: Record<BreathPhase, string> = {
  idle: "from-gray-400 to-gray-500",
  inhale: "from-blue-400 to-cyan-500",
  hold: "from-purple-400 to-pink-500",
  exhale: "from-green-400 to-teal-500",
  complete: "from-green-400 to-emerald-500",
};

const PHASE_INSTRUCTIONS: Record<BreathPhase, string> = {
  idle: "Press play to begin",
  inhale: "Breathe in slowly...",
  hold: "Hold your breath...",
  exhale: "Breathe out slowly...",
  complete: "Great job! You completed the exercise.",
};

export function BreathingExercise(props: BreathingExerciseProps) {
  const exerciseType = props.type || "4-7-8";
  const defaultState: BreathingExerciseProps = {
    type: exerciseType,
    inhale: props.inhale || EXERCISE_TYPES[exerciseType].inhale,
    hold: props.hold || EXERCISE_TYPES[exerciseType].hold,
    exhale: props.exhale || EXERCISE_TYPES[exerciseType].exhale,
    cycles: props.cycles || 4,
  };

  const [tamboState, setTamboState] = useTamboComponentState<BreathingExerciseProps>(
    "breathing-exercise",
    defaultState
  );

  // Use tamboState if available, otherwise fall back to defaultState
  const state = tamboState || defaultState;
  const setState = setTamboState;

  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [circleScale, setCircleScale] = useState(1);

  const exerciseInfo = EXERCISE_TYPES[state.type];

  const resetExercise = useCallback(() => {
    setIsPlaying(false);
    setPhase("idle");
    setTimeLeft(0);
    setCurrentCycle(0);
    setCircleScale(1);
  }, []);

  const startExercise = () => {
    setIsPlaying(true);
    setPhase("inhale");
    setTimeLeft(state.inhale);
    setCurrentCycle(1);
  };

  const togglePlay = () => {
    if (phase === "complete") {
      resetExercise();
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
    } else if (phase === "idle") {
      startExercise();
    } else {
      setIsPlaying(true);
    }
  };

  const selectExerciseType = (type: "4-7-8" | "box" | "deep") => {
    if (isPlaying) return;
    const newSettings = EXERCISE_TYPES[type];
    setState({
      ...state,
      type,
      inhale: newSettings.inhale,
      hold: newSettings.hold,
      exhale: newSettings.exhale,
    });
    resetExercise();
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying || phase === "idle" || phase === "complete") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (phase === "inhale") {
            setPhase("hold");
            return state.hold;
          } else if (phase === "hold") {
            setPhase("exhale");
            return state.exhale;
          } else if (phase === "exhale") {
            if (currentCycle >= state.cycles) {
              setPhase("complete");
              setIsPlaying(false);
              return 0;
            }
            setPhase("inhale");
            setCurrentCycle((c) => c + 1);
            return state.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, phase, state, currentCycle]);

  // Circle animation effect
  useEffect(() => {
    if (phase === "inhale") {
      setCircleScale(1.5);
    } else if (phase === "exhale") {
      setCircleScale(1);
    } else if (phase === "complete") {
      setCircleScale(1.2);
    }
  }, [phase]);

  const totalDuration =
    (state.inhale + state.hold + state.exhale) * state.cycles;
  const elapsedCycles = currentCycle - 1;
  const cycleTime = state.inhale + state.hold + state.exhale;
  const elapsedInCycle =
    phase === "inhale"
      ? state.inhale - timeLeft
      : phase === "hold"
      ? state.inhale + (state.hold - timeLeft)
      : phase === "exhale"
      ? state.inhale + state.hold + (state.exhale - timeLeft)
      : 0;
  const totalElapsed = elapsedCycles * cycleTime + elapsedInCycle;
  const progress =
    phase === "complete" ? 100 : (totalElapsed / totalDuration) * 100;

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in-up mindflow-card">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-cyan-500/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-primary/20 animate-pulse-gentle">
            <Wind className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Breathing Exercise
            </h3>
            <p className="text-sm text-muted-foreground">
              {exerciseInfo.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Exercise Type Selection */}
        <div className="flex gap-2">
          {(Object.keys(EXERCISE_TYPES) as Array<keyof typeof EXERCISE_TYPES>).map(
            (type) => (
              <button
                key={type}
                onClick={() => selectExerciseType(type)}
                disabled={isPlaying}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  state.type === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                  isPlaying && "opacity-50 cursor-not-allowed"
                )}
              >
                {EXERCISE_TYPES[type].name}
              </button>
            )
          )}
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            {/* Background circle */}
            <div className="w-48 h-48 rounded-full bg-muted/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Animated breathing circle */}
            <div
              className={cn(
                "w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center transition-all duration-1000 ease-in-out relative",
                PHASE_COLORS[phase]
              )}
              style={{
                transform: `scale(${circleScale})`,
                transitionDuration:
                  phase === "inhale"
                    ? `${state.inhale}s`
                    : phase === "exhale"
                    ? `${state.exhale}s`
                    : "0.5s",
              }}
            >
              <div className="text-center text-white">
                {phase === "complete" ? (
                  <Check className="w-12 h-12 mx-auto" />
                ) : (
                  <>
                    <div className="text-4xl font-bold">
                      {phase === "idle" ? "0" : timeLeft}
                    </div>
                    <div className="text-sm opacity-80 capitalize">{phase}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <p className="mt-6 text-center text-card-foreground font-medium">
            {PHASE_INSTRUCTIONS[phase]}
          </p>

          {/* Cycle indicator */}
          {phase !== "idle" && phase !== "complete" && (
            <p className="text-sm text-muted-foreground mt-2">
              Cycle {currentCycle} of {state.cycles}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="progress-bar">
            <div
              className={cn(
                "progress-bar-fill bg-gradient-to-r",
                PHASE_COLORS[phase]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Timing display */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-500">
              {state.inhale}s
            </div>
            <div className="text-muted-foreground">Inhale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-500">
              {state.hold}s
            </div>
            <div className="text-muted-foreground">Hold</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-500">
              {state.exhale}s
            </div>
            <div className="text-muted-foreground">Exhale</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={togglePlay}
            className={cn(
              "flex-1 py-3.5 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 press-effect",
              phase === "complete"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
                : "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:shadow-lg hover:scale-[1.02]"
            )}
          >
            {phase === "complete" ? (
              <>
                <RotateCcw className="w-5 h-5" />
                Start Again
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {phase === "idle" ? "Start" : "Resume"}
              </>
            )}
          </button>
          {phase !== "idle" && phase !== "complete" && (
            <button
              onClick={resetExercise}
              className="py-3.5 px-4 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:border-primary/30 transition-all duration-200 press-effect"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BreathingExercise;
