import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './services/queryClient'
import './index.css'

// Import screens
import HomeScreen from './screens/containerScreens/homeScreen'
import PackagesScreen from './screens/containerScreens/packagesScreen'
import AboutUs from './screens/staticScreens/aboutUs'
import UnderDevelopment from './screens/staticScreens/underDevelopment'
import TrainerAuth from './screens/trainerScreens/trainerAuth'
import TrainerHome from './screens/trainerScreens/trainerHome'

// Import navigation
import Navigation from './components/ui/Navigation'
import { useGlobalPackages } from './hooks/useGlobalPackages'
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext'

function GlobalDataLoader() {
  // Prefetch packages data at app level
  useGlobalPackages();
  return null;
}

// Import SessionManager
import SessionManager from './components/SessionManager'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <GlobalDataLoader />
        <SessionManager />
        <Routes>
          {/* Trainer routes without navigation */}
          <Route path="/trainer/login" element={<TrainerAuth />} />
          <Route path="/trainer/signup" element={<TrainerAuth />} />
          <Route 
            path="/trainer/dashboard" 
            element={
              <ProtectedRoute>
                <TrainerHome />
              </ProtectedRoute>
            } 
          />
          
          {/* Public routes with navigation */}
          <Route
            path="*"
            element={
              <>
                <Navigation />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/packages" element={<PackagesScreen />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/dev" element={<UnderDevelopment />} />
                    {/* Catch all route for undefined public paths */}
                    <Route path="*" element={<HomeScreen />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
