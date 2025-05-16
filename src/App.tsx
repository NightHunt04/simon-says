import { Routes, Route } from "react-router-dom"
import Landing from "./components/landing/Landing"
import Game from "./components/game/Game"

function App() {

  return (
    <div className="w-full flex items-start justify-center bg-[var(--background)]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App