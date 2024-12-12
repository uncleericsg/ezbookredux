import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Clock, MapPin, User, Wrench, Search, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceRequest } from '../../../types/service';

interface SearchSuggestion {
  type: 'name' | 'email' | 'phone' | 'address';
  value: string;
  label: string;
  icon: typeof Search;
}

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceRequest;
  onUpdate: (updatedService: ServiceRequest) => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  service,
  onUpdate,
}) => {
  const [editedService, setEditedService] = useState<ServiceRequest>(service);
  const [teams] = useState(['Team A', 'Team B', 'Team C']); // Replace with actual teams data

  const handleUpdate = () => {
    onUpdate(editedService);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ maxHeight: '100vh' }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl my-8"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-800 z-10 pb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Service Details</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  editedService.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  editedService.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  editedService.status === 'in-progress' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-green-500/10 text-green-400 border-green-500/20'
                } border`}>
                  {editedService.status.charAt(0).toUpperCase() + editedService.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-6 overflow-y-auto">
              {/* Customer Information */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Customer Name</label>
                    <input
                      type="text"
                      value={editedService.customerName}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Contact Number</label>
                    <input
                      type="text"
                      value={editedService.contactNumber}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                    <input
                      type="text"
                      value={editedService.email}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Service Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Service Type</label>
                    <input
                      type="text"
                      value={editedService.serviceType}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Scheduled Time</label>
                    <input
                      type="text"
                      value={format(editedService.scheduledTime, 'PPpp')}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Assigned Team</label>
                    <select
                      value={editedService.assignedTeam || ''}
                      onChange={(e) => setEditedService({
                        ...editedService,
                        assignedTeam: e.target.value,
                        status: e.target.value ? 'assigned' : 'pending'
                      })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
                    <select
                      value={editedService.status}
                      onChange={(e) => setEditedService({
                        ...editedService,
                        status: e.target.value as ServiceRequest['status']
                      })}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Location Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-gray-300">Block & Street</label>
                    <input
                      type="text"
                      value={editedService.address.blockStreet}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Floor & Unit</label>
                    <input
                      type="text"
                      value={editedService.address.floorUnit}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Postal Code</label>
                    <input
                      type="text"
                      value={editedService.address.postalCode}
                      readOnly
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                    />
                  </div>
                  {editedService.address.condoName && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Condo Name</label>
                      <input
                        type="text"
                        value={editedService.address.condoName}
                        readOnly
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                      />
                    </div>
                  )}
                  {editedService.address.lobbyTower && (
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Lobby/Tower</label>
                      <input
                        type="text"
                        value={editedService.address.lobbyTower}
                        readOnly
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Special Instructions</h3>
                <textarea
                  value={editedService.specialInstructions || ''}
                  onChange={(e) => setEditedService({
                    ...editedService,
                    specialInstructions: e.target.value
                  })}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-200 min-h-[100px] focus:border-blue-500 focus:outline-none"
                  placeholder="Add any special instructions or notes here..."
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-800 pt-4 mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Update Service
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ServiceQueue: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock data - Replace with API call
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      customerName: 'Alice Johnson',
      serviceType: 'maintenance',
      scheduledTime: new Date('2024-03-10T10:00:00'),
      location: 'Tampines Ave 4',
      contactNumber: '+65 9123 4567',
      email: 'alice@example.com',
      notes: 'Annual maintenance service',
      status: 'pending',
      assignedTeam: undefined,
      bookingReference: 'BK12345',
      specialInstructions: undefined,
      address: {
        blockStreet: '123 Tampines Ave 4',
        floorUnit: '01-123',
        postalCode: '123456',
        condoName: 'Tampines Condo',
        lobbyTower: 'Lobby A'
      }
    },
    {
      id: '2',
      customerName: 'Bob Smith',
      serviceType: 'repair',
      scheduledTime: new Date('2024-03-11T14:00:00'),
      location: 'Bedok North Ave 2',
      contactNumber: '+65 8234 5678',
      email: 'bob@example.com',
      notes: 'AC not cooling',
      status: 'pending',
      assignedTeam: undefined,
      bookingReference: 'BK67890',
      specialInstructions: undefined,
      address: {
        blockStreet: '456 Bedok North Ave 2',
        floorUnit: '02-456',
        postalCode: '987654',
        condoName: 'Bedok Condo',
        lobbyTower: 'Lobby B'
      }
    },
    // Add more mock data as needed
  ]);

  // Generate search suggestions based on input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const suggestions: SearchSuggestion[] = [];
    const searchLower = searchTerm.toLowerCase();

    serviceRequests.forEach(request => {
      // Name suggestions
      if (request.customerName.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'name',
          value: request.customerName,
          label: request.customerName,
          icon: User
        });
      }

      // Email suggestions
      if (request.email?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'email',
          value: request.email,
          label: request.email,
          icon: Mail
        });
      }

      // Phone suggestions
      if (request.contactNumber?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'phone',
          value: request.contactNumber,
          label: request.contactNumber,
          icon: Phone
        });
      }

      // Address suggestions
      if (request.location.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'address',
          value: request.location,
          label: request.location,
          icon: MapPin
        });
      }
    });

    // Remove duplicates and limit to 5 suggestions
    return Array.from(new Set(suggestions.map(s => s.value)))
      .map(value => suggestions.find(s => s.value === value)!)
      .slice(0, 5);
  }, [serviceRequests, searchTerm]);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered and sorted data
  const filteredRequests = useMemo(() => {
    return serviceRequests
      .filter(request => {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.customerName.toLowerCase().includes(searchLower) ||
          request.location.toLowerCase().includes(searchLower) ||
          request.email?.toLowerCase().includes(searchLower) ||
          request.contactNumber?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }, [serviceRequests, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (service: ServiceRequest) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleUpdateService = (updatedService: ServiceRequest) => {
    setServiceRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === updatedService.id ? updatedService : request
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search with Auto-suggestions */}
      <div className="p-4 border-b border-gray-700" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or address..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          
          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
              >
                {searchSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={`${suggestion.type}-${index}`}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setSearchTerm(suggestion.value);
                        setShowSuggestions(false);
                      }}
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-200">{suggestion.label}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {suggestion.type}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Service Request List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {paginatedRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-gray-750 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => handleViewDetails(request)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{request.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${
                      request.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      request.status === 'assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      request.status === 'in-progress' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-green-500/10 text-green-400 border-green-500/20'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(request.scheduledTime, 'MMM d, h:mm a')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>
                    {request.contactNumber && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{request.contactNumber}</span>
                      </div>
                    )}
                    {request.notes && (
                      <div className="text-sm text-gray-500 mt-1">
                        {request.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {request.assignedTeam && (
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {request.assignedTeam}
                    </span>
                  )}
                  <button
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(request);
                    }}
                  >
                    <Wrench className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredRequests.length)} of {filteredRequests.length} requests
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onUpdate={handleUpdateService}
        />
      )}
    </div>
  );
};

export default ServiceQueue;
