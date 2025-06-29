import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

interface SlideData {
  title: string
  subtitle: string
  description: string
  bullets: string[]
  backgroundImage: string
}

interface SlideshowProps {
  slides: SlideData[]
  slideDuration?: number
  height?: string
  className?: string
}

export default function Slideshow({ 
  slides, 
  slideDuration = 6000,
  height = 'auto',
  className = ''
}: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
      setProgress(0)
    }, slideDuration)

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / 60), 100))
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [currentSlide, slides.length, slideDuration])

  return (
    <section
      className={`relative w-full bg-[#f5f5f5] overflow-hidden  ${className}`}
      style={{ minHeight: height }}
    >
      <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="flex-1 w-full max-w-xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 ddc-hardware leading-tight mb-3">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 poppins-semibold mb-3">
            {slides[currentSlide].subtitle}
          </p>
          <p className="text-sm md:text-base text-gray-600 poppins-regular leading-relaxed mb-4">
            {slides[currentSlide].description}
          </p>

          {slides[currentSlide].bullets.length > 0 && (
            <ul className="space-y-2">
              {slides[currentSlide].bullets.map((bullet, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-[#d7a900]" />
                  </span>
                  <span className="text-sm md:text-base text-gray-600 poppins-regular">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image */}
        <div className="flex-1 w-full max-w-xl">
          <div className="aspect-[4/3] md:aspect-auto w-full">
            <img
              src={slides[currentSlide].backgroundImage}
              alt="Slideshow Visual"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex space-x-3 md:space-x-6">
          {slides.map((_, index) => (
            <button
              key={index}
              className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden focus:outline-none cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setCurrentSlide(index)
                setProgress(0)
              }}
              type="button"
            >
              <div
                className={`h-full bg-[#d7a900] rounded-full transition-all duration-200 ease-out`}
                style={{
                  width: index === currentSlide ? `${progress}%` : '0%'
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export { type SlideData, type SlideshowProps }
