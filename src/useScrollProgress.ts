import { useEffect, useState } from "react"

interface SectionBoundary {
  id: string
  start: number
  end: number
}

interface RegisteredSection extends SectionBoundary {
  top: number
  progressEndPosition?: number
}

// Adjust these progress ranges as the page sections and their relative weights settle.
// Sections register by using the matching id; missing sections are skipped and their ranges
// are interpolated across the registered neighbors. The final-loading section completes the range.
const SECTION_BOUNDARIES: SectionBoundary[] = [
  { id: "intro", start: 0, end: 10 },
  { id: "hero", start: 10, end: 20 },
  { id: "work", start: 20, end: 50 },
  { id: "skills", start: 50, end: 70 },
  { id: "community", start: 70, end: 82 },
  { id: "contact", start: 82, end: 92 },
  { id: "final-loading", start: 92, end: 100 }
]

const MAX_SCROLL_PROGRESS = 100

function getScrollProgress(): number {
  const sections: RegisteredSection[] = SECTION_BOUNDARIES.flatMap(
    (boundary) => {
      const element = document.getElementById(boundary.id)
      if (!element) return []

      const configuredStart = Number(element.dataset.scrollProgressStart)
      const configuredEnd = Number(element.dataset.scrollProgressEnd)

      return [
        {
          ...boundary,
          top: Number.isFinite(configuredStart)
            ? configuredStart
            : element.getBoundingClientRect().top + window.scrollY,
          progressEndPosition: Number.isFinite(configuredEnd)
            ? configuredEnd
            : undefined
        }
      ]
    }
  )

  if (sections.length === 0) return 0

  const scrollPosition = window.scrollY
  const firstSection = sections[0]
  if (scrollPosition < firstSection.top) return firstSection.start

  let activeIndex = 0
  for (let index = 1; index < sections.length; index += 1) {
    if (scrollPosition < sections[index].top) break
    activeIndex = index
  }

  const activeSection = sections[activeIndex]
  const nextSection = sections[activeIndex + 1]

  // Reduced motion skips the final pin and presents its completed state immediately.
  if (
    activeSection.id === "final-loading" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return 100
  }

  const maxScrollPosition = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0
  )
  const segmentEndPosition =
    activeSection.progressEndPosition ?? nextSection?.top ?? maxScrollPosition
  const segmentEndProgress =
    activeSection.progressEndPosition !== undefined
      ? activeSection.end
      : (nextSection?.start ?? activeSection.end)

  // A viewport-filling final section may have no scroll interval; keep its start value stable.
  if (segmentEndPosition <= activeSection.top) {
    return activeSection.start
  }

  const sectionProgress = Math.min(
    Math.max(
      (scrollPosition - activeSection.top) /
        (segmentEndPosition - activeSection.top),
      0
    ),
    1
  )
  const progress =
    activeSection.start +
    (segmentEndProgress - activeSection.start) * sectionProgress

  return Math.min(Math.max(progress, 0), MAX_SCROLL_PROGRESS)
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame: number | null = null

    const updateProgress = () => {
      animationFrame = null
      setProgress(getScrollProgress())
    }

    const scheduleUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    scheduleUpdate()

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return progress
}
