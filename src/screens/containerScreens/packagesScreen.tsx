import React, { useState } from 'react'
import { useCachedPackages } from '../../hooks/useGlobalPackages'

const PackagesScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  
  // Use cached packages data (doesn't trigger fetch)
  const { data: packagesData, isLoading, error, isError } = useCachedPackages();
  const packages = packagesData?.packages || [];

  // Create package tabs from API data
  const packageTabs = packages.map((pkg, index) => ({
    id: index,
    title: pkg.title,
    isActive: index === 0
  }));

  // Use API data for package details
  const packageDetails = packages.map((pkg, index) => ({
    id: index,
    title: pkg.title.toUpperCase(),
    description: pkg.short_description,
    price: `₹${parseInt(pkg.price).toLocaleString()}/-`,
    image: pkg.image_url
  }));

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d7a900] mx-auto mb-4"></div>
          <p className="text-white">Loading packages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load packages</p>
          <p className="text-white">{error?.message}</p>
        </div>
      </div>
    );
  }

  // No packages available
  if (packages.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">No packages available at the moment.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Radial Gold Glow at Top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-gradient-radial from-[#d7a900]/20 via-[#d7a900]/8 to-transparent opacity-60"></div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">        {/* Header */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 ddc-hardware">
              CHOOSE PACKAGES
            </h1>
          </div>
        </section>        {/* Tab Navigation */}
        <section>
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="lg:hidden overflow-x-auto pb-4 mb-16">
              <div className="flex gap-4 min-w-max px-2">
                {packageTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-300 poppins-regular text-white whitespace-nowrap flex-shrink-0 ${
                      selectedTab === tab.id
                        ? 'bg-[#d7a900]/50 border border-[#d7a900] shadow-md shadow-[#d7a900]/50'
                        : 'bg-[#1e1e1e] border border-black hover:border-[#d7a900]/50'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Desktop: Flex wrap */}
            <div className="hidden lg:flex flex-wrap gap-4 mb-16 justify-center">
              {packageTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 poppins-regular text-white ${
                    selectedTab === tab.id
                      ? 'bg-[#d7a900]/50 border border-[#d7a900] shadow-md shadow-[#d7a900]/50'
                      : 'bg-[#1e1e1e] border border-black hover:border-[#d7a900]/50'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
        </section>        {/* Package Details */}
        <section className="pb-20">
          <div className="w-full lg:max-w-7xl lg:mx-auto overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">              {/* Image Section */}
              <div className="relative w-full lg:w-auto">
                <div className="rounded-none lg:rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={packageDetails[selectedTab]?.image || '/wordmark_dark.png'}
                    alt={packageDetails[selectedTab]?.title || 'Package'}
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>              

              {/* Content Section */}
              <div className="space-y-8 px-0 lg:px-0">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 ddc-hardware break-words">
                    {packageDetails[selectedTab]?.title}
                  </h2>

                  <div className="text-lg text-white/80 leading-relaxed poppins-regular whitespace-pre-line mb-10">
                    {packageDetails[selectedTab]?.description}
                  </div>                  
                  
                  {/* Dashed Separator */}
                  <div className="flex space-x-1 sm:space-x-2 mb-8 overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="w-2 sm:w-4 h-px bg-white/40 flex-shrink-0"></div>
                    ))}
                  </div>

                  {/* Price Section */}
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 poppins-regular text-lg">
                      Plan Price
                    </span>
                    <span className="text-4xl font-bold text-white ddc-hardware">
                      {packageDetails[selectedTab]?.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>              {/* App Download Section */}
            <div className="mt-16 flex justify-center lg:justify-end">
              <div className="space-y-6 text-center lg:text-left max-w-full">                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white ddc-hardware break-words">
                  BUY THE PACKAGE FROM <span className="text-[#d7a900]">TFC</span> APP
                </div>
                <div className="flex gap-3 justify-center lg:justify-start items-center">
                  <a 
                    href="#" 
                    className="block transition-transform hover:scale-105"
                  >
                    <img 
                      src="/play_store.png" 
                      alt="Get it on Google Play"
                      className="h-10 sm:h-12 w-auto"
                    />
                  </a>
                  <a 
                    href="#" 
                    className="block transition-transform hover:scale-105"
                  >
                    <img 
                      src="/app_store.png" 
                      alt="Download on the App Store"
                      className="h-10 sm:h-12 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div></section>
      </div>
    </div>
  )
}

export default PackagesScreen
