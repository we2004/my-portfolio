import Intro from "./Intro"
import MainExperience from "./MainExperience"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const transitionDuration = prefersReducedMotion ? 0.1 : 0.35

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {introComplete ? (
        <motion.div
          key="main-experience"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration, ease: "easeOut" }}
        >
          <MainExperience />
        </motion.div>
      ) : (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration, ease: "easeOut" }}
        >
          <Intro onComplete={() => setIntroComplete(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
