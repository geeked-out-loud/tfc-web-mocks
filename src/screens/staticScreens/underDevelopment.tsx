export default function UnderDevelopment() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* TFC Logo */}
        <div className="mb-12">
          <img 
            src="/wordmark_dark.png" 
            alt="TFC Wordmark" 
            className="h-16 w-auto mx-auto opacity-80"
          />
        </div>
        
        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 ddc-hardware">
            Under Works
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 poppins-semibold mb-8">
            We're building something amazing for you.
          </p>
        </div>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-[#d7a900] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#d7a900] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-[#d7a900] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
        
        {/* Footer Text */}
        <p className="text-sm text-gray-400 poppins-regular">
          Check back soon for updates
        </p>
      </div>
    </div>
  )
}
