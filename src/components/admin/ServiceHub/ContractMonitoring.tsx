import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, AlertCircle, Search, ChevronLeft, ChevronRight, FileText, User, Mail, Phone, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

interface ServiceContract {
  id: string;
  customerName: string;
  contractType: 'AMC1X' | 'AMC2X' | 'AMC3X' | 'AMC4X' | 'AMC5X' | 'AMC6X' | 'AMC7X' | 'AMC8X';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expiring' | 'expired';
  lastService?: Date;
  nextService?: Date;
  servicesCompleted: number;
  contactNumber?: string;
  email?: string;
  location?: string;
}

interface SearchSuggestion {
  type: 'name' | 'email' | 'phone' | 'address';
  value: string;
  label: string;
  icon: typeof Search | typeof User | typeof Mail | typeof Phone | typeof MapPin;
}

interface ContractRules {
  servicesPerYear: number;
  expiryWarningDays: number;
  healthThresholds: {
    good: number;
    warning: number;
  };
}

const AMC_RULES: Record<ServiceContract['contractType'], ContractRules> = {
  'AMC1X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC2X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC3X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC4X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC5X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC6X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC7X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } },
  'AMC8X': { servicesPerYear: 4, expiryWarningDays: 30, healthThresholds: { good: 80, warning: 60 } }
};

const ContractMonitoring: React.FC = () => {
  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    contractType: 'all',
    status: 'all'
  });

  // Mock data - Replace with API call
  const contracts: ServiceContract[] = [
    {
      id: '1',
      customerName: 'John Smith',
      contractType: 'AMC1X',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'active',
      lastService: new Date('2024-02-15'),
      servicesCompleted: 2,
      contactNumber: '1234567890',
      email: 'john.smith@example.com',
      location: 'New York, USA',
    },
    // Add more mock data as needed
  ];

  // Filtered and sorted data
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filters.contractType === 'all' || contract.contractType === filters.contractType;
      const matchesStatus = filters.status === 'all' || contract.status === filters.status;
      
      return matchesSearch && matchesType && matchesStatus;
    }).sort((a, b) => {
      // Sort by status priority (expiring first, then active, then expired)
      const statusOrder = { expiring: 0, active: 1, expired: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then sort by end date
      return a.endDate.getTime() - b.endDate.getTime();
    });
  }, [contracts, searchTerm, filters]);

  // Generate search suggestions based on input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const suggestions: SearchSuggestion[] = [];
    const searchLower = searchTerm.toLowerCase();

    contracts.forEach(contract => {
      // Name suggestions
      if (contract.customerName.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'name',
          value: contract.customerName,
          label: contract.customerName,
          icon: User
        });
      }

      // Email suggestions
      if (contract.email?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'email',
          value: contract.email,
          label: contract.email,
          icon: Mail
        });
      }

      // Phone suggestions
      if (contract.contactNumber?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'phone',
          value: contract.contactNumber,
          label: contract.contactNumber,
          icon: Phone
        });
      }

      // Address suggestions
      if (contract.location?.toLowerCase().includes(searchLower)) {
        suggestions.push({
          type: 'address',
          value: contract.location,
          label: contract.location,
          icon: MapPin
        });
      }
    });

    return Array.from(new Set(suggestions.map(s => s.value)))
      .map(value => suggestions.find(s => s.value === value)!)
      .slice(0, 5);
  }, [contracts, searchTerm]);

  // Handle click outside search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredContracts.length / pageSize);
  const paginatedContracts = filteredContracts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const getContractTypeColor = (type: ServiceContract['contractType']) => {
    switch (type) {
      case 'AMC1X':
      case 'AMC2X':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AMC3X':
      case 'AMC4X':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'AMC5X':
      case 'AMC6X':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'AMC7X':
      case 'AMC8X':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const getStatusColor = (status: ServiceContract['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'expiring':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const days = differenceInDays(endDate, new Date());
    return days;
  };

  const getContractHealth = (contract: ServiceContract) => {
    const rules = AMC_RULES[contract.contractType];
    const daysRemaining = getDaysRemaining(contract.endDate);
    
    let healthScore = 100;
    
    // Deduct points for approaching expiry (30% weight)
    if (daysRemaining < rules.expiryWarningDays) {
      healthScore -= ((rules.expiryWarningDays - daysRemaining) / rules.expiryWarningDays) * 30;
    }
    
    // Calculate service completion ratio (70% weight)
    const expectedServices = Math.min(4, Math.ceil((differenceInDays(new Date(), contract.startDate) / 365) * 4));
    const serviceRatio = contract.servicesCompleted / expectedServices;
    if (serviceRatio < 1) {
      healthScore -= (1 - serviceRatio) * 70;
    }
    
    return Math.max(0, Math.min(100, healthScore));
  };

  const getNextServiceDate = (contract: ServiceContract) => {
    // Standard for all AMC types: 4 services per year = 91.25 days between services
    const daysPerService = 365 / 4;
    
    if (!contract.lastService) {
      return new Date();
    }
    
    const nextDate = new Date(contract.lastService);
    nextDate.setDate(nextDate.getDate() + daysPerService);
    return nextDate;
  };

  const getServiceProgress = (contract: ServiceContract) => {
    const currentDate = new Date();
    const daysSinceStart = differenceInDays(currentDate, contract.startDate);
    const daysInContract = differenceInDays(contract.endDate, contract.startDate);
    const expectedServices = Math.min(4, Math.ceil((daysSinceStart / 365) * 4));
    
    return {
      completed: contract.servicesCompleted,
      expected: expectedServices,
      total: 4,
      isOnTrack: contract.servicesCompleted >= expectedServices
    };
  };

  const getHealthColor = (contract: ServiceContract) => {
    const health = getContractHealth(contract);
    const rules = AMC_RULES[contract.contractType];
    
    if (health >= rules.healthThresholds.good) {
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    } else if (health >= rules.healthThresholds.warning) {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    } else {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-4 space-y-4 border-b border-gray-700">
        <div className="flex space-x-4">
          <div className="relative flex-1" ref={searchRef}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(suggestion.value);
                        setShowSuggestions(false);
                      }}
                    >
                      <suggestion.icon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-300">{suggestion.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <select
            className="bg-gray-700 rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={filters.contractType}
            onChange={(e) => setFilters(prev => ({ ...prev, contractType: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="AMC1X">AMC1X</option>
            <option value="AMC2X">AMC2X</option>
            <option value="AMC3X">AMC3X</option>
            <option value="AMC4X">AMC4X</option>
            <option value="AMC5X">AMC5X</option>
            <option value="AMC6X">AMC6X</option>
            <option value="AMC7X">AMC7X</option>
            <option value="AMC8X">AMC8X</option>
          </select>
          <select
            className="bg-gray-700 rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Contracts List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {paginatedContracts.map((contract) => (
            <div
              key={contract.id}
              className="p-4 bg-gray-750 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{contract.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getContractTypeColor(contract.contractType)}`}>
                      {contract.contractType}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getHealthColor(contract)}`}>
                      Health: {Math.round(getContractHealth(contract))}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Valid: {format(contract.startDate, 'MMM d, yyyy')} - {format(contract.endDate, 'MMM d, yyyy')}</span>
                    </div>
                    {contract.status !== 'expired' && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{getDaysRemaining(contract.endDate)} days remaining</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const progress = getServiceProgress(contract);
                        return (
                          <span className={progress.isOnTrack ? 'text-green-400' : 'text-yellow-400'}>
                            Services Completed: {progress.completed}/{progress.expected} 
                            (Total Required: {progress.total})
                          </span>
                        );
                      })()}
                    </div>
                    {contract.lastService && (
                      <div className="flex items-center space-x-2">
                        <span>Last Service: {format(contract.lastService, 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span>Next Service: {format(getNextServiceDate(contract), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  onClick={() => {/* Handle view details */}}
                >
                  <FileText className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <select
              className="bg-gray-700 rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
            <span className="text-sm text-gray-400">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredContracts.length)} of {filteredContracts.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              className="p-2 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractMonitoring;
