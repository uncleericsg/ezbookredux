import { Calendar, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { mockTeams } from '@data/teams';

import type { Team } from '@types/teams';

interface TeamAssignmentsProps {
    teams: Team[];
}

const TeamAssignments: React.FC<TeamAssignmentsProps> = ({ teams }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTeam, setSelectedTeam] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    // Mock assignments data
    const mockAssignments = [
        {
            id: '1',
            bookingId: 'BK-001',
            teamId: mockTeams[0].id,
            time: '09:00 AM',
            status: 'pending',
            serviceType: 'AIRCON_SERVICE'
        },
        {
            id: '2',
            bookingId: 'BK-002',
            teamId: mockTeams[1].id,
            time: '10:30 AM',
            status: 'accepted',
            serviceType: 'AIRCON_REPAIR'
        },
        {
            id: '3',
            bookingId: 'BK-003',
            teamId: mockTeams[0].id,
            time: '02:00 PM',
            status: 'completed',
            serviceType: 'AIRCON_INSTALLATION'
        }
    ];

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-400';
            case 'accepted':
                return 'bg-green-500/20 text-green-400';
            case 'completed':
                return 'bg-blue-500/20 text-blue-400';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6 p-6 pb-48">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                {/* Date Picker */}
                <div className="relative">
                    <input
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Team Filter */}
                <div className="relative">
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                        <option value="all">All Teams</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Booking ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Team
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Service Type
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                                        Loading assignments...
                                    </td>
                                </tr>
                            ) : mockAssignments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                                        No assignments found for the selected date and team.
                                    </td>
                                </tr>
                            ) : (
                                mockAssignments.map(assignment => (
                                    <tr key={assignment.id} className="hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {assignment.bookingId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {teams.find(t => t.id === assignment.teamId)?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {assignment.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(assignment.status)}`}>
                                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                            {assignment.serviceType.split('_').join(' ').toLowerCase()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamAssignments;
