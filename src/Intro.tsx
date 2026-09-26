import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

export interface IntroProps {
  onComplete: () => void
}

type IntroStep =
  | { type: "name"; text: string; duration: number; final?: boolean }
  | {
      type: "role" | "exploring" | "arrow" | "exploration" | "exit"
      duration: number
    }

// Adjust the timeline here: per-letter speed, stage holds, sub-step gaps, and exit duration.
const TIMING = {
  typing: 100,
  nameHold: 900,
  roleHold: 900,
  explorationGap: 450,
  explorationHold: 1000,
  exit: 400,
  motion: 350,
  reducedMotionCrossFade: 200,
  nameTexts: [
    "W",
    "We",
    "Wes",
    "Wesa",
    "Wesal",
    "Wesal I",
    "Wesal Is",
    "Wesal Ism",
    "Wesal Isma",
    "Wesal Ismai",
    "Wesal Ismail"
  ]
}

const STEPS: IntroStep[] = [
  ...TIMING.nameTexts.map((text, index, names) => ({
    type: "name" as const,
    text,
    duration: index === names.length - 1 ? TIMING.nameHold : TIMING.typing,
    final: index === names.length - 1
  })),
  { type: "role", duration: TIMING.roleHold },
  { type: "exploring", duration: TIMING.explorationGap },
  { type: "arrow", duration: TIMING.explorationGap },
  { type: "exploration", duration: TIMING.explorationHold },
  { type: "exit", duration: TIMING.exit }
]
const FINAL_NAME_INDEX = STEPS.findIndex(
  (step) => step.type === "name" && step.final
)
const ROLE_INDEX = STEPS.findIndex((step) => step.type === "role")

export function Intro({ onComplete }: IntroProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const step = STEPS[stepIndex]
  const showFinalName =
    prefersReducedMotion && step.type === "name" && !step.final
  const visibleStep = showFinalName ? STEPS[FINAL_NAME_INDEX] : step
  const isExiting = step.type === "exit"

  useEffect(() => {
    // Reduced motion displays the full name immediately and holds it for the normal name duration.
    const nextIndex = showFinalName ? ROLE_INDEX : stepIndex + 1
    const duration = showFinalName ? TIMING.nameHold : step.duration
    const timer = window.setTimeout(() => {
      if (isExiting) {
        onComplete()
      } else {
        setStepIndex(nextIndex)
      }
    }, duration)

    return () => window.clearTimeout(timer)
  }, [isExiting, onComplete, showFinalName, step.duration, stepIndex])

  const isExplorationStep =
    visibleStep.type === "exploring" ||
    visibleStep.type === "arrow" ||
    visibleStep.type === "exploration"
  const stageKey =
    visibleStep.type === "name"
      ? "name"
      : isExplorationStep
        ? "exploration-group"
        : visibleStep.type
  const transitionDuration =
    (prefersReducedMotion ? TIMING.reducedMotionCrossFade : TIMING.motion) /
    1000

  return (
    <section
      id="intro"
      aria-label="Loading introduction"
      className="flex min-h-screen items-center justify-center bg-background px-4 text-center text-foreground sm:px-6"
    >
      <div
        aria-live="polite"
        className="flex w-full max-w-full items-center justify-center"
      >
        <AnimatePresence
          initial={false}
          mode="wait"
        >
          {!isExiting && (
            <motion.div
              key={stageKey}
              className="w-full max-w-full"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
              transition={{ duration: transitionDuration, ease: "easeOut" }}
            >
              {visibleStep.type === "name" && (
                <h1 className="mx-auto max-w-full whitespace-normal font-display text-[10px] leading-relaxed sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
                  {visibleStep.text}
                </h1>
              )}
              {visibleStep.type === "role" && (
                <h1 className="mx-auto max-w-full whitespace-normal font-display text-[10px] leading-relaxed sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl">
                  FRONTEND DEVELOPER
                </h1>
              )}
              {isExplorationStep && (
                <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-3">
                  <span className="font-ui text-base opacity-70">
                    exploring
                  </span>
                  <AnimatePresence initial={false}>
                    {(visibleStep.type === "arrow" ||
                      visibleStep.type === "exploration") && (
                      <motion.span
                        key="exploration-arrow"
                        aria-hidden="true"
                        className="font-ui text-base"
                        initial={{
                          opacity: 0,
                          y: prefersReducedMotion ? 0 : 8
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                        transition={{
                          duration: transitionDuration,
                          ease: "easeOut"
                        }}
                      >
                        {/* TODO(RTL): Replace or mirror this LTR arrow when RTL support is implemented. */}
                        →
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <AnimatePresence initial={false}>
                    {visibleStep.type === "exploration" && (
                      <motion.span
                        key="exploration-phrase"
                        className="max-w-full shrink-0 whitespace-nowrap font-display text-[10px] leading-relaxed text-accent sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl"
                        initial={{
                          opacity: 0,
                          y: prefersReducedMotion ? 0 : 8
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                        transition={{
                          duration: transitionDuration,
                          ease: "easeOut"
                        }}
                      >
                        Backend Development
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Intro
