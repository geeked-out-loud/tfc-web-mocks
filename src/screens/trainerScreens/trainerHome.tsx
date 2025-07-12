import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, Bell, LogOut, Loader2, Calendar, Coffee } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../../services/api';

interface Appointment {
  id: string;
  date: Date;
  clientName: string;
  appointmentNumber: number;
  type: 'EXERCISE' | 'NUTRITION' | 'ASSESSMENT';
  sessionType: 'physical' | 'online' | 'self';
}

interface DashboardStats {
  clientsCount: number;
  mealLogsCount: number;
  appointmentsCount: number;
}

interface TrainerData {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  specializations?: string[];
  clients?: number;
  mealLogs?: number;
  appointments?: number;
}

const TrainerHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'physical' | 'online' | 'self'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  
  const [stats, setStats] = useState<DashboardStats>({
    clientsCount: 0,
    mealLogsCount: 0,
    appointmentsCount: 0
  });

  const allAppointments: Appointment[] = [
    {
      id: '1',
      date: new Date(),
      clientName: 'JOHN SMITH',
      appointmentNumber: 1,
      type: 'EXERCISE',
      sessionType: 'physical'
    },
    {
      id: '2',
      date: new Date(),
      clientName: 'MARY JOHNSON',
      appointmentNumber: 2,
      type: 'NUTRITION',
      sessionType: 'online'
    },
    {
      id: '3',
      date: new Date(),
      clientName: 'ABHIMANYU',
      appointmentNumber: 3,
      type: 'ASSESSMENT',
      sessionType: 'physical'
    }
  ];

  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(allAppointments);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const sessionService = await import('../../services/sessionService').then(module => module.default);
        const token = sessionService.getToken();
        const response = await api.get('/trainers/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setTrainerData(response.data);
        
        setStats({
          clientsCount: response.data.clients || 0,
          mealLogsCount: response.data.mealLogs || 0,
          appointmentsCount: response.data.appointments || 0
        });
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching trainer data:', err);
        
        if (err.response) {
          if (err.response.status === 400) {
            const errorMsg = err.response.data?.message || err.response.data?.error || 'Invalid request format';
            setError(`Bad request (400): ${errorMsg}`);
          } else if (err.response.status === 401) {
            setError('Your session has expired. Please log out and log in again.');
          } else if (err.response.status === 404) {
            setError('Trainer profile not found. Please contact support.');
          } else {
            setError(`Server error (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`);
          }
        } else if (err.request) {
          setError('Could not connect to server. Please check your internet connection.');
        } else {
          setError('Failed to load trainer data. Please try again.');
        }
        
        setIsLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
        if (activeTab === 'all') {
          setFilteredAppointments(allAppointments);
        } else {
          setFilteredAppointments(
            allAppointments.filter(appointment => appointment.sessionType === activeTab)
          );
        }
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to load appointments. Please try again.');
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/trainer/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto min-h-screen bg-white shadow-sm">
        <header className="p-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img 
              src="/monogram_dark.png" 
              alt="TFC Logo" 
              className="h-7 w-auto"
            />
            <h1 className="text-lg font-bold ddc-hardware text-yellow-500">THE FIT COLLECTIVE</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-5 w-5 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" />
            <LogOut 
              className="h-5 w-5 text-gray-700 cursor-pointer hover:text-yellow-500 transition-colors" 
              onClick={handleLogout}
              aria-label="Logout"
            />
          </div>
        </header>
        <div className="p-4 pb-6 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            {trainerData?.profileImage ? (
              <img 
                src={trainerData.profileImage}
                alt={trainerData.fullName} 
                className="h-full w-full object-cover"
              />
            ) : trainerData?.fullName ? (
              <div className="h-full w-full flex items-center justify-center bg-yellow-500 text-white font-bold">
                {trainerData.fullName.charAt(0).toUpperCase()}
              </div>
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
              {getGreeting()}, {trainerData?.fullName?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Trainer'}
            </h2>
            <p className="text-gray-500 text-sm">Here's what's happening today</p>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-[#262012] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('physical')}
              className={`px-2 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'physical' 
                  ? 'bg-[#262012] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Physical live
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-2 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'online' 
                  ? 'bg-[#262012] text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Online live
            </button>
          </div>
        </div>
        <div className="px-4 pb-6 grid grid-cols-2 gap-2">
          <button className="py-3 px-4 border rounded-md text-left text-sm font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span>Self training - Exercise</span>
          </button>
          <button className="py-3 px-4 border rounded-md text-left text-sm font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors">
            <Coffee className="h-4 w-4 text-gray-600" />
            <span>Self training - Nutrition</span>
          </button>
        </div>
        <div className="px-4 space-y-4">

          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Assigned Clients</h3>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-baseline">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats.clientsCount}</p>
                  <p className="text-xs text-gray-500 ml-2">You have {stats.clientsCount} assigned clients</p>
                </>
              )}
            </div>
          </div>

          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Meal logs</h3>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-baseline">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold">{stats.mealLogsCount.toString().padStart(2, '0')}</p>
                  <p className="text-xs text-gray-500 ml-2">{stats.mealLogsCount} meals awaiting response</p>
                </>
              )}
            </div>
          </div>

          {trainerData?.specializations && trainerData.specializations.length > 0 && (
            <div className="pb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Specializations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trainerData.specializations.map((spec, index) => (
                  <span key={index} className="bg-gray-100 text-xs py-1 px-2 rounded-full text-gray-800">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 mt-4 pb-16">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
            {isLoading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold">{stats.appointmentsCount.toString().padStart(2, '0')}</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-4">Appointments scheduled today</p>

          {error && (
            <div className="bg-red-50 p-3 rounded-md mb-3">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                className="text-xs text-red-700 font-medium mt-1"
                onClick={() => setActiveTab('all')}
              >
                Try Again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No appointments match the selected filter</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-16 flex flex-col items-center justify-center bg-gray-100 rounded-md mr-3">
                        <span className="text-sm font-bold">{format(appointment.date, 'dd')}</span>
                        <span className="text-xs">{format(appointment.date, 'MMM')}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs mr-1">
                            <Users className="h-3 w-3" />
                          </div>
                          <p className="text-sm font-bold">{appointment.clientName}</p>
                        </div>
                        <p className="text-xs text-gray-500">Appointment {appointment.appointmentNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`text-white text-xs py-1 px-2 rounded mr-2 ${
                          appointment.type === 'EXERCISE' ? 'bg-yellow-500' :
                          appointment.type === 'NUTRITION' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                      >
                        {appointment.type}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerHome;
