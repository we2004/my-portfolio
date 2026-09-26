import Intro from "./Intro"


function App() {

  return (
    <>
    <Intro onComplete={() => console.log('Intro complete')} />
     </>
  )
}

export default App
