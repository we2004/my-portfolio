import { motion, useReducedMotion } from "motion/react"
import { useRef, useState } from "react"
import type { PointerEvent, ReactNode } from "react"
import type { Project } from "./data/projects"

export interface ProjectCardProps {
  project: Project
  number: string
}

const CATEGORY_LABELS: Record<Project["category"], string> = {
  web: "WEBSITE",
  automation: "AUTOMATION"
}

export function ProjectCard({ project, number }: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const backTriggerRef = useRef<HTMLButtonElement>(null)
  const frontTriggerRef = useRef<HTMLButtonElement>(null)
  const previewTechnologies = project.technologies.slice(0, 4)
  const remainingTechnologyCount = Math.max(
    project.technologies.length - previewTechnologies.length,
    0
  )

  const focusAfterFlip = (
    event: React.MouseEvent<HTMLButtonElement>,
    face: "front" | "back"
  ) => {
    if (event.detail !== 0) return
    requestAnimationFrame(() => {
      if (face === "front") backTriggerRef.current?.focus()
      else frontTriggerRef.current?.focus()
    })
  }

  const handleTouchTap = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") return
    if (event.target instanceof Element && event.target.closest("a, button"))
      return
    setIsFlipped((flipped) => !flipped)
  }

  const handleMouseEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    if (event.currentTarget.contains(document.activeElement)) return
    setIsFlipped(true)
  }

  const handleMouseLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    if (event.currentTarget.contains(document.activeElement)) return
    setIsFlipped(false)
  }

  const frontFace: ReactNode = (
    <button
      ref={frontTriggerRef}
      type="button"
      aria-label={`Show details for ${project.title}`}
      className="project-card-texture flex h-full w-full flex-col items-stretch justify-between gap-8 rounded-lg border border-foreground/15 bg-foreground/[0.03] p-5 text-start transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
      onClick={(event) => {
        setIsFlipped(true)
        focusAfterFlip(event, "front")
      }}
    >
      <span
        aria-label={`${number} ${CATEGORY_LABELS[project.category]}`}
        className="whitespace-nowrap font-ui text-[10px] text-accent sm:text-xs"
      >
        {number} <span aria-hidden="true">//</span>{" "}
        {CATEGORY_LABELS[project.category]}
      </span>
      <span className="font-display text-xs leading-relaxed text-foreground sm:text-sm">
        {project.title}
      </span>
      <ul
        aria-label="Technology preview"
        className="flex flex-wrap gap-1.5"
      >
        {previewTechnologies.map((technology) => (
          <li
            key={`${project.id}-preview-${technology}`}
            className="rounded-md border border-foreground/15 bg-background/40 px-2 py-1 font-ui text-[9px] text-foreground/75"
          >
            {technology}
          </li>
        ))}
        {remainingTechnologyCount > 0 && (
          <li className="rounded-md border border-foreground/15 px-2 py-1 font-ui text-[9px] text-foreground/60">
            +{remainingTechnologyCount}
          </li>
        )}
      </ul>

      <span className="font-ui text-xs text-foreground/55">View details</span>
    </button>
  )

  const backFace: ReactNode = (
    <div className="project-card-texture flex h-full w-full flex-col gap-4 rounded-lg border border-foreground/15 bg-background p-5 text-start sm:gap-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-display text-[10px] leading-relaxed text-foreground sm:text-xs">
          {project.title}
        </h3>
        <button
          ref={backTriggerRef}
          type="button"
          aria-label={`Show front of ${project.title} card`}
          className="shrink-0 rounded-md border border-foreground/20 px-2 py-1 font-ui text-[9px] text-foreground/70 hover:border-accent/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={(event) => {
            setIsFlipped(false)
            focusAfterFlip(event, "back")
          }}
        >
          BACK
        </button>
      </div>

      <p className="font-ui text-sm leading-relaxed text-foreground/80">
        {project.description}
      </p>

      <ul
        aria-label="Technologies"
        className="flex flex-wrap gap-2"
      >
        {project.technologies.map((technology) => (
          <li
            key={`${project.id}-${technology}`}
            className="rounded-md border border-foreground/15 px-2 py-1 font-ui text-[9px] text-foreground/70"
          >
            {technology}
          </li>
        ))}
      </ul>

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-auto flex flex-wrap gap-2">
          {project.githubUrl && (
            <a
              className="rounded-md border border-foreground/20 px-3 py-1.5 font-ui text-[10px] text-foreground hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              className="rounded-md border border-accent/50 px-3 py-1.5 font-ui text-[10px] text-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  )

  return (
    <article
      className="min-w-0"
      onPointerEnter={handleMouseEnter}
      onPointerLeave={handleMouseLeave}
      onPointerUp={handleTouchTap}
    >
      <div className="project-card-perspective relative min-h-80">
        <motion.div
          className="project-card-flipper relative min-h-80 w-full"
          animate={{ rotateY: isFlipped && !prefersReducedMotion ? 180 : 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.65, ease: [0.2, 0.75, 0.25, 1] }
          }
        >
          <div
            aria-hidden={isFlipped}
            inert={isFlipped}
            hidden={Boolean(prefersReducedMotion && isFlipped)}
            className="project-card-face absolute inset-0 rounded-lg"
          >
            {frontFace}
          </div>
          <div
            aria-hidden={!isFlipped}
            inert={!isFlipped}
            hidden={Boolean(prefersReducedMotion && !isFlipped)}
            className={`project-card-face absolute inset-0 rounded-lg${prefersReducedMotion ? "" : " project-card-face--back"}`}
          >
            {backFace}
          </div>
        </motion.div>
      </div>
    </article>
  )
}

export default ProjectCard
