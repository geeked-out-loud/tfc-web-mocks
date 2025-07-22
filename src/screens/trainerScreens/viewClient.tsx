import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, ChevronRight, Users, Calendar, Edit, Clock, ChevronLeft, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../../components/ui/scrollbar-hide.css';

// Mock client data
const mockClientData = {
  id: '12312434',
  name: 'ARJUN PALUOY',
  avatar: '/experts.png',
  planStatus: 'ACTIVE'
};

// Mock appointments data
const mockAppointments = {
  upcoming: [
    {
      id: 'apt-001',
      date: new Date(),
      appointmentNumber: 2,
      type: 'EXERCISE',
      status: 'upcoming'
    }
  ],
  completed: [
    {
      id: 'apt-002',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      appointmentNumber: 2,
      type: 'EXERCISE',
      status: 'completed'
    },
    {
      id: 'apt-003',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      appointmentNumber: 2,
      type: 'EXERCISE',
      status: 'completed'
    }
  ]
};

const ViewClient: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<'appointment' | 'gallery'>('appointment');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [bookedAppointment, setBookedAppointment] = useState<{date: string, time: string} | null>(null);

  // Generate available dates for the current month
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

  const availableDates = generateAvailableDates();

  // Time slots with proper formatting
  const timeSlots = [
    '3:30 PM',
    '5:30 PM', 
    '6:30 PM',
    '8:30 PM',
    '10:30 PM'
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Use clientId to fetch specific client data (for now using mock data)
  console.log('Viewing client:', clientId);

  const handleBackPress = () => {
    navigate('/trainer/assigned-clients');
  };

  const handleScheduleClick = () => {
    navigate(`/trainer/client/${clientId}/schedule`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleBookAppointment = () => {
    setIsBookAppointmentModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookAppointmentModalOpen(false);
    setShowConfirmation(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookedAppointment(null);
  };

  const handleBookSession = () => {
    if (selectedDate && selectedTime) {
      // Store the booked appointment details
      setBookedAppointment({
        date: format(selectedDate, 'do MMMM yyyy'),
        time: selectedTime
      });
      
      // Show confirmation within the same modal
      setShowConfirmation(true);
      
      // Reset selection for next booking
      setSelectedDate(null);
      setSelectedTime(null);
    }
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

  const handlePlanCardClick = () => {
    setIsPlanModalOpen(true);
  };

  const handleAssessmentClick = () => {
    setIsAssessmentModalOpen(true);
  };

  const handleModifyPlanClick = () => {
    navigate(`/trainer/client/${clientId}/modify-plan`);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-gray-50 lg:overflow-hidden">
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto min-h-screen lg:h-full bg-white shadow-lg lg:shadow-xl lg:flex lg:flex-col">
        {/* Top Navigation */}
        <div className="bg-white flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 lg:flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackPress}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-900 ddc-hardware">CLIENT DETAILS</h1>
              <p className="text-sm text-gray-500">Manage client information and appointments</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:overflow-hidden lg:flex lg:space-x-8 lg:p-6">
          {/* Left Column - Client Info & Actions */}
          <div className="lg:w-1/3 lg:flex lg:flex-col lg:space-y-6 lg:overflow-y-auto scrollbar-hide">
            {/* User Profile Section */}
            <div className="bg-white px-4 lg:px-6 pb-4 lg:pb-6 lg:border lg:border-gray-200 lg:rounded-lg flex-shrink-0">
              <div className="flex items-center justify-between py-4 lg:py-0 lg:pt-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 lg:h-16 lg:w-16 rounded-full bg-gray-200 overflow-hidden">
                    {mockClientData.avatar ? (
                      <img 
                        src={mockClientData.avatar}
                        alt={mockClientData.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white text-sm lg:text-base font-bold ddc-hardware">
                        {getInitials(mockClientData.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 poppins-regular">
                      ID: {mockClientData.id}
                    </p>
                    <h1 className="text-lg lg:text-xl font-bold text-gray-900 ddc-hardware">
                      {mockClientData.name}
                    </h1>
                  </div>
                </div>
                
                {/* Action Buttons - Desktop */}
                <div className="hidden lg:flex flex-col space-y-2">
                  <button 
                    onClick={handleScheduleClick}
                    className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="flex items-center space-x-2 lg:hidden">
                  <button 
                    onClick={handleScheduleClick}
                    className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* Plan Status Header - Desktop Enhanced */}
              <div className="hidden lg:block mt-6">
                <h3 className="text-lg font-medium text-gray-900 poppins-medium mb-4">Plan Status</h3>
              </div>

              {/* Plan Status Header - Mobile */}
              <div className="lg:hidden">
                <h3 className="text-sm font-medium text-gray-900 poppins-medium">Plan status</h3>
              </div>
            </div>

            {/* Physical Live Sessions Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm lg:border lg:border-gray-200 mx-4 lg:mx-0 flex-shrink-0">
              <div className="relative h-32 lg:h-40 bg-gradient-to-r from-blue-600 to-blue-800">
                <img 
                  src="/exercise.jpg" 
                  alt="Physical Live Sessions"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    ● ACTIVE
                  </span>
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <button 
                  onClick={handlePlanCardClick}
                  className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 ddc-hardware text-base lg:text-lg">PHYSICAL LIVE SESSIONS</h3>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Book Appointment Button - Desktop */}
            <div className="hidden lg:block mx-4 lg:mx-0 mt-auto">
              <button
                onClick={handleBookAppointment}
                className="w-full bg-[#262012] text-white py-3 rounded-lg font-bold text-center hover:bg-opacity-90 transition-colors ddc-hardware"
              >
                BOOK APPOINTMENT
              </button>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:flex-1 mt-4 lg:mt-0 lg:overflow-hidden lg:flex lg:flex-col">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm lg:border lg:border-gray-200 mx-4 lg:mx-0 lg:flex-1 lg:flex lg:flex-col lg:overflow-hidden">
              <div className="flex border-b border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('appointment')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'appointment'
                      ? 'text-gray-900 border-b-2 border-yellow-500 bg-yellow-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  APPOINTMENT
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === 'gallery'
                      ? 'text-gray-900 border-b-2 border-yellow-500 bg-yellow-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  GALLERY
                </button>
              </div>

              {/* Tab Content */}
              <div className="lg:flex-1 lg:overflow-hidden">
                <div className="p-4 lg:p-6 lg:h-full">
                {activeTab === 'appointment' ? (
                  <div className="max-h-96 lg:h-full overflow-y-auto scrollbar-hide">
                    <div className="space-y-4 lg:space-y-6 pr-2 pb-20 lg:pb-0">
                      {/* User Assessment */}
                      <button 
                        onClick={handleAssessmentClick}
                        className="w-full flex bg-[#FDFAF0] items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 lg:h-10 lg:w-10 bg-gray-900 rounded flex items-center justify-center">
                            <Users className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-900 poppins-medium">User Assessment</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#D7A900]" />
                      </button>

                      {/* Upcoming Section */}
                      <div>
                        <h4 className="text-sm lg:text-base font-medium text-gray-600 mb-3 lg:mb-4 poppins-medium">Upcoming</h4>
                        <div className="space-y-3 lg:space-y-4">
                          {mockAppointments.upcoming.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center bg-gray-100 rounded-md">
                                  <span className="text-lg lg:text-xl font-bold text-gray-900 ddc-hardware">
                                    {format(appointment.date, 'dd')}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {format(appointment.date, 'MMM')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 poppins-medium">
                                    Appointment {appointment.appointmentNumber}
                                  </p>
                                  <span className="inline-block mt-1 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                                    {appointment.type}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Completed Section */}
                      <div>
                        <h4 className="text-sm lg:text-base font-medium text-gray-600 mb-3 lg:mb-4 poppins-medium">Completed</h4>
                        <div className="space-y-3 lg:space-y-4">
                          {mockAppointments.completed.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center bg-gray-100 rounded-md">
                                  <span className="text-lg lg:text-xl font-bold text-gray-900 ddc-hardware">
                                    {format(appointment.date, 'dd')}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {format(appointment.date, 'MMM')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 poppins-medium">
                                    Appointment {appointment.appointmentNumber}
                                  </p>
                                  <span className="inline-block mt-1 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                                    {appointment.type}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-96 lg:h-full overflow-y-auto scrollbar-hide">
                    <div className="text-center py-12 lg:py-16 pr-2 pb-20 lg:pb-0">
                      <p className="text-gray-500 poppins-regular lg:text-lg">Gallery content will be displayed here</p>
                      {/* Mock gallery items for demonstration */}
                      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Photo {i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointment Button - Mobile */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
          <button
            onClick={handleBookAppointment}
            className="w-full bg-[#262012] text-white py-3 rounded-lg font-bold text-center hover:bg-opacity-90 transition-colors ddc-hardware shadow-lg"
          >
            BOOK APPOINTMENT
          </button>
        </div>
      </div>

      {/* Plan Details Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsPlanModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-t-3xl animate-slide-up-enter overflow-hidden">
            {/* Header */}
            <div className="text-center py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 ddc-hardware">PLAN DETAILS</h2>
            </div>

            {/* Plan Card */}
            <div className="p-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <div className="relative h-24 bg-gradient-to-r from-blue-600 to-blue-800">
                  <img 
                    src="/exercise.jpg" 
                    alt="Physical Live Sessions"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ● ACTIVE
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 ddc-hardware text-sm">PHYSICAL LIVE SESSIONS</h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="px-4 pb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Included in the plan</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-medium ddc-hardware">BICEPS X 30 DAYS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-medium ddc-hardware">TRICEPS X 30 DAYS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-medium ddc-hardware">SITUPS X 30 DAYS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-medium ddc-hardware">CHEST EXERCISES X 30 DAYS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className="text-sm text-gray-700 font-medium ddc-hardware">BURNOUT EXERCISES X 30 DAYS</span>
                </div>
              </div>
            </div>

            {/* Modify Plan Button */}
            <div className="px-4 pb-6">
              <button 
                onClick={handleModifyPlanClick}
                className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors ddc-hardware flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>MODIFY PLAN</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Assessment Modal */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsAssessmentModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-t-3xl animate-slide-up-enter overflow-hidden">
            {/* Header */}
            <div className="text-center py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 ddc-hardware">USER ASSESSMENT</h2>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Goals Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2 ddc-hardware">Goals</h3>
                <p className="text-sm text-gray-700 ddc-hardware">TO BURN MORE CALORIES</p>
              </div>

              {/* Injuries Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2 ddc-hardware">Injuries</h3>
                <p className="text-sm text-gray-700 ddc-hardware">RIGHT HAND THUMB INJURY</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {isBookAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseBookingModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-t-3xl animate-slide-up-enter overflow-hidden">
            {!showConfirmation ? (
              <>
                {/* Header */}
                <div className="text-center py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900 ddc-hardware">BOOK APPOINTMENT</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Choose date section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Choose date</h3>
                      <div className="flex items-center space-x-2 text-base text-gray-600">
                        <button
                          onClick={handlePrevMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium">{monthNames[currentMonth]} {currentYear}</span>
                        <button
                          onClick={handleNextMonth}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronLeft className="w-5 h-5 rotate-180" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Date buttons - Horizontal scroll */}
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
                          
                          <div className="text-2xl font-bold mb-1">{dateObj.day}</div>
                          <div className="text-sm">{dateObj.dayName}</div>
                          
                          {/* Bottom golden bar for selected date */}
                          {selectedDate && selectedDate.getTime() === dateObj.date.getTime() && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select time section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Select time</h3>
                    
                    {/* Time slots in 2 columns grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                            selectedTime === time
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <Clock className={`w-5 h-5 mr-3 ${
                              selectedTime === time ? 'text-yellow-600' : 'text-gray-500'
                            }`} />
                            <span className={`font-medium ${
                              selectedTime === time ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {time}
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedTime === time
                              ? 'border-yellow-500 bg-yellow-500'
                              : 'border-gray-400'
                          }`}>
                            {selectedTime === time && (
                              <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBookSession}
                    disabled={!selectedDate || !selectedTime}
                    className={`w-full py-4 rounded-lg font-semibold text-center transition-colors ddc-hardware ${
                      selectedDate && selectedTime
                        ? 'bg-[#262012] text-white hover:bg-opacity-90'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    BOOK SESSION
                  </button>
                </div>
              </>
            ) : bookedAppointment && (
              <>
                {/* Close Button */}
                <button
                  onClick={handleCloseBookingModal}
                  className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Confirmation Content - Full Height */}
                <div className="relative h-[600px]">
                  {/* Top Section with confirm.png image */}
                  <div className="h-[380px] relative overflow-hidden -mx-0">
                    <img 
                      src="/confirm.png" 
                      alt="Confirmation"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* White bottom section */}
                  <div className="absolute top-[380px] left-0 right-0 bottom-0 pt-6 px-6">
                    {/* Content in white section */}
                    <div className="pt-3 pb-6 text-center h-full flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 ddc-hardware mb-2">
                          ASSESSMENT BOOKED
                        </h2>
                        
                        {/* Date */}
                        <p className="text-gray-600 text-base">
                          for {bookedAppointment.date} - {bookedAppointment.time}
                        </p>
                      </div>
                      
                      {/* OK Button at bottom */}
                      <button
                        onClick={handleCloseBookingModal}
                        className="w-full bg-[#262012] text-white py-3 rounded-lg font-bold text-center hover:bg-opacity-90 transition-colors ddc-hardware"
                      >
                        OKAY
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClient;
