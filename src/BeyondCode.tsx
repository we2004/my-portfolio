import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RevealOnScroll } from "./SelectedWork"
import { volunteers } from "./data/volunteer"

gsap.registerPlugin(ScrollTrigger)

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export function BeyondCode() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackHostRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const trackRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLSpanElement>())
  const volunteerKey = JSON.stringify(volunteers.map(({ title }) => title))

  useLayoutEffect(() => {
    const section = sectionRef.current
    const trackHost = trackHostRef.current
    const list = listRef.current
    const track = trackRef.current
    const fill = fillRef.current
    if (
      !section ||
      !trackHost ||
      !list ||
      !track ||
      !fill ||
      volunteers.length === 0
    )
      return

    let active = true
    let refreshFrame: number | undefined
    const context = gsap.context(() => {}, section)

    void document.fonts.ready.then(() => {
      if (!active) return

      context.add(() => {
        const nodes = volunteers
          .map(({ title }) => nodeRefs.current.get(title))
          .filter((node): node is HTMLSpanElement => node !== undefined)
        if (nodes.length === 0) return

        const measureTrack = () => {
          const hostBounds = trackHost.getBoundingClientRect()
          const firstBounds = nodes[0].getBoundingClientRect()
          const lastBounds = nodes[nodes.length - 1].getBoundingClientRect()
          const top = firstBounds.top + firstBounds.height / 2 - hostBounds.top
          const bottom = lastBounds.top + lastBounds.height / 2 - hostBounds.top

          track.style.top = `${top}px`
          track.style.height = `${Math.max(bottom - top, 1)}px`

          return { top, height: Math.max(bottom - top, 1) }
        }

        const activateAll = () => {
          gsap.set(fill, { scaleY: 1 })
          gsap.set(nodes, {
            backgroundColor: "var(--token-color-accent)",
            borderColor: "var(--token-color-accent)",
            boxShadow: "0 0 8px var(--token-color-accent)"
          })
        }

        // Node positions are measured inside the list so cards of any height map to their true place on the track.
        const trackGeometry = measureTrack()
        if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
          activateAll()
          return
        }

        gsap.set(fill, { scaleY: 0, transformOrigin: "top center" })
        gsap.set(nodes, {
          backgroundColor: "transparent",
          borderColor: "var(--token-color-fg)",
          boxShadow: "none"
        })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: measureTrack
          }
        })

        // A 0-to-1 timeline maps directly to the measured first-to-last node span.
        timeline.to(fill, { scaleY: 1, duration: 1.025, ease: "none" }, 0)

        nodes.forEach((node) => {
          const bounds = node.getBoundingClientRect()
          const hostBounds = trackHost.getBoundingClientRect()
          const nodeCenter = bounds.top + bounds.height / 2 - hostBounds.top
          const activationPoint = gsap.utils.clamp(
            0,
            1,
            (nodeCenter - trackGeometry.top) / trackGeometry.height
          )

          // Each node activates when the scrubbed fill reaches its measured position on the line.
          timeline.to(
            node,
            {
              backgroundColor: "var(--token-color-accent)",
              borderColor: "var(--token-color-accent)",
              boxShadow: "0 0 8px var(--token-color-accent)",
              duration: 0.025
            },
            activationPoint
          )
        })
      })

      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = undefined
        if (active) ScrollTrigger.refresh()
      })
    })

    return () => {
      active = false
      if (refreshFrame !== undefined) {
        window.cancelAnimationFrame(refreshFrame)
      }
      context.revert()
    }
  }, [volunteerKey])

  return (
    <section
      ref={sectionRef}
      id="community"
      aria-label="Volunteer"
      className="bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <h2 className="mb-8 flex items-center gap-3 text-start font-display text-lg leading-relaxed sm:mb-10 sm:text-xl md:text-2xl lg:text-3xl">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 bg-accent"
            />
            <span>VOLUNTEER</span>
          </h2>
        </RevealOnScroll>

        <div
          ref={trackHostRef}
          className="relative"
        >
          {volunteers.length > 0 && (
            <span
              ref={trackRef}
              aria-hidden="true"
              // Logical inline positioning keeps the timeline on the start side in RTL layouts.
              className="pointer-events-none absolute z-0 w-px bg-foreground/20"
              style={{ insetInlineStart: "1rem" }}
            >
              <span
                ref={fillRef}
                className="absolute inset-0 block origin-top bg-accent"
                style={{ transform: "scaleY(0)" }}
              />
            </span>
          )}

          <ol
            ref={listRef}
            className="flex flex-col gap-5 sm:gap-6"
          >
            {volunteers.map((volunteer, index) => (
              <li
                key={`${index}-${volunteer.title}`}
                className="relative z-10 grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6"
              >
                <div className="flex flex-col items-center gap-2 pt-6">
                  <span
                    ref={(node) => {
                      if (node) nodeRefs.current.set(volunteer.title, node)
                      else nodeRefs.current.delete(volunteer.title)
                    }}
                    aria-hidden="true"
                    className="z-10 size-3 shrink-0 border border-foreground/40 bg-background"
                  />
                </div>

                <article className="project-card-corners project-card-texture relative min-w-0 rounded-lg border border-foreground/15 bg-foreground/3 p-5 text-start sm:p-6">
                  <h3 className="font-display text-[10px] leading-relaxed text-foreground sm:text-xs">
                    {volunteer.title}
                  </h3>
                  <p className="mt-3 font-ui text-[10px] leading-relaxed text-accent sm:text-xs">
                    {volunteer.subtitle}
                  </p>
                  <p className="mt-4 font-ui text-xs leading-relaxed text-foreground/70 sm:text-sm">
                    {volunteer.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default BeyondCode
