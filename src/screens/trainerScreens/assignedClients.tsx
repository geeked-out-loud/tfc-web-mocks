import React, { useState } from 'react';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../components/ui/scrollbar-hide.css';

// Mock data for assigned clients
const mockClients = [
  {
    id: '12345678',
    name: 'AJAY',
    avatar: null,
    planStatus: 'INACTIVE'
  },
  {
    id: '12345678', 
    name: 'ARJUN PALUOY',
    avatar: '/experts.png',
    planStatus: 'ACTIVE'
  },
  {
    id: '12345678',
    name: 'AJAY',
    avatar: null,
    planStatus: 'INACTIVE'
  },
  {
    id: '12345678',
    name: 'VIJAY MALVYA',
    avatar: null,
    planStatus: 'ACTIVE'
  }
];

const AssignedClients: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter clients based on search query
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.id.includes(searchQuery)
  );

  const handleBackPress = () => {
    navigate('/trainer/dashboard');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto min-h-screen bg-white shadow-lg lg:shadow-xl">
        {/* Header */}
        <header className="flex items-center p-4 lg:p-6 border-b border-gray-200">
          <button 
            onClick={handleBackPress}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 ddc-hardware">
              ASSIGNED CLIENTS
            </h1>
            <p className="text-sm text-gray-500 mt-1 hidden lg:block">
              Manage and view your assigned clients
            </p>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Removed total client count */}
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-4 lg:p-6 lg:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            
            {/* Removed mobile client count and filter options */}
          </div>
        </div>

        {/* Clients List */}
        <div className="px-4 lg:px-6 pb-4 lg:pb-6">
          {filteredClients.length === 0 ? (
            <div className="text-center py-16 lg:py-24">
              <Users className="h-16 w-16 lg:h-20 lg:w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-xl lg:text-2xl font-bold text-gray-600 mb-3">No clients found</h2>
              <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                {searchQuery 
                  ? 'Try adjusting your search terms or check the spelling' 
                  : 'You have no assigned clients yet. New clients will appear here once assigned.'
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 text-sm text-yellow-600 hover:text-yellow-700 border border-yellow-200 hover:border-yellow-300 rounded-lg transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile view - Card-style with dividers */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredClients.map((client, index) => (
                  <button
                    key={`${client.id}-${index}`}
                    onClick={() => navigate(`/trainer/client/${client.id}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:scale-98 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Client Avatar */}
                      <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {client.avatar ? (
                          <img 
                            src={client.avatar}
                            alt={client.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white text-sm font-bold ddc-hardware">
                            {getInitials(client.name)}
                          </div>
                        )}
                      </div>
                      
                      {/* Client Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 poppins-regular mb-1">
                          ID: {client.id}
                        </p>
                        <h3 className="text-lg font-bold text-gray-900 ddc-hardware truncate">
                          {client.name}
                        </h3>
                      </div>
                    </div>

                    {/* Plan Status */}
                    <div className="flex flex-col items-end">
                      <p className="text-xs text-gray-500 poppins-regular mb-2">Plan status</p>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                        client.planStatus === 'ACTIVE' 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          client.planStatus === 'ACTIVE' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></span>
                        {client.planStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Desktop view - Scrollable Grid Cards */}
              <div className="hidden lg:block">
                <div className="h-96 overflow-y-auto scrollbar-hide">
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pr-2">
                    {filteredClients.map((client, index) => (
                      <button
                        key={`desktop-${client.id}-${index}`}
                        onClick={() => navigate(`/trainer/client/${client.id}`)}
                        className="group bg-white border border-gray-200 rounded-xl p-6 hover:scale-105 transition-transform duration-200 text-left"
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Client Avatar */}
                          <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {client.avatar ? (
                              <img 
                                src={client.avatar}
                                alt={client.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white text-xl font-bold ddc-hardware">
                                {getInitials(client.name)}
                              </div>
                            )}
                          </div>
                          
                          {/* Client Info */}
                          <div className="w-full space-y-3">
                            <h3 className="font-bold text-gray-900 ddc-hardware text-xl mb-2 truncate">
                              {client.name}
                            </h3>
                            <p className="text-sm text-gray-500 poppins-regular mb-3 bg-gray-50 px-3 py-1 rounded-full">
                              ID: {client.id}
                            </p>
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border-2 ${
                                client.planStatus === 'ACTIVE' 
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                              }`}>
                                <span className={`w-3 h-3 rounded-full mr-2 ${
                                  client.planStatus === 'ACTIVE' ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}></span>
                                {client.planStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tablet view - List with enhanced design */}
              <div className="hidden md:block lg:hidden">
                <div className="space-y-4">
                  {filteredClients.map((client, index) => (
                    <button
                      key={`tablet-${client.id}-${index}`}
                      onClick={() => navigate(`/trainer/client/${client.id}`)}
                      className="w-full flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl hover:scale-105 transition-transform duration-200 text-left"
                    >
                      <div className="flex items-center space-x-6">
                        {/* Client Avatar */}
                        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {client.avatar ? (
                            <img 
                              src={client.avatar}
                              alt={client.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white text-lg font-bold ddc-hardware">
                              {getInitials(client.name)}
                            </div>
                          )}
                        </div>
                        
                        {/* Client Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 ddc-hardware truncate">
                              {client.name}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              client.planStatus === 'ACTIVE' 
                                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                client.planStatus === 'ACTIVE' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}></span>
                              {client.planStatus}
                            </span>
                          </div>
                          <p className="text-base text-gray-500 poppins-regular">
                            Client ID: {client.id}
                          </p>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20 lg:h-0"></div>
      </div>
    </div>
  );
};

export default AssignedClients;
