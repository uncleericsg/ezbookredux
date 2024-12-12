import React, { useState } from 'react';
import { 
    Users2, 
    CheckCircle2, 
    Star,
    BarChart3, 
    RefreshCw,
    Plus
} from 'lucide-react';
import TeamList from './TeamList';
import TeamAssignments from './TeamAssignments';
import TeamModal from './TeamModal';
import { Team } from '../../../types/teams';
import { mockTeams } from '../../../data/teams';

const TeamManagement: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>(mockTeams);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeView, setActiveView] = useState<'list' | 'assignments'>('list');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setModalOpen(true);
    };

    const handleDeleteTeam = (teamId: string) => {
        if (window.confirm('Are you sure you want to delete this team?')) {
            setTeams(teams.filter(team => team.id !== teamId));
        }
    };

    const handleUpdateTeam = (teamId: string, updates: Partial<Team>) => {
        setTeams(teams.map(team => 
            team.id === teamId ? { ...team, ...updates } : team
        ));
    };

    const handleCreateTeam = () => {
        setSelectedTeam(null);
        setModalOpen(true);
    };

    const handleSaveTeam = (teamData: Partial<Team>) => {
        if (selectedTeam) {
            // Update existing team
            setTeams(teams.map(team =>
                team.id === selectedTeam.id
                    ? { ...team, ...teamData }
                    : team
            ));
        } else {
            // Create new team
            const newTeam: Team = {
                id: `team-${teams.length + 1}`,
                name: teamData.name || 'New Team',
                active: teamData.active ?? true,
                members: [],
                stats: {
                    totalJobs: 0,
                    completedJobs: 0,
                    pendingJobs: 0,
                    rating: 0,
                    serviceTypes: {},
                    lastJobDate: new Date().toISOString()
                }
            };
            setTeams([...teams, newTeam]);
        }
        setModalOpen(false);
    };

    const refreshTeams = () => {
        setIsRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setTeams(mockTeams);
            setIsRefreshing(false);
        }, 1000);
    };

    // Calculate team statistics
    const totalTeams = teams.length;
    const totalCompletedJobs = teams.reduce((sum, team) => 
        sum + (team.stats?.completedJobs || 0), 0
    );
    const averageRating = teams.reduce((sum, team) => 
        sum + (team.stats?.rating || 0), 0
    ) / teams.length;

    // Calculate service type distribution
    const serviceTypeDistribution = teams.reduce((acc, team) => {
        if (team.stats?.serviceTypes) {
            Object.entries(team.stats.serviceTypes).forEach(([type, count]) => {
                acc[type] = (acc[type] || 0) + count;
            });
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            {/* Header */}
            <div className="border-b border-gray-700 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Team Management</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={refreshTeams}
                            className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                                isRefreshing ? 'animate-spin' : ''
                            }`}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <select 
                            className="bg-gray-700 rounded-lg px-4 py-2 text-gray-200 border border-gray-600 focus:outline-none focus:border-blue-500"
                            value={activeView}
                            onChange={(e) => setActiveView(e.target.value as 'list' | 'assignments')}
                        >
                            <option value="list">Team List</option>
                            <option value="assignments">Assignments</option>
                        </select>
                        <button 
                            onClick={handleCreateTeam}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Team</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                {activeView === 'list' ? (
                    <div>
                        {/* Metrics Overview */}
                        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Total Teams */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Teams</p>
                                        <p className="text-2xl font-bold mt-1">{totalTeams}</p>
                                    </div>
                                    <Users2 className="h-8 w-8 text-blue-400" />
                                </div>
                            </div>

                            {/* Completed Jobs */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Completed Jobs</p>
                                        <p className="text-2xl font-bold mt-1">{totalCompletedJobs}</p>
                                    </div>
                                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                                </div>
                            </div>

                            {/* Average Rating */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Average Rating</p>
                                        <p className="text-2xl font-bold mt-1">
                                            {averageRating.toFixed(1)}
                                        </p>
                                    </div>
                                    <Star className="h-8 w-8 text-yellow-400" />
                                </div>
                            </div>

                            {/* Service Types */}
                            <div className="bg-gray-700 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-gray-400 text-sm">Service Types</p>
                                    <BarChart3 className="h-8 w-8 text-purple-400" />
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(serviceTypeDistribution)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 3)
                                        .map(([type, count]) => (
                                            <div key={type} className="flex items-center text-sm">
                                                <span className="flex-1 text-gray-400">
                                                    {type.split('_').join(' ').toLowerCase()}
                                                </span>
                                                <span className="font-medium">{count}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Team List */}
                        <TeamList
                            teams={teams}
                            onEdit={handleEditTeam}
                            onDelete={handleDeleteTeam}
                            onUpdateTeam={handleUpdateTeam}
                        />
                    </div>
                ) : (
                    <TeamAssignments teams={teams} />
                )}
            </div>

            {/* Team Modal */}
            {isModalOpen && (
                <TeamModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveTeam}
                    team={selectedTeam || {
                        id: '',
                        name: '',
                        active: true,
                        members: [],
                        stats: {
                            totalJobs: 0,
                            completedJobs: 0,
                            pendingJobs: 0,
                            rating: 0,
                            serviceTypes: {},
                            lastJobDate: new Date().toISOString()
                        }
                    }}
                />
            )}
        </div>
    );
};

export default TeamManagement;
