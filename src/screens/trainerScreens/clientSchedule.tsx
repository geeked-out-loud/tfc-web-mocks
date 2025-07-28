import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

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

const ClientSchedule: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date (July 2025)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 6, 25)); // July 25, 2025 (first appointment)
  const [activeToggle, setActiveToggle] = useState<'classes' | 'nutrition'>('classes');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleBackPress = () => {
    navigate(`/trainer/client/${clientId}`);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getSelectedAppointment = () => {
    if (!selectedDate) return null;
    return mockAppointments.find(apt => isSameDay(apt.date, selectedDate));
  };

  const hasAppointmentOnDate = (date: Date) => {
    return mockAppointments.some(apt => isSameDay(apt.date, date));
  };

  const daysInMonth = getDaysInMonth();
  const selectedAppointment = getSelectedAppointment();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackPress}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 ddc-hardware">SCHEDULE</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Month Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 ddc-hardware">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: (daysInMonth[0].getDay() + 6) % 7 }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((date) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const hasAppointment = hasAppointmentOnDate(date);
              const isCurrentDay = isToday(date);
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-lg transition-all
                    ${isSelected 
                      ? 'bg-[#262012] text-white' 
                      : isCurrentDay
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                    ${hasAppointment && !isSelected ? 'border-2 border-yellow-400' : ''}
                  `}
                >
                  <span className="ddc-hardware">{format(date, 'dd')}</span>
                  {hasAppointment && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-yellow-500'}`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveToggle('classes')}
              className={`
                flex-1 py-3 px-6 rounded-lg font-bold text-center transition-colors ddc-hardware
                ${activeToggle === 'classes' 
                  ? 'bg-[#262012] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              CLASSES
            </button>
            <button
              onClick={() => setActiveToggle('nutrition')}
              className={`
                flex-1 py-3 px-6 rounded-lg font-bold text-center transition-colors ddc-hardware
                ${activeToggle === 'nutrition' 
                  ? 'bg-[#262012] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              NUTRITION
            </button>
          </div>
        </div>

        {/* Appointment Card */}
        {selectedDate && selectedAppointment && (
          <div className="bg-white rounded-lg shadow-sm p-6">
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

        {/* No appointment message */}
        {selectedDate && !selectedAppointment && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">
              <p className="text-sm poppins-regular">
                No appointments scheduled for {format(selectedDate, 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSchedule;