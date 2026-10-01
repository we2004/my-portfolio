import { useScrollProgress } from "./useScrollProgress"

const SUCCESS_GREEN = "#54c77b"

export function ProgressBar() {
  const progress = useScrollProgress()
  const roundedProgress = Math.round(progress)
  const isComplete = progress >= 100

  return (
    <div
      aria-label={`Portfolio scroll progress: ${roundedProgress}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={roundedProgress}
      aria-valuetext={`${roundedProgress}%`}
      className="fixed start-0 end-0 top-14 z-40 flex h-1 justify-start bg-foreground/10"
      role="progressbar"
    >
      <div
        className="h-full bg-accent transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none"
        style={{
          width: `${progress}%`,
          backgroundColor: isComplete ? SUCCESS_GREEN : undefined
        }}
      />
    </div>
  )
}

export default ProgressBar
