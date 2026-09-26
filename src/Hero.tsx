import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import heroImg from "./assets/heroImage.svg"

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const [imageAssembled, setImageAssembled] = useState(false)

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-screen flex-col items-center bg-background px-4 pt-16 pb-8 text-center text-foreground sm:px-6 sm:pt-20 sm:pb-10"
    >
      <div
        aria-hidden="true"
        className="flex-1"
      />

      <div className="flex flex-col items-center justify-center gap-5 sm:gap-6">
        <h1 className="whitespace-nowrap font-display text-xs leading-relaxed sm:text-sm md:text-base lg:text-xl xl:text-3xl 2xl:text-4xl">
          WESAL ISMAIL
        </h1>

        <motion.span
          className="rounded-md border border-foreground/20 px-2.5 py-1 font-ui text-[9px] leading-relaxed sm:text-[10px] md:text-xs text-accent"
          initial={{ opacity: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: [0, 1, 0, 1, 0.3, 1] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.2, ease: "easeOut" }
              : {
                  duration: 0.68,
                  times: [0, 0.12, 0.24, 0.41, 0.58, 1],
                  ease: "linear"
                }
          }
        >
          FRONTEND DEVELOPER
        </motion.span>

        <p className="max-w-xl font-ui text-sm leading-relaxed text-foreground/70 sm:text-base md:text-lg">
          Software Engineering student interested in AI and visually appealing
          UI.
        </p>

        <span className="relative isolate inline-grid place-items-center">
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-1 rounded-full bg-accent blur-md"
            initial={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.15 }
                : imageAssembled
                  ? { opacity: [0.15, 0.3] }
                  : { opacity: 0 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    opacity: {
                      duration: 3.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }
            }
          />
          <motion.img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="relative size-8 brightness-0 invert sm:size-9 md:size-10"
            initial={{
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.85
            }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.2, ease: "easeOut" }
                : {
                    type: "spring",
                    stiffness: 180,
                    damping: 22,
                    mass: 0.8
                  }
            }
            onAnimationComplete={() => setImageAssembled(true)}
          />
        </span>
      </div>

      <div className="flex flex-1 items-end justify-center pb-2">
        <a
          className="flex flex-col items-center gap-2 font-ui text-[10px] text-foreground/60 sm:text-xs"
          href="#work"
        >
          <span className="text-accent">SCROLL TO EXPLORE</span>
          {/* This is the only looping motion in Hero; reduced motion keeps it static. */}
          <motion.svg
            aria-hidden="true"
            className="size-4"
            fill="none"
            focusable="false"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, 3, 0] }}
            transition={{
              duration: prefersReducedMotion ? 0 : 2.6,
              repeat: prefersReducedMotion ? 0 : Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
        </a>
      </div>
    </section>
  )
}

export default Hero
