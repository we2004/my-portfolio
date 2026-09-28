import Header from "./Header"
import Hero from "./Hero"
import BeyondCode from "./BeyondCode"
import ProgressBar from "./ProgressBar"
import SelectedWork from "./SelectedWork"
import Skills from "./Skills"

export function MainExperience() {
  return (
    <>
      <Header />
      <ProgressBar />
      <main>
        <Hero />
        <SelectedWork />
        <Skills />
        <BeyondCode />
        {/* Add <Contact /> here when the Contact section is built. */}
        {/* Add <FinalLoading /> here when the final loading sequence is built. */}
        {/* Add <Goodbye /> here when the closing section is built. */}
      </main>
    </>
  )
}

export default MainExperience
