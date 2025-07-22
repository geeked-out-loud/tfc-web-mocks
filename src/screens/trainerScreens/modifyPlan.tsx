import React, { useState } from 'react';
import { X, Play, Search, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock video data - simple carousel
const allVideos = [
  { id: 'video-001', title: '10 TIPS FOR BICEPS', thumbnail: '/abtBG1.png', isSelected: true },
  { id: 'video-002', title: 'CHEST WORKOUT FUNDAMENTALS', thumbnail: '/exercise.jpg', isSelected: false },
  { id: 'video-003', title: 'LEG DAY ESSENTIALS', thumbnail: '/exercise_nutrition.jpg', isSelected: true },
  { id: 'video-004', title: 'HIIT CARDIO BLAST', thumbnail: '/live_sessions.jpg', isSelected: false },
  { id: 'video-005', title: 'BICEPS WORKOUT BASICS', thumbnail: '/abtBG1.png', isSelected: true },
  { id: 'video-006', title: 'PUSH UP VARIATIONS', thumbnail: '/exercise.jpg', isSelected: false },
  { id: 'video-007', title: 'SQUAT TECHNIQUE GUIDE', thumbnail: '/exercise_nutrition.jpg', isSelected: false },
  { id: 'video-008', title: 'CARDIO FOR FAT LOSS', thumbnail: '/live_sessions.jpg', isSelected: true }
];

const ModifyPlan: React.FC = () => {
  const navigate = useNavigate();
  const [activeToggle, setActiveToggle] = useState<'videos' | 'meal'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<string[]>(() => {
    // Initialize with all selected videos
    return allVideos.filter(video => video.isSelected).map(video => video.id);
  });
  // Add Meal Modal state
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);

  const handleClose = () => {
    navigate(-1); // Go back to previous screen
  };

  const removeVideoFromPlan = (videoId: string) => {
    setSelectedVideos(prev => prev.filter(id => id !== videoId));
  };

  const addVideoToPlan = (videoId: string) => {
    setSelectedVideos(prev => [...prev, videoId]);
  };

  const filteredVideos = allVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <button 
            onClick={handleClose}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ddc-hardware">MODIFY PLAN</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Toggle Section - Sliding toggle */}
        <div className="relative flex mb-6 flex-shrink-0 bg-transparent border border-gray-400 rounded-2xl">
          {/* Sliding background */}
          <div 
            className={`absolute top-0 bottom-0 w-1/2 rounded-2xl transition-transform duration-300 ease-in-out`}
            style={{ 
              backgroundColor: '#262012',
              transform: activeToggle === 'videos' ? 'translateX(0%)' : 'translateX(100%)'
            }}
          />
          
          <button
            onClick={() => setActiveToggle('videos')}
            className={`relative z-10 flex-1 py-6 px-1 text-center font-bold transition-colors duration-300 rounded-md ${
              activeToggle === 'videos'
                ? 'text-white'
                : 'text-gray-700'
            }`}
          >
            VIDEOS
          </button>
          <button
            onClick={() => setActiveToggle('meal')}
            className={`relative z-10 flex-1 py-6 px-1 text-center font-bold transition-colors duration-300 rounded-md ${
              activeToggle === 'meal'
                ? 'text-white'
                : 'text-gray-700'
            }`}
          >
            MEAL
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeToggle === 'videos' ? (
            <div className="h-full overflow-y-auto">
              {/* Section Title */}
              <h2 className="text-lg font-medium text-gray-900 mb-4">Included in the plan</h2>
              
              {/* Videos Carousel - Horizontal scroll of selected videos */}
              <div className="overflow-x-auto mb-8">
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {allVideos.filter(video => selectedVideos.includes(video.id)).map((video) => (
                    <div 
                      key={video.id} 
                      className="relative bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0"
                      style={{ width: '200px' }}
                    >
                      {/* Remove Button - Top left corner */}
                      <button
                        onClick={() => removeVideoFromPlan(video.id)}
                        className="absolute top-2 left-2 z-20 transition-all hover:scale-110"
                      >
                        <X className="h-5 w-5 text-white drop-shadow-lg" strokeWidth={3} />
                      </button>

                      {/* Video Thumbnail */}
                      <div className="relative aspect-video">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-3">
                        <h3 className="font-bold text-base text-gray-900 ddc-hardware leading-tight">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Library Section */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Video library</h2>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in library"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                {/* Library Videos */}
                <div className="space-y-4 px-4">
                  {filteredVideos.map((video) => (
                    <div 
                      key={video.id} 
                      className="flex bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* Video Thumbnail - Left side, no padding, full height */}
                      <div className="relative w-32 flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="h-6 w-6 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Video Info and Button - Right side with padding */}
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="font-bold text-xl text-gray-900 ddc-hardware mb-2">
                          {video.title}
                        </h3>
                        <p className="text-base text-gray-500 mb-4 flex-1">
                          Follow these tips to build strength in your biceps
                        </p>
                        
                        {/* Add Button */}
                        {!selectedVideos.includes(video.id) && (
                          <button
                            onClick={() => addVideoToPlan(video.id)}
                            className="self-start px-8 py-3 text-white font-bold rounded-2xl transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#262012' }}
                          >
                            + ADD
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Included in the plan - Empty state */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Included in the plan</h2>
                
                {/* Empty state */}
                <div className="flex flex-col items-center justify-center py-12">
                  {/* Crossed out utensils icon */}
                  <div className="relative mb-4">
                    <Utensils className="h-16 w-16 text-gray-300" strokeWidth={1} />
                    {/* Cross line */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-0.5 bg-gray-400 rotate-45"></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-center">No nutrition plan added</p>
                </div>
              </div>

              {/* Library Section */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Library</h2>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search in library"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                {/* Add Meal Button */}
                <div className="px-4 mb-6">
                  <button
                    className="w-full px-8 py-3 text-white font-bold rounded-2xl transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#262012' }}
                    onClick={() => setIsAddMealModalOpen(true)}
                  >
                    + ADD MEAL
                  </button>
                </div>

                {/* No records message */}
                <div className="text-center py-8">
                  <p className="text-gray-500">No previous record found</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Save Button */}
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={() => {
              // Handle save logic here
              console.log('Selected videos:', selectedVideos);
              // Could navigate back or show success message
            }}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-2xl shadow-lg transition-colors"
          >
            SAVE CHANGES
          </button>
        </div>

        {/* Add Meal Modal */}
        {isAddMealModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsAddMealModalOpen(false)}
            />
            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-t-3xl animate-slide-up-enter overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setIsAddMealModalOpen(false)}
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              {/* Header */}
              <div className="text-center py-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 ddc-hardware">ADD MEAL</h2>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col gap-6">
                {/* Upload PDF */}
                <div className="border border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-2">
                      {/* Camera Icon */}
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                        <path d="M4 7h16M4 7l2-3h12l2 3M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M9 11a3 3 0 106 0 3 3 0 00-6 0z"/>
                      </svg>
                    </div>
                    <span className="text-gray-500 text-sm">Upload pdf</span>
                  </div>
                </div>
                {/* Date Fields */}
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Date from</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 bg-transparent py-2 outline-none"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-2">To date</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 bg-transparent py-2 outline-none"
                    placeholder=""
                  />
                </div>
                {/* Message Field */}
                <div>
                  <label className="block text-gray-500 text-sm mb-2">Message</label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-400 bg-transparent py-2 outline-none"
                    placeholder=""
                  />
                </div>
                {/* Submit Button */}
                <button
                  className="w-full py-3 rounded-lg font-bold text-center bg-gray-400 text-white ddc-hardware"
                  style={{ letterSpacing: 2 }}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifyPlan;
