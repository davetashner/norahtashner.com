import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Episodes from './components/Episodes'
import About from './components/About'
import Footer from './components/Footer'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">
          <Hero />
          <Episodes />
          <About />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
