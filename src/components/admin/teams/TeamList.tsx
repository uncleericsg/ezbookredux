import { Edit2, Trash2, UserPlus, Users2, Star, BarChart3 } from 'lucide-react';
import React from 'react';

import type { Team } from '@types/teams';

interface TeamListProps {
    teams: Team[];
    onEdit: (team: Team) => void;
    onDelete: (teamId: string) => void;
    onUpdateTeam: (teamId: string, updates: Partial<Team>) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, onEdit, onDelete, onUpdateTeam }) => {
    return (
        <div className="p-6 pb-48">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map(team => (
                    <div 
                        key={team.id} 
                        className="bg-gray-700 rounded-lg p-6 space-y-4 hover:bg-gray-600 transition-colors"
                    >
                        {/* Team Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {team.name}
                                </h3>
                                <div className="flex items-center mt-1 text-gray-400">
                                    <Users2 className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                        {team.members.length} members
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(team)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-500/50 transition-colors"
                                    aria-label="Edit team"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(team.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-500/50 transition-colors"
                                    aria-label="Delete team"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Team Status */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-400">Status</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={team.active}
                                    onChange={(e) => onUpdateTeam(team.id, { active: e.target.checked })}
                                />
                                <div className={`
                                    w-11 h-6 rounded-full peer 
                                    bg-gray-600 peer-checked:bg-blue-500/30
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                    after:bg-gray-400 after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:after:translate-x-full 
                                    peer-checked:after:bg-blue-400
                                `}></div>
                            </label>
                        </div>

                        {/* Team Performance */}
                        {team.stats && (
                            <div className="pt-4 border-t border-gray-600 space-y-4">
                                {/* Job Statistics */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            {team.stats.completedJobs}
                                        </div>
                                        <div className="text-xs text-gray-400">Completed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            {team.stats.pendingJobs}
                                        </div>
                                        <div className="text-xs text-gray-400">Pending</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white flex items-center justify-center">
                                            {team.stats.rating}
                                            <Star className="h-4 w-4 ml-1 text-yellow-400" />
                                        </div>
                                        <div className="text-xs text-gray-400">Rating</div>
                                    </div>
                                </div>

                                {/* Service Type Distribution */}
                                <div>
                                    <div className="flex items-center mb-2">
                                        <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-400">Service Types</span>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(team.stats.serviceTypes)
                                            .sort(([, a], [, b]) => b - a)
                                            .slice(0, 3)
                                            .map(([type, count]) => (
                                                <div key={type} className="flex items-center">
                                                    <div className="flex-1">
                                                        <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ 
                                                                    width: `${(count / Object.values(team.stats!.serviceTypes).reduce((a, b) => a + b, 0)) * 100}%` 
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        {type.split('_').join(' ').toLowerCase()} ({count})
                                                    </span>
                                                </div>
                                            )))
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Team Details */}
                        <div className="pt-4 border-t border-gray-600 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Max Bookings/Day</span>
                                <span className="text-gray-200">{team.maxBookingsPerDay}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Created</span>
                                <span className="text-gray-200">
                                    {new Date(team.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Add Member Button */}
                        <button
                            onClick={() => onEdit(team)}
                            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-gray-200"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Add Member</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamList;
