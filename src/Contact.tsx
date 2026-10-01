import { useEffect, useRef, useState } from "react"
import { RevealOnScroll } from "./SelectedWork"
import { social, type SocialLink } from "./data/social"

export function Contact(): React.JSX.Element {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const copyTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== undefined) {
        window.clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  // URL shape determines behavior so entries can be reordered or extended freely.
  const copyEmail = async (url: string): Promise<void> => {
    const email = url.slice("mailto:".length)

    try {
      if (!navigator.clipboard?.writeText) return
      await navigator.clipboard.writeText(email)
      setCopiedUrl(url)
      if (copyTimeoutRef.current !== undefined) {
        window.clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedUrl(null)
        copyTimeoutRef.current = undefined
      }, 1500)
    } catch {
      // The mailto link remains usable if clipboard access is unavailable.
    }
  }

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <h2 className="mb-8 flex items-center gap-3 text-start font-display text-lg leading-relaxed sm:mb-10 sm:text-xl md:text-2xl lg:text-3xl">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 bg-accent"
            />
            <span>LET&apos;S MAKE SOMETHING.</span>
          </h2>
        </RevealOnScroll>

        <ul className="mx-auto flex max-w-3xl flex-col gap-3 sm:gap-4">
          {social.map((entry: SocialLink) => {
            const isEmail = entry.url.startsWith("mailto:")
            // const value = isEmail
            //   ? entry.url.slice("mailto:".length)
            //   : entry.url.replace(/^https?:\/\//, "")
            const content = (
              <>
                <img
                  src={entry.icon}
                  alt=""
                  aria-hidden="true"
                  className="size-7 shrink-0 object-contain text-white"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1 text-start">
                  <span className="font-ui text-[10px] text-foreground/55 sm:text-xs">
                    {entry.name}
                  </span>
                  <span className="break-all font-ui text-xs leading-relaxed text-foreground sm:text-sm">
                    {entry.value}
                  </span>
                </span>
              </>
            )

            return (
              <li
                key={`${entry.url}-${entry.name}`}
                className="min-w-0"
              >
                {isEmail ? (
                  <div className="project-card-corners project-card-texture relative flex min-w-0 items-center gap-3 rounded-lg border border-foreground/15 bg-foreground/3 p-4 text-start sm:gap-4 sm:p-5">
                    <a
                      href={entry.url}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-4"
                    >
                      {content}
                    </a>
                    <button
                      type="button"
                      onClick={() => void copyEmail(entry.url)}
                      className="shrink-0 rounded-md border border-foreground/20 px-3 py-2 font-ui text-[9px] text-foreground/75 transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-[10px]"
                    >
                      <span aria-live="polite">
                        {copiedUrl === entry.url ? "COPIED" : "COPY"}
                      </span>
                    </button>
                  </div>
                ) : (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-corners project-card-texture relative flex min-w-0 items-center gap-3 rounded-lg border border-foreground/15 bg-foreground/3 p-4 text-start transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-4 sm:p-5"
                  >
                    {content}
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-ui text-[10px] text-accent sm:text-xs"
                    >
                      OPEN ↗
                    </span>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Contact
