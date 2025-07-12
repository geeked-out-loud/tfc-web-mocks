import { Check } from 'lucide-react'
import { useState } from 'react'
import Slideshow from '../../components/ui/Slideshow'
import Card from '../../components/ui/Card'
import { useCachedPackages } from '../../hooks/useGlobalPackages'

export default function HomeScreen() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  
  // Use cached packages data (doesn't trigger fetch)
  const { data: packagesData, isLoading, error, isError } = useCachedPackages();
  const packages = packagesData?.packages || [];

  const slidesData = [
    {
      title: "PERSONALISED ASSESSMENT FIRST",
      subtitle: "Your journey starts with understanding YOU.",
      description: "We begin where it matters most with YOU. Book a posture, movement, and health assessment online or at our world-class facility. Your goals, restrictions, and current fitness levels help us craft your completely personalised fitness roadmap.",
      bullets: [],
      backgroundImage: "/bg3.1.png"
    },
    {
      title: "CHOOSE HOW YOU TRAIN",
      subtitle: "Flexibility that fits your life.",
      description: "Your schedule, your preferences, your comfort. Train your way:",
      bullets: [
        "Physical sessions at our facility",
        "Live online training with our expert coaches", 
        "Self-paced training through the TFC app with guided plans"
      ],
      backgroundImage: "/bg3.2.png"
    },
    {
      title: "FULLY CUSTOMISED PLAN",
      subtitle: "No copy-paste routines here",
      description: "Your body is unique — your plan should be too. Our experts create personalised workout and nutrition plans tailored to your needs. As you progress, your plans evolve — no stagnant programs, only continuous improvement.",
      bullets: [],
      backgroundImage: "/bg3.3.png"
    },
    {
      title: "CONTINUOUS PROGRESS MONITORING",
      subtitle: "We stay with you, every rep of the way",
      description: "We don't disappear after handing over a plan. With the TFC app, you can:",
      bullets: [
        "Track workouts & progress",
        "Upload exercise videos for expert feedback",
        "Log meals and get nutritionist reviews",
        "Book weekly reviews with your trainer"
      ],
      backgroundImage: "/bg3.4.png"
    }
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white m-0 p-0 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d7a900] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white m-0 p-0 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load packages</p>
          <p className="text-gray-600">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white m-0 p-0">
      {/* Hero Section */}
<div className="relative w-full bg-white overflow-hidden min-h-[350px] sm:min-h-[33vh] md:min-h-[66vh] flex items-center">
  {/* Background Image Full Height */}
  <img 
    src="/bg1.png" 
    alt="Fitness Background" 
    className="absolute top-0 right-0 h-full w-full object-cover z-10 md:w-auto md:object-cover"
    style={{ minHeight: '350px' }}
  />

  {/* White Gradient Overlay */}
  <div
    className="absolute inset-0 z-20 pointer-events-none"
    style={{
      background: "linear-gradient(to right, white 0%, white 60%, rgba(255,255,255,0.85) 75%, rgba(255,255,255,0.6) 85%, transparent 100%)",
      width: "100%",
      maxWidth: "900px",
      minWidth: "60vw"
    }}
  />

  {/* Text Content */}
  <div className="relative z-30 flex items-center w-full">
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-xl text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 ddc-hardware leading-tight">
          <span className="inline">WELCOME TO </span>
          <span className="inline" style={{ color: '#d7a900' }}>TFC</span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-gray-600 poppins-semibold mb-6">
          Your Fitness. Fully Personalised
        </p>
      </div>
    </div>
  </div>
</div>
      {/* Why Choose TFC Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-1 lg:order-1">
              <img 
                src="/Group 191.png" 
                alt="TFC Training" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="order-2 lg:order-2 lg:ml-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 ddc-hardware">
                WHY CHOOSE TFC?
              </h2>
              <div className="space-y-6">
                {[
                  "Personalised Movement & Posture Assessments",
                  "Flexible Training — Physical, Online or Self-Paced",
                  "Expert-Crafted Workout & Nutrition Plans",
                  "Continuous Progress Tracking & Feedback",
                  "Real Coaches, Real Support, Real Accountability"
                ].map((item, idx) => (
                  <div className="flex items-start space-x-4" key={idx}>
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-lg text-black/50 poppins-regular">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Component */}
        <Slideshow className="px-4 sm:px-6 lg:px-8 py-24" slides={slidesData} />

      {/* Choose Packages Section */}
      <div className="bg-black pt-16 pb-16 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#d7a900]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-12 ddc-hardware">
            CHOOSE PACKAGES
          </h2>
          <div className="overflow-x-auto pb-12 scrollbar-hide">
            <div className="flex space-x-8 min-w-max px-4">
              {packages.map((pkg, i) => (
                <div key={pkg.id} className="w-[22rem] flex-shrink-0">
                  <Card 
                    heading={pkg.title}
                    description={pkg.short_description}
                    price={`₹${(parseInt(pkg.price) / 100).toLocaleString()}`}
                    image={pkg.image_url}
                    isSelected={selectedCard === i} 
                    onClick={() => setSelectedCard(selectedCard === i ? null : i)} 
                    onBuyNow={() => console.log('Buy', pkg.title)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Trainers & Nutritionists Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-1 lg:order-1">
              <img 
                src="/experts.png" 
                alt="Expert Trainers" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="order-2 lg:order-2">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ddc-hardware">
                EXPERT TRAINERS & NUTRITIONISTS
              </h3>
              <h4 className="text-lg lg:text-xl text-gray-600 poppins-semibold mb-6">
                Real people. Real expertise. Real accountability.
              </h4>
              <p className="text-lg text-gray-600 poppins-regular leading-relaxed">
                Our certified trainers and nutritionists don't just guide you — they partner with you. Expect proactive check-ins, real-time feedback, and constant plan adjustments to keep you moving forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download the TFC App Section */}
      <div className="bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div className="order-2 lg:order-1 -ml-8 lg:-ml-16 flex justify-center">
              <img 
                src="/mockup.png" 
                alt="TFC App Mockup" 
                className="w-full h-auto object-contain max-w-sm"
              />
            </div>
            <div className="order-1 lg:order-2 py-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 ddc-hardware">
                DOWNLOAD THE <span style={{ color: '#d7a900' }}>TFC</span> APP
              </h2>
              <h3 className="text-base lg:text-lg text-gray-600 poppins-semibold mb-8">
                Your personalised fitness companion — always with you.
              </h3>
              <p className="text-base text-gray-600 poppins-regular leading-relaxed mb-12">
                Track your workouts, access your plans, log meals, upload videos, and connect with your coaches — anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-block hover:opacity-90 transition-opacity">
                  <img src="/play_store.png" alt="Get it on Google Play" className="h-14 w-auto" />
                </a>
                <a href="#" className="inline-block hover:opacity-90 transition-opacity">
                  <img src="/app_store.png" alt="Download on the App Store" className="h-14 w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
