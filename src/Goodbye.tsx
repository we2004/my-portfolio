import { useReducedMotion } from "motion/react"
import type { MouseEvent } from "react"
import meImg from "./assets/meImg.svg"
import { RevealOnScroll } from "./SelectedWork"

const HEADER_SCROLL_OFFSET = 64

export function Goodbye(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    })
  }

  const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const contactSection = document.getElementById("contact")
    if (!contactSection) return

    event.preventDefault()
    const contactTop =
      contactSection.getBoundingClientRect().top +
      window.scrollY -
      HEADER_SCROLL_OFFSET

    window.scrollTo({
      top: Math.max(contactTop, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    })
    window.history.pushState(null, "", "#contact")
  }

  return (
    <RevealOnScroll>
      <section
        id="goodbye"
        aria-label="Goodbye"
        className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground sm:px-6"
      >
        <div className="flex w-full max-w-xl flex-col items-center gap-5 text-center sm:gap-6">
          <div className="relative rounded-lg border border-foreground/20 bg-background px-4 py-3 font-display text-[9px] text-accent sm:px-5 sm:text-[10px]">
            GOODBYE!
            <span
              aria-hidden="true"
              className="absolute -bottom-1 inset-s-1/2 size-2.5 -translate-x-1/2 rotate-45 border-e border-b border-foreground/20 bg-background"
            />
          </div>

          <img
            src={meImg}
            alt=""
            aria-hidden="true"
            className=" size-24 max-h-[38vh] max-w-[72vw] object-contain lg:size-72 lg:max-w-[30vw] xl:size-80 xl:max-h-[30vh]"
          />

          <h2 className="font-display text-xs leading-relaxed text-foreground sm:text-sm md:text-base">
            WESAL ISMAIL
          </h2>

          <div className="mt-2 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="min-h-12 rounded-lg border border-foreground/20 bg-foreground/3 px-4 py-3 font-ui text-[9px] text-foreground transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-5 sm:text-[10px]"
            >
              BACK TO TOP{" "}
              {/* TODO(RTL): Mirror this directional arrow if RTL is implemented. */}
              <span aria-hidden="true">↗</span>
            </button>
            <a
              href="#contact"
              onClick={handleContactClick}
              className="flex min-h-12 items-center justify-center rounded-lg border border-foreground/20 bg-foreground/3 px-4 py-3 font-ui text-[9px] text-foreground transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-5 sm:text-[10px]"
            >
              CONTACT
            </a>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  )
}

export default Goodbye
