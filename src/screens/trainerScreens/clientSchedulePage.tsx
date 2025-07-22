import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import '../../components/ui/scrollbar-hide.css';

// Mock appointment data - only upcoming appointments
const mockAppointments = [
  {
    id: 'apt-001',
    date: new Date(2025, 6, 25), // July 25, 2025 (upcoming - month 6 = July)
    appointmentNumber: 2,
    type: 'EXERCISE',
    status: 'SCHEDULED'
  },
  {
    id: 'apt-002',
    date: new Date(2025, 6, 30), // July 30, 2025 (upcoming - month 6 = July)
    appointmentNumber: 3,
    type: 'NUTRITION',
    status: 'SCHEDULED'
  },
  {
    id: 'apt-003',
    date: new Date(2025, 7, 5), // August 5, 2025 (upcoming - month 7 = August)
    appointmentNumber: 4,
    type: 'EXERCISE',
    status: 'SCHEDULED'
  }
];

const ClientSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 6, 25)); // July 25, 2025 (first appointment)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeToggle, setActiveToggle] = useState<'classes' | 'nutrition'>('classes');

  // Generate available dates for the current month (same logic as book appointment modal)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    const currentDate = new Date(currentYear, currentMonth, 1);
    
    // Find the first available date (today or later in the selected month)
    let startDate;
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
      startDate = today.getDate();
    } else if (currentDate > today) {
      startDate = 1;
    } else {
      return []; // Past month, no available dates
    }
    
    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Generate all dates from startDate to end of month
    for (let day = startDate; day <= lastDayOfMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dates.push({
        date: date,
        day: date.getDate(),
        dayName: dayNames[date.getDay()]
      });
    }
    return dates;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleBackPress = () => {
    navigate(`/trainer/client/${clientId}`);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const availableDates = generateAvailableDates();

  const getSelectedAppointment = () => {
    if (!selectedDate) return null;
    return mockAppointments.find(apt => isSameDay(apt.date, selectedDate));
  };

  const selectedAppointment = getSelectedAppointment();

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full px-4 py-6 sm:max-w-4xl sm:mx-auto sm:px-4 sm:py-6">
        {/* Arrow in one row */}
        <div className="flex items-center mb-4 flex-shrink-0">
          <button 
            onClick={handleBackPress}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        {/* Schedule Header and Month Navigation in one row */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 ddc-hardware">SCHEDULE</h1>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 ddc-hardware">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Date Selection and Appointment in one section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex-shrink-0">

          {/* Date Selection - Horizontal scroll */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {availableDates.map((dateObj) => (
              <button
                key={dateObj.date.getTime()}
                onClick={() => setSelectedDate(dateObj.date)}
                className={`relative flex-shrink-0 py-4 px-3 text-center transition-colors min-w-[60px] ${
                  selectedDate && selectedDate.getTime() === dateObj.date.getTime()
                    ? 'text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {/* Top golden bar for selected date */}
                {selectedDate && selectedDate.getTime() === dateObj.date.getTime() && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-500 rounded-full"></div>
                )}
                
                <div className="text-2xl font-bold mb-1 ddc-hardware">{dateObj.day}</div>
                <div className="text-sm">{dateObj.dayName}</div>
                
                {/* Bottom golden bar for selected date */}
                {selectedDate && selectedDate.getTime() === dateObj.date.getTime() && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Appointment Card - Inside the same section */}
          {selectedDate && selectedAppointment && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                    <span className="text-xl font-bold text-gray-900 ddc-hardware">
                      {format(selectedAppointment.date, 'dd')}
                    </span>
                    <span className="text-xs text-gray-600">
                      {format(selectedAppointment.date, 'MMM')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 poppins-medium">
                      Appointment {selectedAppointment.appointmentNumber}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                        {selectedAppointment.type}
                      </span>
                      <span className={`
                        inline-block text-xs font-medium px-2 py-1 rounded
                        ${selectedAppointment.status === 'SCHEDULED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        ● {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Section - Like appointment/gallery tabs */}
        <div className="bg-white rounded-lg shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveToggle('classes')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeToggle === 'classes'
                  ? 'text-gray-900 border-b-2 border-yellow-500 bg-yellow-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              CLASSES
            </button>
            <button
              onClick={() => setActiveToggle('nutrition')}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeToggle === 'nutrition'
                  ? 'text-gray-900 border-b-2 border-yellow-500 bg-yellow-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              NUTRITION
            </button>
          </div>

          {/* Scrollable Content Area - Only this section scrolls */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
              {activeToggle === 'classes' ? (
                <div className="space-y-3">
                  {/* Classes content - Image card style like screenshot */}
                  <div className="relative rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/abtBG1.png" 
                      alt="10 Tips for Biceps"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="text-white text-base sm:text-lg font-bold ddc-hardware mb-1">
                            10 TIPS FOR BICEPS
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm">
                            Follow these tips to build strength in your biceps
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                            ● LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/abtBG1.png" 
                      alt="Upper Body Workout"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="text-white text-base sm:text-lg font-bold ddc-hardware mb-1">
                            UPPER BODY STRENGTH
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm">
                            Complete workout for upper body development
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            ● COMPLETE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Nutrition content - Image card style like screenshot */}
                  <div className="relative rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/abtBG1.png" 
                      alt="Nutrition Plan"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="text-white text-base sm:text-lg font-bold ddc-hardware mb-1">
                            NUTRITION BASICS
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm">
                            Essential nutrition guidelines for optimal results
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                            ● LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/abtBG1.png" 
                      alt="Meal Planning"
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="text-white text-base sm:text-lg font-bold ddc-hardware mb-1">
                            MEAL PLANNING GUIDE
                          </h3>
                          <p className="text-white/80 text-xs sm:text-sm">
                            Weekly meal planning for balanced nutrition
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            ● COMPLETE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSchedulePage;
