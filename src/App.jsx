import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Episodes from './components/Episodes'
import About from './components/About'
import Footer from './components/Footer'
import GamePage from './pages/GamePage'
import VacationGamePage from './pages/VacationGamePage'
import NugsPondPage from './pages/NugsPondPage'
import GamesPage from './pages/GamesPage'

function HomePage() {
  return (
    <>
      <Hero />
      <Episodes />
      <About />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="app">
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/vacation" element={<VacationGamePage />} />
              <Route path="/nugs-pond" element={<NugsPondPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
