import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import ProjectCard from "./ProjectCard"
import { projects } from "./data/projects"

export function RevealOnScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: prefersReducedMotion ? 0.15 : 0.55,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function SelectedWork() {
  return (
    <RevealOnScroll>
      <section
        id="work"
        aria-label="Selected work"
        className="bg-background px-4 py-20 text-foreground sm:px-6 md:py-24 lg:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 flex flex-wrap items-center gap-3 font-display text-lg leading-relaxed sm:mb-10 sm:text-xl md:text-2xl lg:text-3xl">
            <span className="rounded-md bg-accent px-2 py-1 text-background">
              WORK
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                number={String(index + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>
      </section>
    </RevealOnScroll>
  )
}

export default SelectedWork
