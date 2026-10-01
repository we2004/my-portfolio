import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RevealOnScroll } from "./SelectedWork"
import SkillBadge from "./SkillBadge"
import { skills } from "./data/skills"

gsap.registerPlugin(ScrollTrigger)

// Keep scatter density, flex gap, and pin distance together at each project breakpoint.
const BREAKPOINT_CONFIG = {
  under480: {
    query: "(max-width: 479px)",
    scatterSpread: 0.76,
    gap: 8,
    pinLength: 0.9
  },
  from480: {
    query: "(min-width: 480px) and (max-width: 767px)",
    scatterSpread: 0.82,
    gap: 10,
    pinLength: 0.98
  },
  from768: {
    query: "(min-width: 768px) and (max-width: 1023px)",
    scatterSpread: 0.88,
    gap: 12,
    pinLength: 1.08
  },
  from1024: {
    query: "(min-width: 1024px) and (max-width: 1279px)",
    scatterSpread: 0.92,
    gap: 14,
    pinLength: 1.16
  },
  from1280: {
    query: "(min-width: 1280px) and (max-width: 1535px)",
    scatterSpread: 0.94,
    gap: 16,
    pinLength: 1.22
  },
  from1536: {
    query: "(min-width: 1536px)",
    scatterSpread: 0.96,
    gap: 18,
    pinLength: 1.28
  }
} as const

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function getScatterOffsets(
  stage: HTMLDivElement,
  list: HTMLUListElement,
  spread: number
): Array<{ x: number; y: number }> {
  const stageBounds = stage.getBoundingClientRect()
  const badges = Array.from(list.children) as HTMLElement[]
  const count = badges.length
  if (count === 0) return []

  const areaWidth = stageBounds.width * spread
  const areaHeight = stageBounds.height * spread
  const areaStartX = (stageBounds.width - areaWidth) / 2
  const areaStartY = (stageBounds.height - areaHeight) / 2
  const columns = Math.max(
    1,
    Math.ceil(Math.sqrt((count * areaWidth) / Math.max(areaHeight, 1)))
  )
  const rows = Math.ceil(count / columns)
  const cellWidth = areaWidth / columns
  const cellHeight = areaHeight / rows

  return badges.map((badge, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const itemsInRow = Math.min(columns, count - row * columns)
    const rowStartX = areaStartX + (areaWidth - itemsInRow * cellWidth) / 2
    const badgeBounds = badge.getBoundingClientRect()
    const currentX = badgeBounds.left - stageBounds.left + badgeBounds.width / 2
    const currentY = badgeBounds.top - stageBounds.top + badgeBounds.height / 2

    let seed = Math.imul(index + 1, 0x9e3779b1) >>> 0
    const nextRandom = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed / 0x100000000
    }

    const jitterX = (nextRandom() - 0.5) * cellWidth * 0.2
    const jitterY = (nextRandom() - 0.5) * cellHeight * 0.2
    const targetX = gsap.utils.clamp(
      badgeBounds.width / 2,
      stageBounds.width - badgeBounds.width / 2,
      rowStartX + (column + 0.5) * cellWidth + jitterX
    )
    const targetY = gsap.utils.clamp(
      badgeBounds.height / 2,
      stageBounds.height - badgeBounds.height / 2,
      areaStartY + (row + 0.5) * cellHeight + jitterY
    )

    return {
      x: targetX - currentX,
      y: targetY - currentY
    }
  })
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const list = listRef.current
    if (!section || !stage || !list) return

    let responsive: ReturnType<typeof gsap.matchMedia> | undefined
    const context = gsap.context(() => {
      responsive = gsap.matchMedia()
      const queries = Object.fromEntries(
        Object.entries(BREAKPOINT_CONFIG).map(([name, config]) => [
          name,
          config.query
        ])
      )
      responsive.add(
        { ...queries, reduceMotion: REDUCED_MOTION_QUERY },
        (matchContext) => {
          const activeConfig =
            Object.entries(BREAKPOINT_CONFIG).find(
              ([name]) => matchContext.conditions?.[name]
            )?.[1] ?? BREAKPOINT_CONFIG.under480
          list.style.setProperty("--skills-gap", `${activeConfig.gap}px`)

          if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
            console.info("[Skills] Reduced-motion static cluster enabled")
            return () => list.style.removeProperty("--skills-gap")
          }
          if (skills.length === 0) {
            return () => list.style.removeProperty("--skills-gap")
          }

          console.info("[Skills] ScrollTrigger animation enabled")

          let active = true
          let offsets: Array<{ x: number; y: number }> = []
          let timeline: gsap.core.Timeline | undefined

          const clearWillChange = () => {
            Array.from(list.children).forEach((badge) => {
              ;(badge as HTMLElement).style.willChange = ""
            })
          }

          const setScatteredPose = (logOffsets = false) => {
            const badges = Array.from(list.children) as HTMLElement[]
            gsap.set(badges, { x: 0, y: 0 })
            offsets = getScatterOffsets(stage, list, activeConfig.scatterSpread)
            gsap.set(badges, {
              x: (index: number) => offsets[index].x,
              y: (index: number) => offsets[index].y,
              opacity: 0.58
            })
            if (logOffsets) {
              console.table(
                offsets.map((offset, index) => ({
                  skill: skills[index],
                  x: Math.round(offset.x),
                  y: Math.round(offset.y)
                }))
              )
            }
          }

          void (async () => {
            await document.fonts.ready
            if (!active) return

            const badges = Array.from(list.children) as HTMLElement[]
            if (badges.length === 0) return
            setScatteredPose(true)

            timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                pin: true,
                pinSpacing: true,
                start: "top top",
                end: () => `+=${window.innerHeight * activeConfig.pinLength}`,
                scrub: 0.8,
                invalidateOnRefresh: true,
                onRefreshInit: () => setScatteredPose(),
                onEnter: () => {
                  badges.forEach((badge) => {
                    badge.style.willChange = "transform"
                  })
                },
                onEnterBack: () => {
                  badges.forEach((badge) => {
                    badge.style.willChange = "transform"
                  })
                },
                onLeave: clearWillChange,
                onLeaveBack: clearWillChange
              }
            })

            const tweenTowardCenter = (factor: number, opacity: number) => ({
              x: (index: number) => offsets[index].x * factor,
              y: (index: number) => offsets[index].y * factor,
              opacity,
              duration: 0.2,
              stagger: { amount: 0.07, from: "center" as const },
              ease: "power2.inOut"
            })

            timeline
              .to(badges, tweenTowardCenter(0.7, 0.7), 0)
              .to(badges, tweenTowardCenter(0.48, 0.8), 0.18)
              .to(badges, tweenTowardCenter(0.2, 0.9), 0.38)
              .to(
                badges,
                {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  duration: 0.2,
                  stagger: { amount: 0.07, from: "center" },
                  ease: "power2.inOut"
                },
                0.58
              )
              .to({}, { duration: 0.15 }, 0.85)

            ScrollTrigger.refresh()
          })()

          return () => {
            active = false
            timeline?.scrollTrigger?.kill()
            timeline?.kill()
            gsap.set(Array.from(list.children), {
              clearProps: "transform,opacity,willChange"
            })
            clearWillChange()
            list.style.removeProperty("--skills-gap")
          }
        }
      )
    }, section)

    return () => {
      responsive?.revert()
      context.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Skills"
      className="bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:py-24"
    >
      <RevealOnScroll>
        <h2 className="mx-auto mb-4 max-w-6xl text-start font-display text-lg leading-relaxed sm:mb-6 sm:text-xl md:text-2xl lg:text-3xl">
          SKILLS<span className="text-accent">.</span>
        </h2>
      </RevealOnScroll>

      <div
        ref={stageRef}
        className="relative flex h-screen min-h-64 w-full items-center justify-center overflow-hidden pt-14"
      >
        <ul
          ref={listRef}
          aria-label="Skills"
          className="flex w-full flex-wrap content-center items-center justify-center gap-(--skills-gap,0.5rem)"
        >
          {skills.map((skill) => (
            <SkillBadge
              key={skill}
              name={skill}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Skills
