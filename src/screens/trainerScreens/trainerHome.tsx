import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronRight, Bell, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTrainerProfile, useTrainerAppointments } from '../../hooks/useTrainer';
import NotificationDrawer from '../../components/ui/NotificationDrawer';
import '../../components/ui/scrollbar-hide.css';
import type { Appointment } from '../../hooks/useTrainer';

interface DashboardStats {
  clientsCount: number;
  mealLogsCount: number;
  appointmentsCount: number;
}

const TrainerHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    mealLogsCount: 0,
    appointmentsCount: 0
  });

  // Define our tab types
  const packageTabs = [
    { id: 'all', title: 'All' },
    { id: 'physical', title: 'Physical live' },
    { id: 'online', title: 'Online live' },
    { id: 'exercise', title: 'Exercise' },
    { id: 'nutrition', title: 'Nutrition' }
  ];
  
  // For fallback if API fails
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // Use the trainer profile hook
  const { 
    data: trainerProfileData, 
    isLoading: isLoadingTrainer, 
    error: trainerError 
  } = useTrainerProfile();

  // Use the trainer appointments hook with filters based on activeTab
  const { 
    data: appointmentsData, 
    isLoading: isLoadingAppointments,
    error: appointmentsError
  } = useTrainerAppointments(
    activeTab !== 'all' ? {
      sessionType: (
        activeTab === 'physical' || activeTab === 'online' 
          ? activeTab as 'physical' | 'online'
          : activeTab === 'exercise' || activeTab === 'nutrition'
            ? 'self'
            : undefined
      ),
      type: (
        activeTab === 'exercise' 
          ? 'EXERCISE' 
          : activeTab === 'nutrition' 
            ? 'NUTRITION' 
            : undefined
      )
    } : undefined
  );

  // Update trainer data when profile is loaded
  useEffect(() => {
    setIsLoading(isLoadingTrainer);
    
    if (trainerError) {
      const err = trainerError as Error;
      setError(err.message);
      
      // Handle special case when navigating too soon during registration
      if (err.message.includes('401') || err.message.includes('unauthorized')) {
        const navigateBackToAuth = () => {
          console.log('Redirecting back to trainer login due to auth issues...');
          navigate('/trainer/login');
        };
        setTimeout(navigateBackToAuth, 2000);
      }
    }
    
    if (trainerProfileData) {
      // Update stats with data from the trainer profile
      setStats({
        clientsCount: trainerProfileData.clients || 0,
        mealLogsCount: trainerProfileData.mealLogs || 0,
        appointmentsCount: appointmentsData?.appointments?.length || 0
      });
    }
  }, [trainerProfileData, isLoadingTrainer, trainerError, user, navigate]);;

  // Update filtered appointments when appointments data changes
  useEffect(() => {
    setIsLoading(isLoadingAppointments);
    
    if (appointmentsError) {
      setError((appointmentsError as Error).message);
    }
    
    if (appointmentsData?.appointments) {
      // API already filters the appointments based on the query params
      // So we can just use the data directly
      setFilteredAppointments(appointmentsData.appointments);
    }
  }, [appointmentsData, isLoadingAppointments, appointmentsError]);

  // Function to scroll to the active package type
  const scrollToActiveTab = () => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`button[data-id="${activeTab}"]`);
      if (activeElement) {
        const containerRect = scrollRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        
        // Calculate the center position
        const targetScrollLeft = 
          activeRect.left + activeRect.width / 2 - containerRect.left - containerRect.width / 2;
        
        scrollRef.current.scrollTo({
          left: scrollRef.current.scrollLeft + targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll to active tab when it changes
  useEffect(() => {
    scrollToActiveTab();
  }, [activeTab]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/trainer/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main container with responsive width */}
      <div className="max-w-7xl mx-auto min-h-screen bg-white shadow-lg md:shadow-xl lg:flex lg:flex-row">
        {/* Left sidebar for larger screens */}
        <div className="lg:w-72 xl:w-80 lg:border-r border-gray-200 hidden lg:block lg:p-4">
          <div className="flex items-center mb-6">
            <img 
              src="/monogram_light.png" 
              alt="TFC Logo" 
              className="h-10 w-auto"
            />
            <img 
              src="/wordmark_light.png" 
              alt="The Fit Collective" 
              className="h-8 w-auto ml-2"
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden mr-3">
                {trainerProfileData?.image ? (
                  <img 
                    src={trainerProfileData.image}
                    alt={user?.fullName || 'Trainer'} 
                    className="h-full w-full object-cover"
                  />
                ) : user?.fullName ? (
                  <div className="h-full w-full flex items-center justify-center bg-yellow-500 text-white text-xl font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-300">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.fullName || 'Trainer'}
                </h2>
                <p className="text-gray-500 text-sm">{trainerProfileData?.experience_years} years experience</p>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {trainerProfileData?.bio || "Trainer profile"}
            </p>
          </div>
          
          {trainerProfileData?.certifications && trainerProfileData.certifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {trainerProfileData.certifications.map((cert, index) => (
                  <span key={index} className="bg-gray-100 text-xs py-1 px-2 rounded-full text-gray-800">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => navigate('/trainer/assigned-clients')}
              className="w-full bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Assigned Clients</h4>
                  <p className="text-2xl font-bold text-gray-900 ddc-hardware">{stats.clientsCount}</p>
                  <p className="text-xs text-gray-500 mt-1">You have {stats.clientsCount} assigned clients</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
            <button 
              onClick={() => alert('Meal logs feature coming soon!')}
              className="w-full bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Meal logs</h4>
                  <p className="text-2xl font-bold text-gray-900 ddc-hardware">{stats.mealLogsCount}</p>
                  <p className="text-xs text-gray-500 mt-1">3 meals awaiting for response</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors mt-auto"
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="p-4 flex justify-between items-center border-b border-gray-100 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <img 
                  src="/monogram_light.png" 
                  alt="TFC Logo" 
                  className="h-8 w-auto"
                />
                <img 
                  src="/wordmark_light.png" 
                  alt="The Fit Collective" 
                  className="h-6 w-auto ml-2"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsNotificationDrawerOpen(true)}
                className="flex items-center justify-center relative"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <LogOut 
                className="h-5 w-5 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" 
                onClick={handleLogout}
                aria-label="Logout"
              />
            </div>
          </header>
          
          {/* Mobile greeting */}
          <div className="p-4 flex items-center space-x-4 lg:hidden">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
              {trainerProfileData?.image ? (
                <img 
                  src={trainerProfileData.image}
                  alt={user?.fullName || 'Trainer'} 
                  className="h-full w-full object-cover"
                />
              ) : user?.fullName ? (
                <div className="h-full w-full flex items-center justify-center bg-yellow-500 text-white font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Trainer'}
              </h2>
              <p className="text-gray-500 text-sm">
                {trainerProfileData?.bio ? trainerProfileData.bio.slice(0, 50) + (trainerProfileData.bio.length > 50 ? '...' : '') : "Here's what's happening today"}
              </p>
            </div>
          </div>
          
          {/* Desktop header with larger screens title */}
          <div className="hidden lg:flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">{getGreeting()}, {user?.fullName?.split(' ')[0] || 'Trainer'}</p>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="flex items-center justify-center relative"
              aria-label="Open notifications"
            >
              <Bell className="h-6 w-6 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>
          </div>
          
          {/* Mobile stats cards - Assigned Clients and Meal logs */}
          <div className="px-4 py-4 grid grid-cols-2 gap-4 lg:hidden">
            <button 
              onClick={() => navigate('/trainer/assigned-clients')}
              className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Assigned Clients</h4>
                  <p className="text-2xl font-bold text-gray-900 ddc-hardware">{stats.clientsCount}</p>
                  <p className="text-xs text-gray-500 mt-1">You have {stats.clientsCount} assigned clients</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
            <button 
              onClick={() => alert('Meal logs feature coming soon!')}
              className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Meal logs</h4>
                  <p className="text-2xl font-bold text-gray-900 ddc-hardware">{stats.mealLogsCount}</p>
                  <p className="text-xs text-gray-500 mt-1">3 meals awaiting for response</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          </div>
          
          {/* Tabs - Responsive for all screen sizes */}
          <div className="px-4 md:px-6 py-4">
            <div 
              ref={scrollRef}
              className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {packageTabs.map((tab) => (
                <button
                  key={tab.id}
                  data-id={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-md text-center text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#262012] text-white' 
                      : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
          
          {/* Appointments section */}
          <div className="flex-1 px-4 md:px-6 pb-20 md:pb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg poppins-medium">Today's Appointments</h3>
                <p className="text-sm text-gray-500 poppins-regular">appointments scheduled today</p>
              </div>
              {isLoading ? (
                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 ddc-hardware">
                    {filteredAppointments.length.toString().padStart(2, '0')}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-md mb-4">
                <p className="text-red-600">{error}</p>
                <button 
                  className="text-xs text-red-700 font-medium mt-2 underline"
                  onClick={() => setActiveTab('all')}
                >
                  Reset filters
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
              </div>
            ) : (
              <div className="h-96 overflow-y-auto scrollbar-hide">
                <div className="space-y-4 mt-2">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">No appointments match the selected filter</p>
                      <button 
                        className="mt-3 text-sm text-yellow-600 underline"
                        onClick={() => setActiveTab('all')}
                      >
                        View all appointments
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                      {filteredAppointments.map((appointment) => (
                        <div 
                          key={appointment.id} 
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center">
                            <div className="w-14 h-16 flex flex-col items-center justify-center bg-gray-100 rounded-md mr-4">
                              <span className="text-sm font-bold">{format(new Date(appointment.date), 'dd')}</span>
                              <span className="text-xs">{format(new Date(appointment.date), 'MMM')}</span>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs mr-2">
                                  <Users className="h-3 w-3" />
                                </div>
                                <p className="text-base font-bold">{appointment.clientName}</p>
                              </div>
                              <p className="text-xs text-gray-500">Appointment {appointment.appointmentNumber}</p>
                              <span 
                                className={`inline-block mt-2 text-white text-xs py-1 px-2 rounded ${
                                  appointment.type === 'EXERCISE' ? 'bg-yellow-500' :
                                  appointment.type === 'NUTRITION' ? 'bg-green-500' :
                                  'bg-blue-500'
                                }`}
                              >
                                {appointment.type}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen} 
        onClose={() => setIsNotificationDrawerOpen(false)} 
      />
    </div>
  );
};

export default TrainerHome;
