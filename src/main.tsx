import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

// Import screens
import HomeScreen from './screens/containerScreens/homeScreen'
import PackagesScreen from './screens/containerScreens/packagesScreen'
// import AboutUs from './screens/staticScreens/aboutUs'
import UnderDevelopment from './screens/staticScreens/underDevelopment'

// Import navigation
import Navigation from './components/ui/Navigation'

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/packages" element={<PackagesScreen />} />
          <Route path="/about" element={<UnderDevelopment />} />
          <Route path="/dev" element={<UnderDevelopment />} />
          {/* Catch all route for undefined paths */}
          <Route path="*" element={<UnderDevelopment />} />
        </Routes>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
