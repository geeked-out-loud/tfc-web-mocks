import React, { useState } from 'react';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200">
        <button 
          onClick={handleBackPress}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 ddc-hardware">
          ASSIGNED CLIENTS
        </h1>
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="px-4 pb-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No clients found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Try adjusting your search terms' : 'You have no assigned clients yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.map((client, index) => (
              <button
                key={`${client.id}-${index}`}
                onClick={() => navigate(`/trainer/client/${client.id}`)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-4">
                  {/* Client Avatar */}
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
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
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-gray-900 ddc-hardware truncate">
                        {client.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 poppins-regular">
                      ID {client.id}
                    </p>
                  </div>
                </div>

                {/* Plan Status */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 poppins-regular mb-1">Plan status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
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
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default AssignedClients;
