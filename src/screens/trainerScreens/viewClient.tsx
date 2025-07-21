import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, ChevronRight, Users, Calendar, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

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

  // Use clientId to fetch specific client data (for now using mock data)
  console.log('Viewing client:', clientId);

  const handleBackPress = () => {
    navigate('/trainer/assigned-clients');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleBookAppointment = () => {
    // Navigate to book appointment page or open modal
    console.log('Book appointment for client:', mockClientData.id);
  };

  const handlePlanCardClick = () => {
    setIsPlanModalOpen(true);
  };

  const handleAssessmentClick = () => {
    setIsAssessmentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white flex items-center justify-between p-4">
        <button 
          onClick={handleBackPress}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
              {mockClientData.avatar ? (
                <img 
                  src={mockClientData.avatar}
                  alt={mockClientData.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white text-sm font-bold ddc-hardware">
                  {getInitials(mockClientData.name)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 poppins-regular">
                ID: {mockClientData.id}
              </p>
              <h1 className="text-lg font-bold text-gray-900 ddc-hardware">
                {mockClientData.name}
              </h1>
            </div>
          </div>
          <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Plan Status Header */}
        <h3 className="text-sm font-medium text-gray-900 poppins-medium">Plan status</h3>

        {/* Physical Live Sessions Card */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-800">
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
          <div className="p-4">
            <button 
              onClick={handlePlanCardClick}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-bold text-gray-900 ddc-hardware">PHYSICAL LIVE SESSIONS</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200">
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
          <div className="p-4">
            {activeTab === 'appointment' ? (
              <div className="space-y-4">
                {/* User Assessment */}
                <button 
                  onClick={handleAssessmentClick}
                  className="w-full flex bg-[#FDFAF0] items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-900 rounded flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 poppins-medium">User Assessment</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#D7A900]" />
                </button>

                {/* Upcoming Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3 poppins-medium">Upcoming</h4>
                  <div className="space-y-3">
                    {mockAppointments.upcoming.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-14 flex flex-col items-center justify-center bg-gray-100 rounded-md">
                            <span className="text-lg font-bold text-gray-900 ddc-hardware">
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
                  <h4 className="text-sm font-medium text-gray-600 mb-3 poppins-medium">Completed</h4>
                  <div className="space-y-3">
                    {mockAppointments.completed.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-14 flex flex-col items-center justify-center bg-gray-100 rounded-md">
                            <span className="text-lg font-bold text-gray-900 ddc-hardware">
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
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 poppins-regular">Gallery content will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Button - Fixed at bottom */}
      <div className="fixed bottom-4 left-4 right-4">
        <button
          onClick={handleBookAppointment}
          className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-center hover:bg-gray-800 transition-colors ddc-hardware"
        >
          BOOK APPOINTMENT
        </button>
      </div>

      {/* Bottom spacing for button */}
      <div className="h-20"></div>

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
              <button className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors ddc-hardware flex items-center justify-center space-x-2">
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
    </div>
  );
};

export default ViewClient;
