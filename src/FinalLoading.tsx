import { useLayoutEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useScrollProgress } from "./useScrollProgress"

gsap.registerPlugin(ScrollTrigger)

// Percentage steps count through every integer 92-100; finish progress at 72%, reveal both messages, then hold for 12%.
const SCROLL_CONFIG = {
  initialPercentage: 92,
  percentageSteps: [93, 94, 95, 96, 97, 98, 99, 100],
  pinLength: 1.35,
  progressCompleteAt: 0.72,
  completeTextStart: 0.72,
  supportingTextStart: 0.8,
  fadeDuration: 0.08
} as const

export function FinalLoading(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion()
  const progress = useScrollProgress()
  const isComplete = progress >= 100
  const displayedProgress = prefersReducedMotion
    ? 100
    : SCROLL_CONFIG.percentageSteps.reduce<number>(
        (percentage, step) => (progress >= step ? step : percentage),
        SCROLL_CONFIG.initialPercentage
      )
  const sectionRef = useRef<HTMLElement>(null)
  const completeTextRef = useRef<HTMLHeadingElement>(null)
  const supportingTextRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const completeText = completeTextRef.current
    const supportingText = supportingTextRef.current
    if (!section || !completeText || !supportingText) return

    let active = true
    const context = gsap.context(() => {}, section)

    if (prefersReducedMotion) {
      delete section.dataset.scrollProgressStart
      delete section.dataset.scrollProgressEnd
      context.add(() => {
        gsap.set([completeText, supportingText], { opacity: 1, y: 0 })
      })

      return () => {
        active = false
        context.revert()
      }
    }

    gsap.set([completeText, supportingText], { opacity: 0, y: 6 })

    void document.fonts.ready.then(() => {
      if (!active) return

      context.add(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinSpacing: true,
            start: "top top",
            end: () => `+=${window.innerHeight * SCROLL_CONFIG.pinLength}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: (trigger) => {
              const progressEnd =
                trigger.start +
                (trigger.end - trigger.start) * SCROLL_CONFIG.progressCompleteAt
              section.dataset.scrollProgressStart = String(trigger.start)
              section.dataset.scrollProgressEnd = String(progressEnd)
            }
          }
        })

        // A one-second base track makes the labels fractions of the complete pin distance.
        timeline.to({}, { duration: 1 }, 0)
        timeline.to(
          completeText,
          {
            opacity: 1,
            y: 0,
            duration: SCROLL_CONFIG.fadeDuration,
            ease: "power2.out"
          },
          SCROLL_CONFIG.completeTextStart
        )
        timeline.to(
          supportingText,
          {
            opacity: 1,
            y: 0,
            duration: SCROLL_CONFIG.fadeDuration,
            ease: "power2.out"
          },
          SCROLL_CONFIG.supportingTextStart
        )
      })

      ScrollTrigger.refresh()
    })

    return () => {
      active = false
      delete section.dataset.scrollProgressStart
      delete section.dataset.scrollProgressEnd
      context.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section
      ref={sectionRef}
      id="final-loading"
      aria-label="Final loading"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        <span
          aria-live="polite"
          className="font-ui text-2xl text-foreground/70 sm:text-3xl"
        >
          {displayedProgress}%
        </span>

        <div className="flex flex-col items-center gap-4 pt-4">
          <h2
            ref={completeTextRef}
            className={`${prefersReducedMotion ? "" : "opacity-0"} font-display text-sm leading-relaxed text-foreground sm:text-base md:text-lg`}
          >
            LOADING COMPLETE
          </h2>
          <div
            ref={supportingTextRef}
            className={`flex flex-col items-center gap-2${prefersReducedMotion ? "" : " opacity-0"}`}
          >
            <p className="font-ui text-[10px] text-foreground/60 sm:text-xs">
              KEEP SCROLLING
            </p>
            <motion.svg
              aria-hidden="true"
              className="size-4 text-foreground/60"
              fill="none"
              focusable="false"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              animate={
                prefersReducedMotion || !isComplete
                  ? { y: 0 }
                  : { y: [0, 3, 0] }
              }
              transition={{
                duration: prefersReducedMotion || !isComplete ? 0 : 2.6,
                repeat: prefersReducedMotion || !isComplete ? 0 : Infinity,
                ease: "easeInOut"
              }}
            >
              <path d="m6 9 6 6 6-6" />
            </motion.svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalLoading
