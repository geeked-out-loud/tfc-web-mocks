import { Link, useLocation } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import SlidingUnderline from './SlidingUnderline'

export default function Navigation() {
   const location = useLocation()
   const [isScrolled, setIsScrolled] = useState(false)
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   
    const navItems = [
     { path: '/', label: 'Home' },
     { path: '/packages', label: 'Packages' },
     { path: '/about', label: 'About Us' },
   ]
   
   const navRefs = useRef<(HTMLAnchorElement | null)[]>([])
   const activeIndex = navItems.findIndex(item => item.path === location.pathname)

   useEffect(() => {
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 10)
     }
       window.addEventListener('scroll', handleScroll)
     return () => window.removeEventListener('scroll', handleScroll)
   }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between h-16">          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 my-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'}`}></span>
          </button>

          {/* Mobile Logo - Centered */}
          <div className="flex items-center space-x-2">
            <img 
              src="/monogram_light.png" 
              alt="TFC Logo" 
              className="h-8 w-auto"
            />
            <img 
              src="/wordmark_light.png" 
              alt="The Fit Collective" 
              className="h-8 w-auto"
            />
          </div>

          {/* Mobile Book Now Button */}
          <button
            onClick={() => {
              console.log('Book Now clicked')
            }}
            className="bg-[#d7a900] text-black px-6 py-1 rounded-md font-bold text-sm transition-all duration-300 shadow-xs hover:shadow-[0_4px_20px_rgba(215,169,0,0.3)] ddc-hardware"
          >
            BOOK
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between h-16">
          {/* Desktop Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/monogram_light.png" 
              alt="TFC Logo" 
              className="h-10 w-auto"
            />
            <img 
              src="/wordmark_light.png" 
              alt="The Fit Collective" 
              className="h-10 w-auto"
            />
          </div>          
          
          {/* Desktop Right section with Navigation Links and CTA Button */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="relative flex space-x-8">
              {/* Sliding border indicator */}
              <SlidingUnderline 
                activeIndex={activeIndex}
                itemRefs={navRefs}
                height="0.125"
              />
              
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  ref={(el) => { navRefs.current[index] = el }}
                  to={item.path}
                  className={`relative px-3 py-2 text-xl font-medium transition-all duration-300 ddc-hardware ${
                    location.pathname === item.path
                      ? 'text-black'
                      : 'text-black/30 hover:text-black/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Desktop CTA Button */}
            <button
              onClick={() => {
                console.log('Book Now clicked')
              }}
              className="bg-[#d7a900] text-black px-12 py-1 rounded-md font-bold text-lg transition-all duration-300 shadow-xs hover:shadow-[0_4px_20px_rgba(215,169,0,0.3)] ddc-hardware"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
      }`}>
        <div className="bg-white px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-lg font-medium transition-all duration-300 ddc-hardware ${
                location.pathname === item.path
                  ? 'text-black bg-gray-50 border-l-4 border-[#d7a900]'
                  : 'text-black/70 hover:text-black hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}