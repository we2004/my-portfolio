import Header from "./Header"
import Hero from "./Hero"
import ProgressBar from "./ProgressBar"
import SelectedWork from "./SelectedWork"

export function MainExperience() {
  return (
    <>
      <Header />
      <ProgressBar />
      <main>
        <Hero />
        <SelectedWork />
        {/* Add <Skills /> here when the Skills section is built. */}
        {/* Add <BeyondCode /> here when the Community section is built. */}
        {/* Add <Contact /> here when the Contact section is built. */}
        {/* Add <FinalLoading /> here when the final loading sequence is built. */}
        {/* Add <Goodbye /> here when the closing section is built. */}
      </main>
    </>
  )
}

export default MainExperience
