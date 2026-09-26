import { useReducedMotion } from "motion/react"
import type { MouseEvent } from "react"

const NAV_ITEMS = [
  { label: "WORK", sectionId: "work" },
  { label: "SKILLS", sectionId: "skills" },
  { label: "COMMUNITY", sectionId: "community" },
  { label: "CONTACT", sectionId: "contact" }
] as const

const HEADER_SCROLL_OFFSET = 64

export function Header() {
  const prefersReducedMotion = useReducedMotion()

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const sectionId = event.currentTarget.hash.slice(1)
    const section = document.getElementById(sectionId)
    if (!section) return

    event.preventDefault()
    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY -
      HEADER_SCROLL_OFFSET

    window.scrollTo({
      top: Math.max(sectionTop, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    })
    window.history.pushState(null, "", `#${sectionId}`)
  }

  return (
    <header className="fixed start-0 end-0 top-0 z-50 h-14 border-b border-foreground/10 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <a
          aria-label="Wesal Ismail, home"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-[8px] text-foreground sm:gap-2 sm:text-[10px]"
          href="#intro"
          onClick={handleAnchorClick}
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 bg-accent"
          />
          WESAL ISMAIL
        </a>
        <nav
          aria-label="Main navigation"
          className="min-w-0"
        >
          <ul className="flex items-center gap-2 whitespace-nowrap font-ui text-[8px] sm:gap-4 sm:text-xs">
            {NAV_ITEMS.map(({ label, sectionId }) => (
              <li key={sectionId}>
                <a
                  className="text-foreground/75 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`#${sectionId}`}
                  onClick={handleAnchorClick}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
