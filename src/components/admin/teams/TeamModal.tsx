import { X, UserPlus, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import type { Team, TeamMember } from '@types/teams';

interface TeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (teamData: Partial<Team>) => void;
    team: Team;
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, onSave, team }) => {
    const [formData, setFormData] = useState<Partial<Team>>({
        name: team.name,
        active: team.active,
        members: team.members
    });
    const [newMember, setNewMember] = useState({ name: '', role: '' });

    useEffect(() => {
        setFormData({
            name: team.name,
            active: team.active,
            members: team.members
        });
    }, [team]);

    const handleAddMember = () => {
        if (newMember.name && newMember.role) {
            const member: TeamMember = {
                id: `member-${Date.now()}`,
                name: newMember.name,
                role: newMember.role
            };
            setFormData({
                ...formData,
                members: [...(formData.members || []), member]
            });
            setNewMember({ name: '', role: '' });
        }
    };

    const handleRemoveMember = (memberId: string) => {
        setFormData({
            ...formData,
            members: formData.members?.filter(m => m.id !== memberId) || []
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" 
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-white">
                            {team.id ? 'Edit Team' : 'Create New Team'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Team Name */}
                        <div>
                            <label 
                                htmlFor="teamName" 
                                className="block text-sm font-medium text-gray-300"
                            >
                                Team Name
                            </label>
                            <input
                                type="text"
                                id="teamName"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                            />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center space-x-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.active ?? true}
                                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                />
                                <div className={`w-11 h-6 rounded-full peer bg-gray-600 peer-checked:bg-blue-500/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-blue-400`}></div>
                            </label>
                            <span className="text-sm font-medium text-gray-300">Active Status</span>
                        </div>

                        {/* Team Members */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-300">
                                Team Members
                            </label>
                            
                            {/* Member List */}
                            <div className="space-y-2">
                                {formData.members?.map(member => (
                                    <div 
                                        key={member.id}
                                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-white">{member.name}</p>
                                            <p className="text-xs text-gray-400">{member.role}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Member Form */}
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Member Name"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                    className="flex-1 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                    className="flex-1 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddMember}
                                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    <UserPlus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {team.id ? 'Update Team' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;
