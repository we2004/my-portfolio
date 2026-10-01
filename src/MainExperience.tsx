import Header from "./Header"
import Hero from "./Hero"
import BeyondCode from "./BeyondCode"
import Contact from "./Contact"
import FinalLoading from "./FinalLoading"
import Goodbye from "./Goodbye"
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
        <Contact />
        <FinalLoading />
        <Goodbye />
      </main>
    </>
  )
}

export default MainExperience
